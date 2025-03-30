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
		try {
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
				// Append searchParams to the target URL
				return service.fetch(request);
			}

			console.log('Service Not Found');

			return new Response('Service Not Found', { status: 404 });
		} catch (error) {
			console.log(error);
			return new Response('Internal Server Error', { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
