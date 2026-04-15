import React from 'react';
import '../Project.css';
import { ProjectLanguage } from 'types/project';

interface ProjectLanguagesProps {
  languages: ProjectLanguage[] | null;
}

const ProjectLanguages: React.FC<ProjectLanguagesProps> = ({ languages }) => {
  if (!languages) return null;
  
  return (
    <div className='project-language-cont'>
      {languages.map((language, index) => (
        <p key={index} className='project-language-text' style={{ backgroundColor: language.boxColor, color: language.textColor }}>{language.name}</p>
      ))}
    </div>
  );
};

export default ProjectLanguages;
