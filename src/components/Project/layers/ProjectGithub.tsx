import React from 'react';
import '../Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { ProjetGithub } from 'types/project';

interface ProjectGithubProps {
  github: ProjetGithub[] | null;
}

const ProjectGithub: React.FC<ProjectGithubProps> = ({ github }) => {
  if (!github) return null;
  
  return (
    <div className="project-github-cont">
      {github.map((repo, index) => (
        <a 
          href={`${repo.url}`} 
          target="_blank" 
          rel="noreferrer" 
          key={index} 
          className="project-github" 
          title={`GitHub${repo.name ? ` - ${repo.name}` : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <FontAwesomeIcon icon={faGithub} />
          {!!repo.name && (
            <span>{repo.name}</span>
          )}
        </a>
      ))}
    </div>
  );
};

export default ProjectGithub;
