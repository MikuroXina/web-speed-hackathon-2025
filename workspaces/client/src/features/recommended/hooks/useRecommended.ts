import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  return useStore((s) => {
    const moduleIds = s.features.recommended.references[referenceId];

    const modules = (moduleIds ?? [])
      .map((moduleId) => s.features.recommended.recommendedModules[moduleId])
      .filter(<T>(m: T): m is NonNullable<T> => m != null);

    return modules;
  });
}
