import { createClerkClient, verifyToken } from '@clerk/backend';
import { DurableObject } from 'cloudflare:workers';
import { v4 as uuidv4 } from 'uuid';

const LIMIT_MESSAGES_LOAD = 10;

interface IPayload {
	id: string;
	user: {
		id: string;
	};
	message: string;
	type: 'message' | 'loadmore';
	lastId: string;
}

interface ISendPayload {
	id: string;
	user: any;
	message: string;
	type: 'message' | 'loadmore';
	timestamp: string;
}

/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */

/** A Durable Object's behavior is defined in an exported Javascript class */
export class MyDurableObject extends DurableObject<Env> {
	private storage;
	private sessions: Map<WebSocket, any>;
	private lastTimestamp: number;
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param ctx - The interface for interacting with Durable Object state
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		this.ctx = ctx;

		// `ctx.storage` provides access to our durable storage. It provides a simple KV
		// get()/put() interface.
		this.storage = ctx.storage;

		// `env` is our environment bindings (discussed earlier).
		this.env = env;

		// We will track metadata for each client WebSocket object in `sessions`.
		this.sessions = new Map();
		this.ctx.getWebSockets().forEach((webSocket) => {
			// The constructor may have been called when waking up from hibernation,
			// so get previously serialized metadata for any existing WebSockets.
			let meta = webSocket.deserializeAttachment();

			console.log('Websocket meta: ', meta);

			// We don't send any messages to the client until it has sent us the initial user info
			// message. Until then, we will queue messages in `session.blockedMessages`.
			// This could have been arbitrarily large, so we won't put it in the attachment.
			let blockedMessages: any[] = [];
			this.sessions.set(webSocket, { ...meta, blockedMessages });
		});

