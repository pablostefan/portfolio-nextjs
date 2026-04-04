import type { ReactNode, ElementType } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
  as?: ElementType;
}

export function GradientText({
  children,
  className = '',
  animated = false,
  as: Tag = 'span',
}: GradientTextProps) {
  return (
    <Tag
      className={[
        animated ? 'gradient-text-animated' : 'gradient-text',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
}
