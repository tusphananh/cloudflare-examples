import { v4 as uuidv4 } from 'uuid';

interface IInput {
	value: {
		title: string;
		content: string;
		startDate: Date;
	};
}
import { WorkerEntrypoint } from 'cloudflare:workers';

export default class PostWorker extends WorkerEntrypoint<Env> {
	// Currently, entrypoints without a named handler are not supported
	async fetch() {
		return new Response(null, { status: 404 });
	}

	async list() {
		const allKeys = await this.env.POSTS_KV.list();

		const allItems = await Promise.all(
			allKeys.keys.map(async (key) => {
				const value = (await this.env.POSTS_KV.get(key.name)) || '';
				return { ...JSON.parse(value) };
			})
		);

		return allItems;
	}

	async detail(id: string) {
		const value = await this.env.POSTS_KV.get(id);

		if (!value) {
			throw new Error(`Post with id ${id} not found`);
		}

		return { ...JSON.parse(value) };
	}

	async create(input: IInput) {
		const id = uuidv4();
		const value = JSON.stringify({ ...input, id });

		await this.env.POSTS_KV.put(id, value);

		return { id, ...input };
	}
}
