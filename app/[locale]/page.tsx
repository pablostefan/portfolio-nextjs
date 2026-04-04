import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { ProjectsClient } from '@/components/sections/Projects';
import { CertificationsClient } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { fetchEnrichedCertifications } from '@/lib/credly';
import { fetchPortfolioProjects } from '@/lib/github';
import type { Locale } from '@/i18n';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [certs, projects] = await Promise.all([
    fetchEnrichedCertifications().catch(() => []),
    fetchPortfolioProjects().catch(() => []),
  ]);

  return (
    <>
      <Hero />
      <About locale={locale as Locale} />
      <Experience />
      <ProjectsClient projects={projects} />
      <CertificationsClient certs={certs} />
      <Contact />
    </>
  );
}

export { HomePage as default };
