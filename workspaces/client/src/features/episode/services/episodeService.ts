import { createFetch, createSchema } from '@better-fetch/fetch';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/episodes': {
      output: schema.getEpisodesResponse,
      query: schema.getEpisodesRequestQuery,
    },
    '/episodes/:episodeId': {
      output: schema.getEpisodeByIdResponse,
    },
  }),
  throw: true,
});

const batcher = batshit.create({
  async fetcher(queries: { episodeId: string }[]) {
    const data = await $fetch('/episodes', {
      query: {
        episodeIds: queries.map((q) => q.episodeId).join(','),
      },
    });
    return data;
  },
  resolver(items, query: { episodeId: string }) {
    const item = items.find((item) => item.id === query.episodeId);
    return item ?? null;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({ maxBatchSize: 250, windowMs: 10 }),
});

interface EpisodeService {
  fetchEpisodeById: (query: {
    episodeId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse> | null>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>>;
}

export const episodeService: EpisodeService = {
  async fetchEpisodeById({ episodeId }) {
    const episode = await batcher.fetch({ episodeId });
    return episode;
  },
  async fetchEpisodes() {
    const data = await $fetch('/episodes', { query: {} });
    return data;
  },
};
