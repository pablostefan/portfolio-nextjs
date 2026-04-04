'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Code2, Star, Calendar, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { AnimatedBlob } from '@/components/ui/AnimatedBlob';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { langColor, formatDate } from '@/lib/utils';
import type { Project } from '@/types';

// ─── Language Icon ────────────────────────────────────────────────────────────

interface LangIconProps {
  language: string | null;
  color: string;
}

function LangIcon({ language, color }: LangIconProps) {
  const abbr = language ? language.slice(0, 2).toUpperCase() : '<>';

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-colors duration-300"
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        color,
      }}
      aria-hidden="true"
    >
      {abbr}
    </div>
  );
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  index: number;
  tViewGithub: string;
  tViewDemo: string;
  tUpdated: string;
  className?: string;
}

function ProjectCard({ project, index, tViewGithub, tViewDemo, tUpdated, className }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const color = project.language ? langColor(project.language) : '#94a3b8';
  const visibleTopics = project.topics.filter((t) => t !== 'portfolio');

  return (
    <motion.li
      className={className}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard hover glow="violet" className="group/proj relative flex h-full flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <LangIcon language={project.language} color={color} />
              <h3 className="font-display text-lg font-bold leading-snug text-content">
                {project.name.replace(/[-_]/g, ' ')}
              </h3>
            </div>

            {project.stargazers_count > 0 && (
              <div className="flex items-center gap-1 rounded-full border border-yellow-500/15 bg-yellow-500/[0.07] px-2.5 py-1">
                <Star size={11} className="text-yellow-400" fill="currentColor" aria-hidden="true" />
                <span className="font-mono text-[11px] font-semibold text-yellow-400">
                  {project.stargazers_count}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col px-5 pb-5">
          {/* Description */}
          {project.description && (
            <p className="mb-4 text-sm leading-relaxed text-content-secondary line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Topics */}
          {visibleTopics.length > 0 && (
            <ul className="mb-4 flex flex-wrap gap-1.5" aria-label="Topics">
              {visibleTopics.slice(0, 4).map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-glass-border bg-glass-bg px-2.5 py-0.5 font-mono text-[11px] text-content-muted transition-colors duration-200 group-hover/proj:border-white/[0.06]"
                >
                  {topic}
                </li>
              ))}
            </ul>
          )}

          {/* ── Footer ── */}
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-glass-divider pt-4">
            {/* Language + updated */}
            <div className="flex items-center gap-3">
              {project.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}55` }}
                  />
                  <span className="font-mono text-xs text-content-muted">{project.language}</span>
                </span>
              )}

              <span className="flex items-center gap-1 text-content-muted/60">
                <Calendar size={10} aria-hidden="true" />
                <span className="font-mono text-[10px]">
                  {tUpdated} {formatDate(project.updated_at)}
                </span>
              </span>
            </div>

            {/* Links */}
            <div className="ml-auto flex items-center gap-2">
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${tViewDemo}: ${project.name}`}
                  className="rounded-lg border border-glass-border bg-glass-bg px-3 py-1.5 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent-cyan/30 hover:bg-accent-cyan/10 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {tViewDemo}
                </a>
              )}
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${tViewGithub}: ${project.name}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-glass-border bg-glass-bg px-3 py-1.5 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ArrowUpRight size={11} aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.li>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const t = useTranslations('projects');
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper id="projects" className="relative overflow-hidden">
      {/* Background blobs */}
      <AnimatedBlob variant="violet" size={480}
        className="left-1/4 -top-24 opacity-22" />
      <AnimatedBlob variant="cyan" size={420}
        className="-right-20 bottom-0 opacity-18" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading title={t('title')} />

        {projects.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Code2 size={48} className="text-content-muted" aria-hidden="true" />
            <p className="text-content-secondary">
              Nenhum projeto com tópico{' '}
              <code className="rounded bg-glass-bg-hover px-1.5 py-0.5 font-mono text-xs text-accent-light">
                portfolio
              </code>{' '}
              encontrado no GitHub.
            </p>
          </div>
        ) : (
          <ul className="flex flex-wrap justify-center gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                tViewGithub={t('view_github')}
                tViewDemo={t('view_demo')}
                tUpdated={t('updated')}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex-none"
              />
            ))}
          </ul>
        )}

        {/* View all */}
        <motion.div
          className="mt-12 text-center"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          <a
            href="https://github.com/pablostefan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-glass-bg px-6 py-3 font-semibold text-content-secondary transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-accent/10 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Code2 size={18} aria-hidden="true" />
            {t('view_all')}
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
