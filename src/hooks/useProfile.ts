import { useState, useEffect } from 'react';
import { getProfile } from '../services/strapi';
import type { ProfileData } from '../types/profile';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

export function useProfile(language: 'fr' | 'en'): ProfileData | null {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    setProfile(null);
    getProfile(language)
      .then((data) => {
        if (!data) return;
        const avatarUrl = data.image?.url;
        setProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          job: data.job,
          email: data.email,
          image: avatarUrl
            ? (avatarUrl.startsWith('http') ? avatarUrl : `${STRAPI_URL}${avatarUrl}`)
            : '',
          description: data.description ?? '',
        });
      })
      .catch(console.error);
  }, [language]);

  return profile;
}
