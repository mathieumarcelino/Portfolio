import { useState, useEffect } from 'react';
import { getProfile } from '../services/strapi';
import type { ProfileData } from '../types/profile';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

function resolveUrl(url: string): string {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function mapProfile(data: any): ProfileData {
  const avatarUrl = data.image?.url;
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    job: data.job,
    email: data.email,
    image: avatarUrl ? resolveUrl(avatarUrl) : '',
    description: data.description ?? '',
  };
}

export function useProfile(language: 'fr' | 'en'): ProfileData | null {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    setProfile(null);
    getProfile(language)
      .then((data) => {
        if (!data) return;
        setProfile(mapProfile(data));
      })
      .catch(console.error);
  }, [language]);

  return profile;
}
