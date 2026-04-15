import { useState, useEffect } from 'react';
import { getProjects } from '../services/strapi';
import type { StrapiProject, ProjectData } from '../types/project';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

function resolveUrl(url: string): string {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function mapProjects(data: StrapiProject[]): ProjectData[] {
  return data.map((p) => {
    const imageUrl = p.image?.url;

    return {
      name: p.name,
      description: p.description,
      date: p.date.substring(0, 4),
      link: p.url,
      image: imageUrl ? resolveUrl(imageUrl) : null,
      github: p.github ?? [],
      languages: p.languages.map((l) => ({
        name: l.name,
        boxColor: l.boxColor,
        textColor: l.textColor,
      })),
    };
  });
}

export function useProjects(language: string): ProjectData[] | null {
  const [projects, setProjects] = useState<ProjectData[] | null>(null);

  useEffect(() => {
    setProjects(null);
    getProjects(language)
      .then((data) => {
        if(!data) return;
        setProjects(mapProjects(data));
      })
      .catch(console.error);
  }, [language]);

  return projects;
}
