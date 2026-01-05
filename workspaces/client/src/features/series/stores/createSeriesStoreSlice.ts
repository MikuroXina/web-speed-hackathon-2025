import { lens } from '@dhmk/zustand-lens';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';

import { seriesService } from '@wsh-2025/client/src/features/series/services/seriesService';

type SeriesId = string;

interface SeriesState {
  series: Record<SeriesId, StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

interface SeriesActions {
  fetchSeriesById: (params: {
    seriesId: SeriesId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

export const createSeriesStoreSlice = () => {
  return lens<SeriesState & SeriesActions>((set) => ({
    fetchSeriesById: async ({ seriesId }) => {
      const series = await seriesService.fetchSeriesById({ seriesId });
      set((state) => {
        return produce(state, (draft) => {
          draft.series[seriesId] = series;
        });
      });
      return series;
    },
    series: {},
  }));
};
