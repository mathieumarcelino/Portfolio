import React from "react";
import './Project.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import type { ProjectData } from '../../types/project';

interface Projects {
  title: string;
  projects: ProjectData[];
}


const Project: React.FC<Projects> = ({ title, projects }) => {
  return (
    <section className='b-1'>
    <div className='cont-title'>
      <h2 className='text-1'>{title}</h2>
    </div>
    <div className='project-item-cont'>
      {projects.map((project, index) => (
        <a href={`https://${project.link}`} target="_blank" rel="noreferrer" className='project-item' key={index}>
          <div className='project-image-cont'>
            <img className='project-image' src={project.image} alt={`Demo ${project.name}`} />
            {!!project.github && (
              <div className="project-github-cont">
                {project.github.map((repo, index) => (
                  <a href={`${repo.url}`} target="_blank" rel="noreferrer" key={index} className="project-github" title={repo.name}>
                    <FontAwesomeIcon icon={faGithub} />
                    {!!repo.name && (
                      <span className="">{repo.name}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className='project-text-cont'>
            <div>
              <h3 className='text-2 spacer-1 ellipsis'>{project.name}</h3>
              <p className='text-3 spacer-2'>{project.date}</p>
              <p className='text-4 spacer-2'>{project.description}</p>
            </div>
            <div className="project-text-sub-cont">
              <div className="project-link-cont spacer-1">
                <a className='text-4 link project-link' href={`https://${project.link}`} target="_blank" rel="noopener noreferrer">{project.link}</a>
              </div>
              <div className='project-language-cont'>
                {project.languages.map((lang, langIndex) => (
                  <p key={langIndex} className='project-language-text' style={{ backgroundColor: lang.boxColor, color: lang.textColor }}>{lang.name}</p>
                ))}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
    </section>
  );
};

export default Project;
