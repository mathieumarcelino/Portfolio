import React from "react";
import './Project.css';
import type { ProjectData } from '../../types/project';
import ProjectImage from "./layers/ProjectImage";
import ProjectGithub from "./layers/ProjectGithub";
import ProjectLanguages from "./layers/ProjectLanguages";
import { useLanguage } from "contexts/LanguageContext";

interface Projects {
  projects: ProjectData[];
}

const Project: React.FC<Projects> = ({ projects }) => {
  const { t } = useLanguage();
      
  const handleProjectClick = (link: string) => {
    window.open(`https://${link}`, '_blank');
  };

  return (
    <section className='b-1'>
      <div className='cont-title'>
        <h2 className='text-1'>{t('Projects')}</h2>
      </div>
      <div className='project-item-cont'>
        {projects.map((project, index) => (
          <div className='project-item' key={index} onClick={() => handleProjectClick(project.link)} >
            <div className='project-image-cont'>
              <ProjectImage url={project.image} name={project.name} />
              <ProjectGithub github={project.github} />
            </div>
            <div className='project-text-cont'>
              <div>
                <h3 className='text-2 spacer-1 ellipsis'>{project.name}</h3>
                <p className='text-3 spacer-2'>{project.date}</p>
                <p className='text-4 spacer-2'>{project.description}</p>
              </div>
              <div className="project-text-sub-cont">
                <div className="project-link-cont spacer-1">
                  <a className='text-4 link project-link' href={`https://${project.link}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title={project.name} >
                    {project.link}
                  </a>
                </div>
                <ProjectLanguages languages={project.languages} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Project;
