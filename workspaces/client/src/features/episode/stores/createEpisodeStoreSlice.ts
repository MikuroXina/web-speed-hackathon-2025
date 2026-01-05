import { lens } from '@dhmk/zustand-lens';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

type EpisodeId = string;

interface EpisodeState {
  episodes: Record<EpisodeId, StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
}

interface EpisodeActions {
  fetchEpisodeById: (params: {
    episodeId: EpisodeId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse> | null>;
}

export const createEpisodeStoreSlice = () => {
  return lens<EpisodeState & EpisodeActions>((set) => ({
    episodes: {},
    fetchEpisodeById: async ({ episodeId }) => {
      const episode = await episodeService.fetchEpisodeById({ episodeId });
      if (episode != null) {
        set((state) => {
          return produce(state, (draft) => {
            draft.episodes[episode.id] = episode;
          });
        });
      }
      return episode;
    },
  }));
};
