import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { MapPin, Briefcase } from 'lucide-react';
import { fetchLinkedInProfile } from '@/lib/linkedin';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { CountUp } from '@/components/ui/CountUp';
import { AnimatedBlob } from '@/components/ui/AnimatedBlob';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientText } from '@/components/ui/GradientText';
import { SkillBadgeList } from '@/components/ui/SkillBadgeList';
import { ExpandableText } from '@/components/ui/ExpandableText';
import profileData from '@/data/profile.json';
import type { Locale } from '@/i18n';

interface AboutProps {
  locale: Locale;
}

export async function About({ locale }: AboutProps) {
  const t       = await getTranslations('about');
  const profile = await fetchLinkedInProfile().catch(() => null);

  const aboutText = profileData.about[locale];

  const stats = [
    { value: '4+', label: t('years_label') },
    { value: '4',  label: t('companies_label') },
    { value: '4+', label: t('apps_label') },
  ];

  const specialties = locale === 'pt'
    ? ['Flutter', 'Design Systems', 'Arquitetura Mobile']
    : ['Flutter', 'Design Systems', 'Mobile Architecture'];

  const highlights = [
    t('highlight_1'),
    t('highlight_2'),
    t('highlight_3'),
  ];

  return (
    <SectionWrapper id="about" className="relative overflow-hidden">
      {/* Background blobs */}
      <AnimatedBlob variant="violet" size={500}
        className="-left-32 -top-32 opacity-25" />
      <AnimatedBlob variant="cyan" size={420}
        className="-right-20 bottom-0 opacity-20" />

      <div className="relative z-10 mx-auto max-w-6xl">

        <SectionHeading title={t('title')} />

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* Profile card — left column, spans 2 rows */}
          <GlassCard
            glow="violet"
            className="flex flex-col items-center gap-6 p-8 text-center lg:row-span-2"
          >
            {/* Avatar with ambient glow */}
            <div className="relative flex h-52 w-52 items-center justify-center">
              <div
                aria-hidden="true"
                className="about-avatar-glow absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/25 to-cyan-500/15 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="about-avatar-ring-violet absolute h-40 w-40 rounded-full border border-accent/15"
              />
              <div
                aria-hidden="true"
                className="about-avatar-ring-cyan absolute h-48 w-48 rounded-full border border-cyan-500/10"
              />

              {profile?.photoUrl ? (
                <div className="about-avatar-core relative z-10 h-32 w-32 overflow-hidden rounded-full border-2 border-accent/40">
                  <Image
                    src={profile.photoUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                  />
                </div>
              ) : (
                <div className="about-avatar-core relative z-10 flex h-32 w-32 items-center justify-center rounded-full border-2 border-accent/40 bg-gradient-to-br from-violet-700 to-cyan-600">
                  <span className="font-display text-3xl font-bold text-white">PS</span>
                </div>
              )}
            </div>

            {/* Name + headline */}
            <div>
              <h3 className="font-display text-2xl font-bold text-content">Pablo Stefan</h3>
              <p className="mt-1.5 font-mono text-sm text-content-muted">
                {profile?.headline ?? 'Software Architect · Flutter'}
              </p>
            </div>

            {/* Role badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs text-accent-light">
              <Briefcase className="h-3 w-3" aria-hidden="true" />
              Software Architect · XP Inc.
            </span>

            <div aria-hidden="true" className="h-px w-full bg-glass-divider" />

            {/* Location */}
            <span className="flex items-center gap-2 text-sm text-content-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {t('location')}
            </span>

            {/* Specialty tags */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-glass-border bg-glass-bg px-2.5 py-0.5 text-xs text-content-secondary"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Availability dot */}
            <span className="flex items-center gap-2 text-xs text-content-muted">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"
              />
              {t('availability')}
            </span>
          </GlassCard>

          {/* Bio card */}
          <GlassCard className="p-8 lg:col-span-2">
            <div className="relative pl-5">
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-gradient-to-b from-violet-500 via-cyan-500 to-transparent"
              />

              <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex w-full items-center gap-1.5 rounded-full border border-glass-border bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-content-secondary sm:text-xs lg:min-h-10"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
                    />
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="pb-6">
                <ExpandableText
                  text={aboutText}
                  expandLabel={t('expand_text')}
                  collapseLabel={t('collapse_text')}
                />
              </div>
            </div>
          </GlassCard>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 lg:col-span-2">
            {stats.map((stat) => (
              <GlassCard
                key={stat.label}
                glow="cyan"
                className="flex flex-col items-center justify-center p-5 text-center"
              >
                <p className="font-display text-3xl font-bold leading-none text-accent-light">
                  <CountUp value={stat.value} />
                </p>
                <p className="mt-2 text-xs leading-tight text-content-muted">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-gradient-to-r from-transparent via-violet-500/70 to-cyan-500/70"
            />
            <h3 className="text-center font-display text-2xl font-bold tracking-tight">
              <GradientText animated>{t('skills_title')}</GradientText>
            </h3>
            <span
              aria-hidden="true"
              className="h-px w-10 bg-gradient-to-l from-transparent via-violet-500/70 to-cyan-500/70"
            />
          </div>
          <SkillBadgeList skills={profileData.skills} />
        </div>
      </div>
    </SectionWrapper>
  );
}
