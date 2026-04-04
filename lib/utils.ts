/** Format ISO date string to "MMM YYYY" (e.g. "Jan 2024") */
export function formatDate(iso: string, locale: string = 'pt-BR'): string {
  const date = new Date(iso);
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'short' });
}

/** Map programming language names to hex colours */
const LANG_COLORS: Record<string, string> = {
  Dart:       '#00B4AB',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Kotlin:     '#A97BFF',
  Swift:      '#F05138',
  Python:     '#3572A5',
  Go:         '#00ADD8',
  Rust:       '#DEA584',
};

export function langColor(language: string | null): string {
  if (!language) return '#94A3B8';
  return LANG_COLORS[language] ?? '#94A3B8';
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
