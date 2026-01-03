import { ElementScrollRestoration } from '@epic-web/restore-scroll';

import { EpisodeItem } from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import { SeriesItem } from '@wsh-2025/client/src/features/recommended/components/SeriesItem';

interface Props {
  module: {
    id: string;
    items: {
      episode?: {
        id: string;
        premium: boolean;
        series: {
          title: string;
        };
        thumbnailUrl: string;
        title: string;
      };
      id: string;
      series?: {
        id: string;
        thumbnailUrl: string;
        title: string;
      };
    }[];
    title: string;
  };
}

export const CarouselSection = ({ module }: Props) => {
  return (
    <>
      <div className="w-full">
        <h2 className="mb-[16px] w-full text-[22px] font-bold">{module.title}</h2>
        <div
          key={module.id}
          className={
            'relative mx-[-24px] grid grid-cols-[repeat(auto-fill,_minmax(276px,_1fr))] gap-x-[12px] overflow-x-auto overflow-y-hidden pr-[56px] pl-[24px]'
          }
          data-scroll-restore={`carousel-${module.id}`}
        >
          {module.items.map((item) => (
            <div key={item.id} className="shrink-0 grow-0">
              {item.series != null ? <SeriesItem series={item.series} /> : null}
              {item.episode != null ? <EpisodeItem episode={item.episode} /> : null}
            </div>
          ))}
        </div>
      </div>

      <ElementScrollRestoration direction="horizontal" elementQuery={`[data-scroll-restore="carousel-${module.id}"]`} />
    </>
  );
};
