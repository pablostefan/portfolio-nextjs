import { Cover } from "@/components/specimen/Cover";
import { Waterfall } from "@/components/specimen/Waterfall";
import { Cases } from "@/components/specimen/Cases";
import { Career } from "@/components/specimen/Career";
import { Voices } from "@/components/specimen/Voices";
import { IndexSection } from "@/components/specimen/IndexSection";
import { Colophon } from "@/components/specimen/Colophon";
import { fetchEnrichedCertifications } from "@/lib/credly";
import { fetchPortfolioProjects } from "@/lib/github";

export const dynamic = "force-dynamic";

async function HomePage() {
  const [certs, projects] = await Promise.all([
    fetchEnrichedCertifications().catch(() => []),
    fetchPortfolioProjects().catch(() => []),
  ]);

  return (
    <>
      <Cover />
      <Waterfall />
      <Cases />
      <Career />
      <Voices />
      <IndexSection projects={projects} certs={certs} />
      <Colophon />
    </>
  );
}

export { HomePage as default };
