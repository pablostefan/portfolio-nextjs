import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';
import type { Locale } from '@/i18n';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export const revalidate = 3600;

async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      <Hero />
      <About locale={locale as Locale} />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}

export { HomePage as default };
