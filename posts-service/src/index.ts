import { v4 as uuidv4 } from 'uuid';

interface IInput {
	value: {
		title: string;
		content: string;
		startDate: Date;
	};
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		console.log('====================================');
		console.log(JSON.stringify(request));
		console.log('====================================');

		if (request.method === 'POST') {
			// Parse the request body
			const body: IInput = await request.json();
			const { value } = body;

			if (!value) {
				return new Response(JSON.stringify({ error: 'Value is required.' }), { status: 400 });
			}

			// Generate a unique ID for the key
			const id = uuidv4();

			// Write the key-value pair to the KV store
			await env.POSTS_KV.put(id, JSON.stringify(value));

			return new Response(JSON.stringify({ id }), {
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
				// Fetch the value for the given ID
				const value = await env.POSTS_KV.get(id);

				if (!value) {
					return new Response(JSON.stringify({ error: `No value found for ID "${id}".` }), { status: 404 });
				}

				return new Response(value, {
					status: 200,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					},
				});
			} else {
				// List all key-value pairs
				const allKeys = await env.POSTS_KV.list();

				const allItems = await Promise.all(
					allKeys.keys.map(async (key) => {
						const value = await env.POSTS_KV.get(key.name);
						return { id: key.name, value: value ? JSON.parse(value) : null };
					})
				);

				return new Response(JSON.stringify(allItems), {
					status: 200,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					},
				});
			}
		} else {
			return new Response('Method not allowed', { status: 405 });
		}
	},
} satisfies ExportedHandler<Env>;
