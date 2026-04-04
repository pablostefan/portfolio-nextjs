import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { fetchLinkedInProfile } from '@/lib/linkedin';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { SkillBadgeList } from '@/components/ui/SkillBadgeList';
import profileData from '@/data/profile.json';
import type { Locale } from '@/i18n';

interface AboutProps {
  locale: Locale;
}

export async function About({ locale }: AboutProps) {
  const t       = await getTranslations('about');
  const profile = await fetchLinkedInProfile().catch(() => null);

  const aboutText = profileData.about[locale];

  return (
    <SectionWrapper id="about">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <GradientText>{t('title')}</GradientText>
          </h2>
          <div aria-hidden="true" className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {/* Bio card */}
        <GlassCard className="mb-12 p-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="shrink-0">
              {profile?.photoUrl ? (
                <div className="relative h-32 w-32 overflow-hidden rounded-2xl ring-2 ring-accent/30 ring-offset-2 ring-offset-bg-surface sm:h-40 sm:w-40">
                  <Image
                    src={profile.photoUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 128px, 160px"
                    priority
                  />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-32 w-32 items-center justify-center rounded-2xl bg-accent/20 ring-2 ring-accent/30 ring-offset-2 ring-offset-bg-surface sm:h-40 sm:w-40"
                >
                  <span className="font-display text-4xl font-bold text-accent-light">PS</span>
                </div>
              )}
            </div>

            {/* Bio text */}
            <div className="flex-1 text-center md:text-left">
              {profile && (
                <p className="mb-1 font-mono text-sm text-content-muted">
                  {profile.headline ?? 'Flutter Developer @ XP Inc'}
                </p>
              )}
              <h3 className="mb-4 font-display text-2xl font-bold text-content">
                Pablo Stefan
              </h3>
              <p className="leading-relaxed text-content-secondary">{aboutText}</p>
            </div>
          </div>
        </GlassCard>

        {/* Skills */}
        <div>
          <h3 className="mb-6 text-center font-display text-xl font-semibold text-content">
            {t('skills_title')}
          </h3>
          <SkillBadgeList skills={profileData.skills} />
        </div>
      </div>
    </SectionWrapper>
  );
}
