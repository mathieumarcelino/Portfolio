import React from 'react';
import '../Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

interface ProjectImageProps {
  url: string | null;
  name: string;
}

const ProjectImage: React.FC<ProjectImageProps> = ({ url, name }) => {
  return (
    <>
      {url ? (
        <>
          <img className='project-image' src={url} alt={`Demo ${name}`} />
        </>
      )
      : (
        <>
          <div className='project-image-default'>
            <FontAwesomeIcon icon={faLink} />
          </div>
        </>
      )}
    </>
  );
};

export default ProjectImage;
