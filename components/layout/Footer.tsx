import { getTranslations } from 'next-intl/server';
import { AnimatedDivider } from '@/components/ui/AnimatedDivider';
import { FooterClient } from './FooterClient';

export async function Footer() {
  const t = await getTranslations('footer');

  return (
    <>
      <AnimatedDivider />
      <footer className="relative py-14 px-4">
        <FooterClient madeWith={t('made_with')} using={t('using')} />
      </footer>
    </>
  );
}
