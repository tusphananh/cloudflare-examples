import { createClerkClient, verifyToken } from '@clerk/backend';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400',
};

function handleOptions(request: Request<unknown, IncomingRequestCfProperties<unknown>>) {
	// Make sure the necessary headers are present
	// for this to be a valid pre-flight request
	let headers = request.headers;
	if (
		headers.get('Origin') !== null &&
		headers.get('Access-Control-Request-Method') !== null &&
		headers.get('Access-Control-Request-Headers') !== null
	) {
		// Handle CORS pre-flight request.
		// If you want to check or reject the requested method + headers
		// you can do that here.
		let respHeaders: HeadersInit = {
			...corsHeaders,
			// Allow all future content Request headers to go back to browser
			// such as Authorization (Bearer) or X-Client-Name-Version
			'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') as string,
		};
		return new Response(null, {
			headers: respHeaders,
		});
	} else {
		// Handle standard OPTIONS request.
		// If you want to allow other HTTP Methods, you can do that here.
		return new Response(null, {
			headers: {
				Allow: 'GET, HEAD, POST, OPTIONS',
			},
		});
	}
}

export default {
	async fetch(request, env) {
		let response;
		if (request.method === 'OPTIONS') {
			response = handleOptions(request);
			return response;
		}

		const url = new URL(request.url);

		const services: Record<string, any> = {
			'/api/post': env.POSTS_SERVICE,
		};

		const service = services[url.pathname];

		if (service) {
			if (request.method === 'POST') {
				// Parse the request body
				const body = await request.json();
				const { value } = body as any;

				const authHeader = request.headers.get('Authorization');
				const auth = authHeader ? authHeader.split(' ')[1] : undefined;
				if (!auth) {
					return new Response('Unauthorized', { status: 401 });
				}
				const tokenPayload = await verifyToken(auth, {
					secretKey: env.CLERK_SECRET_KEY,
				});

				const { id, firstName, lastName, imageUrl } = await createClerkClient({
					secretKey: env.CLERK_SECRET_KEY,
				}).users.getUser(tokenPayload.sub);

				if (!value) {
					return new Response(JSON.stringify({ error: 'Value is required.' }), { status: 400 });
				}

				const data = await service.create({ ...value, user: { id, firstName, lastName, imageUrl } });

				return new Response(JSON.stringify(data), {
					status: 200,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					},
				});
			} else if (request.method === 'GET') {
				// Check if an ID is provided in the query parameters
				const id = url.searchParams.get('id');

				if (id) {
					const data = await service.detail(id);
					return new Response(JSON.stringify(data), {
						status: 200,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
						},
					});
				} else {
					const data = await service.list();

					return new Response(JSON.stringify(data), {
						status: 200,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
						},
					});
				}
			}
		}

		console.log('Service Not Found');

		return new Response('Service Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
