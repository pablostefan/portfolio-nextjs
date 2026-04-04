'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Code2, Star, GitFork } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { langColor } from '@/lib/utils';
import type { Project } from '@/types';

// ─── ProjectCard ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  index: number;
  tViewGithub: string;
  tViewDemo: string;
}

function ProjectCard({ project, index, tViewGithub, tViewDemo }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const color = project.language ? langColor(project.language) : '#94a3b8';

  return (
    <motion.li
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard hover glow="violet" className="relative flex h-full flex-col overflow-hidden p-6">

        {/* Language top accent */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${color}cc, transparent)` }}
        />

        {/* Header: name + stars */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-display font-bold leading-snug text-content">
            {project.name.replace(/[-_]/g, ' ')}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            {project.stargazers_count > 0 && (
              <span className="flex items-center gap-1 font-mono text-xs text-content-muted">
                <Star size={12} aria-hidden="true" />
                {project.stargazers_count}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mb-5 flex-1 text-sm leading-relaxed text-content-secondary line-clamp-3">
          {project.description ?? '—'}
        </p>

        {/* Topics */}
        {project.topics.filter((t) => t !== 'portfolio').length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-1.5" aria-label="Topics">
            {project.topics
              .filter((topic) => topic !== 'portfolio')
              .slice(0, 4)
              .map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-content-muted"
                >
                  {topic}
                </li>
              ))}
          </ul>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
          {/* Language pill */}
          {project.language && (
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full ring-2 ring-white/10"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-xs text-content-muted">{project.language}</span>
            </span>
          )}

          {/* Links */}
          <div className="ml-auto flex items-center gap-2">
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${tViewDemo}: ${project.name}`}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent-cyan/30 hover:bg-accent-cyan/10 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {tViewDemo}
              </a>
            )}
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tViewGithub}: ${project.name}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ExternalLink size={11} aria-hidden="true" />
              GitHub
            </a>
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
    <SectionWrapper id="projects">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          className="mb-16 text-center"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <GradientText>{t('title')}</GradientText>
          </h2>
          <div aria-hidden="true" className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </motion.div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Code2 size={48} className="text-content-muted" aria-hidden="true" />
            <p className="text-content-secondary">
              Nenhum projeto com tópico{' '}
              <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-xs text-accent-light">
                portfolio
              </code>{' '}
              encontrado no GitHub.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                tViewGithub={t('view_github')}
                tViewDemo={t('view_demo')}
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
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3 font-semibold text-content-secondary transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-accent/10 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Code2 size={18} aria-hidden="true" />
            {t('view_all')}
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}


export const revalidate = 3600;

export async function Projects() {
  const t        = await getTranslations('projects');
  const projects = await fetchPortfolioProjects().catch(() => []);

  return (
    <SectionWrapper id="projects">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <GradientText>{t('title')}</GradientText>
          </h2>
          <div aria-hidden="true" className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Code2 size={48} className="text-content-muted" aria-hidden="true" />
            <p className="text-content-secondary">
              Nenhum projeto com tópico{' '}
              <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-xs text-accent-light">
                portfolio
              </code>{' '}
              encontrado no GitHub.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.id}>
                <GlassCard
                  hover
                  glow="violet"
                  className="flex h-full flex-col p-6"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-content leading-snug">
                      {project.name.replace(/-/g, ' ').replace(/_/g, ' ')}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-content-muted">
                      <Star size={13} aria-hidden="true" />
                      <span>{project.stargazers_count}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-content-secondary line-clamp-3">
                    {project.description ?? 'No description.'}
                  </p>

                  {/* Topics */}
                  {project.topics.filter((t) => t !== 'portfolio').length > 0 && (
                    <ul className="mb-4 flex flex-wrap gap-1.5" aria-label="Topics">
                      {project.topics
                        .filter((topic) => topic !== 'portfolio')
                        .slice(0, 4)
                        .map((topic) => (
                          <li
                            key={topic}
                            className="rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-content-muted"
                          >
                            {topic}
                          </li>
                        ))}
                    </ul>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
                    {/* Language */}
                    <div className="flex items-center gap-1.5">
                      {project.language && (
                        <>
                          <span
                            aria-hidden="true"
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: langColor(project.language) }}
                          />
                          <span className="font-mono text-xs text-content-muted">
                            {project.language}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {project.homepage && (
                        <a
                          href={project.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t('view_demo')}: ${project.name}`}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent-cyan/30 hover:bg-accent-cyan/10 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          {t('view_demo')}
                        </a>
                      )}
                      <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t('view_github')}: ${project.name}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <ExternalLink size={12} aria-hidden="true" />
                        GitHub
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        )}

        {/* View all link */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/pablostefan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3 font-semibold text-content-secondary transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-accent/10 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Code2 size={18} aria-hidden="true" />
            {t('view_all')}
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
