import React from "react";
import './Project.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

interface Project {
  name: string;
  image: string;
  description: string;
  date: string;
  language: string[];
  link: string;
  github: Array<{ name: string; url: string }> | null;
}

interface Projects {
  title: string;
  projects: Project[];
}

const languageColors: { [key: string]: { box: string, text: string } } = {
  "JavaScript": {
    "box": "#f4de00",
    "text": "#000000"
  },
  "TypeScript": {
    "box": "#2d79c7",
    "text": "#ffffff"
  },
  "PHP": {
    "box": "#777BB4",
    "text": "#ffffff"
  },
  "React": {
    "box": "#61DAFB",
    "text": "#000000"
  },
  "Golang": {
    "box": "#00ADD8",
    "text": "#ffffff"
  },
  "Python": {
    "box": "#3776AB",
    "text": "#ffffff"
  },
  "HTML": {
    "box": "#E34F26",
    "text": "#ffffff"
  },
  "CSS": {
    "box": "#1572B6",
    "text": "#ffffff"
  },
  "SCSS": {
    "box": "#CC6699",
    "text": "#ffffff"
  },
  "VueJS": {
    "box": "#4FC08D",
    "text": "#000000"
  },
  "SQL": {
    "box": "#00758F",
    "text": "#ffffff"
  },
  "Symfony": {
    "box": "#1f2937",
    "text": "#ffffff"
  },
  "jQuery": {
    "box": "#1169ae",
    "text": "#ffffff"
  }
};

const getLanguageColors = (lang: string) => {
  return languageColors[lang] || { box: '#ffffff', text: '#000000' }; // Retourne des couleurs par défaut si la langue n'est pas trouvée
};


const Projects: React.FC<Projects> = ({ title, projects }) => {
  return (
    <section className='b-1'>
    <div className='cont-title'>
      <h2 className='text-1'>{title}</h2>
    </div>
    <div className='project-item-cont'>
      {projects.map((project, index) => (
        <div className='project-item' key={index}>
          <div className='project-image-cont'>
            <img className='project-image' src={`/images/${project.image}`} alt={`Demo ${project.name}`} />
            {!!project.github && (
              <div className="project-github-cont">
                {project.github.map((repo, index) => (
                  <a href={`${repo.url}`} target="_blank" key={index} className="project-github" title={repo.name}>
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
                <a className='text-4 link project-link' href={`https://${project.link}`} target="_blank">{project.link}</a>
              </div>
              <div className='project-language-cont'>
                {project.language.map((lang, langIndex) => {
                  const colors = getLanguageColors(lang);
                  return (
                    <p key={langIndex} className='project-language-text' style={{ backgroundColor: colors.box, color: colors.text }}>{lang}</p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    </section>
  );
};

export default Projects;
