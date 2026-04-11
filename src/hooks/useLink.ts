import { useState, useEffect } from 'react';
import { getLinks } from '../services/strapi';
import type { LinkData } from '../types/link';

export function useLinks(): LinkData[] | null {
  const [links, setLinks] = useState<LinkData[] | null>(null);

  useEffect(() => {
    setLinks(null);
    getLinks()
      .then((data) => {
        if (!data) return;
        setLinks(
          data.map(l => ({
            name: l.name,
            url: l.url
          }))
        );
      })
      .catch(console.error);
  }, []);

  return links;
}
