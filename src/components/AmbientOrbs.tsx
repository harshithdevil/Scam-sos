import { memo } from 'react';

interface AmbientOrbsProps {
  ultraDark?: boolean;
}

export const AmbientOrbs = memo(function AmbientOrbs({ ultraDark = false }: AmbientOrbsProps) {
  return (
    <div
      aria-hidden="true"
      className="obsidian-static-backdrop pointer-events-none fixed inset-0 z-0 print:hidden"
      data-ultra-dark={ultraDark ? 'true' : 'false'}
    />
  );
});
