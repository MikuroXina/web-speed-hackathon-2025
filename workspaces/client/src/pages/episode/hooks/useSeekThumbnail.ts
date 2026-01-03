import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function getSeekThumbnail({ episode }: Params) {
  const thumbnailsUrl = `/streams/${episode.streamId}/preview.jpg`;
  const res = await fetch(thumbnailsUrl);
  const output = await res.blob();
  return URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));
}

const weakMap = new WeakMap<object, Promise<string>>();

export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};