		// We keep track of the last-seen message's timestamp just so that we can assign monotonically
		// increasing timestamps even if multiple messages arrive simultaneously (see below). There's
		// no need to store this to disk since we assume if the object is destroyed and recreated, much
		// more than a millisecond will have gone by.
		this.lastTimestamp = 0;
	}

	// The system will call fetch() whenever an HTTP request is sent to this Object. Such requests
	// can only be sent from other Worker code, such as the code above; these requests don't come
	// directly from the internet. In the future, we will support other formats than HTTP for these
	// communications, but we started with HTTP for its familiarity.
	async fetch(request: Request) {
		let url = new URL(request.url);

		const auth = url.searchParams.get('auth');
		if (!auth) {
			return new Response('Unauthorized', { status: 401 });
		}
		const tokenPayload = await verifyToken(auth, {
			secretKey: this.env.CLERK_SECRET_KEY,
		});

		const { id, firstName, lastName, imageUrl } = await createClerkClient({
			secretKey: this.env.CLERK_SECRET_KEY,
		}).users.getUser(tokenPayload.sub);

		const userId = id;

		if (!userId) {
			return new Response('Not found', { status: 404 });
		}

		switch (url.pathname) {
			case '/websocket': {
				// The request is to `/api/room/<name>/websocket`. A client is trying to establish a new
				// WebSocket session.
				if (request.headers.get('Upgrade') != 'websocket') {
					return new Response('expected websocket', { status: 400 });
				}

				// Get the client's IP address for use with the rate limiter.
				let ip = request.headers.get('CF-Connecting-IP');

				if (!ip) {
					return new Response('Bad Request', { status: 403 });
				}

				// To accept the WebSocket request, we create a WebSocketPair (which is like a socketpair,
				// i.e. two WebSockets that talk to each other), we return one end of the pair in the
				// response, and we operate on the other end. Note that this API is not part of the
				// Fetch API standard; unfortunately, the Fetch API / Service Workers specs do not define
				// any way to act as a WebSocket server today.
				let pair = new WebSocketPair();

				// We're going to take pair[1] as our end, and return pair[0] to the client.
				await this.handleSession(pair[1], {
					id,
					firstName,
					lastName,
					imageUrl,
				});

				// Now we return the other end of the pair to the client.
				return new Response(null, { status: 101, webSocket: pair[0] });
			}

			default:
				return new Response('Not found', { status: 404 });
		}
	}

	// handleSession() implements our WebSocket-based chat protocol.
	async handleSession(webSocket: WebSocket, user: any) {
		// Accept our end of the WebSocket. This tells the runtime that we'll be terminating the
		// WebSocket in JavaScript, not sending it elsewhere.
		this.ctx.acceptWebSocket(webSocket);

		// Create our session and add it to the sessions map.
		let session: { blockedMessages: string[] } = { blockedMessages: [] };
		webSocket.serializeAttachment({
			...webSocket.deserializeAttachment(),
		});
		this.sessions.set(webSocket, session);

		// Load the last 100 messages from the chat history stored on disk, and send them to the
		// client.
		let storage = await this.storage.list({ reverse: true, limit: LIMIT_MESSAGES_LOAD });

		let backlog = [...storage.values()];
		backlog.reverse();
		backlog.forEach((value: any) => {
			session.blockedMessages.push(value);
		});

		this.addToSession(webSocket, user);
	}

	addToSession(webSocket: WebSocket, user: any) {
		let session = this.sessions.get(webSocket);

		if (!session.user?.id) {
			// The first message the client sends is the user info message with their name. Save it
			// into their session object.
			session.user = user;
			// attach name to the webSocket so it survives hibernation
			webSocket.serializeAttachment({
				...webSocket.deserializeAttachment(),
				user: session.user,
			});

			// Deliver all the messages we queued up since the user connected.
			session.blockedMessages.forEach((queued: any) => {
				webSocket.send(queued);
			});
			delete session.blockedMessages;

			webSocket.send(JSON.stringify({ ready: true }));
			return;
		}
	}

	async webSocketMessage(webSocket: WebSocket, msg: string) {
		try {
			let session = this.sessions.get(webSocket);
			if (session.quit) {
				// Whoops, when trying to send to this WebSocket in the past, it threw an exception and
				// we marked it broken. But somehow we got another message? I guess try sending a
				// close(), which might throw, in which case we'll try to send an error, which will also
				// throw, and whatever, at least we won't accept the message. (This probably can't
				// actually happen. This is defensive coding.)
				webSocket.close(1011, 'WebSocket broken.');
				return;
			}

			// I guess we'll use JSON.
			let data: IPayload = JSON.parse(msg);

			if (data.type === 'loadmore') {
				// Load the last 100 messages from the chat history stored on disk, and send them to the
				// client.
				let storage = await this.storage.list({
					reverse: true,
					limit: LIMIT_MESSAGES_LOAD,
					end: data.lastId,
				});
				let backlog = [...storage.values()].map((i: any) => {
					return { ...i, type: data.type };
				});
				backlog.forEach((value) => {
					webSocket.send(value);
				});
				return;
			}

			// Add timestamp. Here's where this.lastTimestamp comes in -- if we receive a bunch of
			// messages at the same time (or if the clock somehow goes backwards????), we'll assign
			// them sequential timestamps, so at least the ordering is maintained.
			const timestamp = Math.max(Date.now(), this.lastTimestamp + 1);
			this.lastTimestamp = timestamp;

			// Save message.
			let id = uuidv4();
			const sendPayload: ISendPayload = {
				id,
				message: data.message,
				type: 'message',
				timestamp: new Date(timestamp).toISOString(),
				user: session.user,
			};
			let dataStr = JSON.stringify(sendPayload);
			this.storage.put(id, dataStr);
			// Broadcast the message to all other WebSockets.
			this.broadcast(dataStr);
		} catch (err: any) {
			// Report any exceptions directly back to the client. As with our handleErrors() this
			// probably isn't what you'd want to do in production, but it's convenient when testing.
			webSocket.send(JSON.stringify({ error: err.stack }));
		}
	}

	// On "close" and "error" events, remove the WebSocket from the sessions list and broadcast
	// a quit message.
	async closeOrErrorHandler(webSocket: WebSocket) {
		let session = this.sessions.get(webSocket) || {};
		session.quit = true;
		this.sessions.delete(webSocket);
	}

	async webSocketClose(webSocket: WebSocket) {
		this.closeOrErrorHandler(webSocket);
	}

	async webSocketError(webSocket: WebSocket) {
		this.closeOrErrorHandler(webSocket);
	}

	// broadcast() broadcasts a message to all clients.
	broadcast(message: any) {
		// Apply JSON if we weren't given a string to start with.
		if (typeof message !== 'string') {
			message = JSON.stringify(message);
		}

		// Iterate over all the sessions sending them messages.
		let quitters: any = [];
		this.sessions.forEach((session, webSocket) => {
			if (session.user?.id) {
				try {
					webSocket.send(message);
				} catch (err) {
					// Whoops, this connection is dead. Remove it from the map and arrange to notify
					// everyone below.
					session.quit = true;
					quitters.push(session);
					this.sessions.delete(webSocket);
				}
			} else {
				// This session hasn't sent the initial user info message yet, so we're not sending them
				// messages yet (no secret lurking!). Queue the message to be sent later.
				session.blockedMessages.push(message);
			}
		});
	}
}

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx): Promise<Response> {
		// Create a `DurableObjectId` for an instance of the `MyDurableObject`
		// class named "foo". Requests from all Workers to the instance named
		// "foo" will go to a single globally unique Durable Object instance.

		let url = new URL(request.url);

		const postId = url.searchParams.get('post');
		if (!postId) {
			return new Response('Not found', { status: 404 });
		}
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName(postId);

		// Create a stub to open a communication channel with the Durable
		// Object instance.
		const stub = env.MY_DURABLE_OBJECT.get(id);

		// Call the `sayHello()` RPC method on the stub to invoke the method on
		// the remote Durable Object instance
		return stub.fetch(request);
	},
} satisfies ExportedHandler<Env>;
