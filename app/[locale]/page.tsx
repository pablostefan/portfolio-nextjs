import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { ProjectsClient } from '@/components/sections/Projects';
import { CertificationsClient } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { fetchEnrichedCertifications } from '@/lib/credly';
import { fetchPortfolioProjects } from '@/lib/github';
import type { Locale } from '@/i18n';

function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[1px] w-full max-w-5xl">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

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
      <SectionDivider />
      <About locale={locale as Locale} />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <ProjectsClient projects={projects} />
      <SectionDivider />
      <CertificationsClient certs={certs} />
      <SectionDivider />
      <Contact />
    </>
  );
}

export { HomePage as default };
