export interface Project {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export interface ExperienceEntry {
  title: { pt: string; en: string };
  company: string;
  period: { pt: string; en: string };
  description: { pt: string; en: string };
  bullets?: { pt: string[]; en: string[] };
  current: boolean;
}

export interface Profile {
  about: { pt: string; en: string };
  experience: ExperienceEntry[];
  skills: string[];
  medium: string;
}

export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  headline?: string;
  photoUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  /** Populated at runtime via Credly OBI v2 or fallback */
  badgeImageUrl?: string;
}
