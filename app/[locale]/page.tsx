import { getTranslations } from 'next-intl/server';

async function HomePage() {
  const t = await getTranslations('hero');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-display text-4xl font-bold">
        {t('greeting')} Pablo Stefan
      </h1>
    </main>
  );
}

export { HomePage as default };
