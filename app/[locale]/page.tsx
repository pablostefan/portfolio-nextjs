import { Cover } from "@/components/azulejo/Cover";
import { System } from "@/components/azulejo/System";
import { Cases } from "@/components/azulejo/Cases";
import { Career } from "@/components/azulejo/Career";
import { Voices } from "@/components/azulejo/Voices";
import { IndexSection } from "@/components/azulejo/IndexSection";
import { Colophon } from "@/components/azulejo/Colophon";
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
      <System />
      <Cases />
      <Career />
      <Voices />
      <IndexSection projects={projects} certs={certs} />
      <Colophon />
    </>
  );
}

export { HomePage as default };
