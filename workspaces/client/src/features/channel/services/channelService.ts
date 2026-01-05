import { createFetch, createSchema } from '@better-fetch/fetch';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  schema: createSchema({
    '/channels': {
      output: schema.getChannelsResponse,
      query: schema.getChannelsRequestQuery,
    },
  }),
  throw: true,
});

interface ChannelService {
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse>>;
}

export const channelService: ChannelService = {
  async fetchChannels() {
    const data = await $fetch('/channels', { query: {} });
    return data;
  },
};
