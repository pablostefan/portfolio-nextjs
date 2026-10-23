import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps): ReactNode {
  return children;
}

export { RootLayout as default };
