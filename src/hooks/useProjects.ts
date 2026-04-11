import { useState, useEffect } from 'react';
import { getProjects } from '../services/strapi';
import type { StrapiProject, ProjectData } from '../types/project';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

function resolveUrl(url: string): string {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

function mapProject(p: StrapiProject): ProjectData {
  const imageUrl = p.image?.formats?.large?.url ?? p.image?.url ?? '';

  return {
    name: p.name,
    description: p.description,
    date: p.date.substring(0, 4),
    link: p.url,
    image: imageUrl ? resolveUrl(imageUrl) : '',
    github: p.github ?? [],
    languages: p.languages.map((l) => ({
      name: l.name,
      boxColor: l.boxColor,
      textColor: l.textColor,
    })),
  };
}

export function useProjects(language: 'fr' | 'en'): ProjectData[] | null {
  const [projects, setProjects] = useState<ProjectData[] | null>(null);

  useEffect(() => {
    setProjects(null);
    getProjects(language)
      .then((data) => setProjects(data.map(mapProject)))
      .catch(console.error);
  }, [language]);

  return projects;
}
