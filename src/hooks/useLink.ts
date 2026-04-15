import { useState, useEffect } from 'react';
import { getLinks } from '../services/strapi';
import type { LinkData, StrapiLink } from '../types/link';

function mapLinks(data: StrapiLink[]): LinkData[] {
  return data.map(l => ({
    name: l.name,
    url: l.url
  }));
}

export function useLinks(): LinkData[] | null {
  const [links, setLinks] = useState<LinkData[] | null>(null);

  useEffect(() => {
    setLinks(null);
    getLinks()
      .then((data) => {
        if (!data) return;
        setLinks(mapLinks(data));
      })
      .catch(console.error);
  }, []);

  return links;
}
