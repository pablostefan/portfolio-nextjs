import type { LinkedInProfile } from '@/types';

const LINKEDIN_API = 'https://api.linkedin.com/v2';

interface LinkedInMeResponse {
  localizedFirstName: string;
  localizedLastName: string;
  localizedHeadline?: string;
}

interface LinkedInProfilePictureResponse {
  profilePicture?: {
    'displayImage~'?: {
      elements?: Array<{
        identifiers?: Array<{ identifier: string }>;
      }>;
    };
  };
}

function buildHeaders(): HeadersInit {
  return {
    Authorization:  `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
    'X-Restli-Protocol-Version': '2.0.0',
  };
}

export async function fetchLinkedInProfile(): Promise<LinkedInProfile | null> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) return null;

  const [meRes, photoRes] = await Promise.allSettled([
    fetch(`${LINKEDIN_API}/me`, {
      headers: buildHeaders(),
      next: { revalidate: 3600 },
    }),
    fetch(
      `${LINKEDIN_API}/me?projection=(id,profilePicture(displayImage~:playableStreams))`,
      {
        headers: buildHeaders(),
        next: { revalidate: 3600 },
      },
    ),
  ]);

  if (meRes.status === 'rejected' || !meRes.value.ok) return null;

  const me: LinkedInMeResponse = await meRes.value.json();

  let photoUrl: string | undefined;
  if (photoRes.status === 'fulfilled' && photoRes.value.ok) {
    const photoData: LinkedInProfilePictureResponse = await photoRes.value.json();
    const elements = photoData.profilePicture?.['displayImage~']?.elements ?? [];
    const last = elements[elements.length - 1];
    photoUrl = last?.identifiers?.[0]?.identifier;
  }

  return {
    firstName: me.localizedFirstName,
    lastName:  me.localizedLastName,
    headline:  me.localizedHeadline,
    photoUrl,
  };
}
