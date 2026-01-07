import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import type { ArrayValues } from 'type-fest';

import { EpisodeItem } from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import { SeriesItem } from '@wsh-2025/client/src/features/recommended/components/SeriesItem';

interface Props {
  eager: boolean;
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const CarouselSection = ({ eager, module }: Props) => {
  return (
    <>
      <div className="w-full">
        <h2 className="mb-[16px] w-full text-[22px] font-bold">{module.title}</h2>
        <div
          key={module.id}
          className="relative mx-[-24px] grid snap-x snap-mandatory scroll-p-[24px] auto-cols-[minmax(320px,1fr)] grid-flow-col gap-x-[12px] overflow-x-auto overflow-y-hidden pr-[56px] pl-[24px]"
          data-scroll-restore={`carousel-${module.id}`}
        >
          {module.items.map((item, index) => (
            <div key={item.id} className="shrink-0 grow-0 snap-start">
              {item.series != null ? <SeriesItem eager={eager && index === 0} series={item.series} /> : null}
              {item.episode != null ? <EpisodeItem eager={eager && index === 0} episode={item.episode} /> : null}
            </div>
          ))}
        </div>
      </div>

      <ElementScrollRestoration direction="horizontal" elementQuery={`[data-scroll-restore="carousel-${module.id}"]`} />
    </>
  );
};
