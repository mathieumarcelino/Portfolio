import React from 'react';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faFile, faSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquareGithub, faSquareInstagram, faSquareLinkedin, faSquareTwitter } from '@fortawesome/free-brands-svg-icons';

interface ProfileData {
  firstName: string;
  lastName: string;
  job: string;
  image: string;
  email: string;
  link: Link[];
  description1: string;
  description2: string;
}

interface Link {
  name: string;
  url: string;
}

interface ProfileProps {
  profile: ProfileData;
  cv: string;
  contact: string;
}

function getIconByName(name: string) {
  switch (name.toLowerCase()) {
    case 'github':
      return faSquareGithub; // Replace with actual icon
    case 'linkedin':
      return faSquareLinkedin; // Replace with actual icon
    case 'twitter':
      return faSquareTwitter; // Replace with actual icon
    case 'instagram':
      return faSquareInstagram; // Replace with actual icon
    default:
      return faSquare; // Default icon
  }
}

const Profile: React.FC<ProfileProps> = ({ contact, cv, profile }) => {
  return (
    <section className='b-1'>
      <div className='profile-cont'>
        <div className='card-cont'>
          <div className='card-image-cont spacer-2'>
            <div className='card-image-background'></div>
            <div className='card-image-border'></div>
            <div className='card-image-mask-1'></div>
            <div className='card-image-mask-2'></div>
            <div className='card-image-mask-3'></div>
            <img src={`/${profile.image}`} alt={`${profile.firstName} ${profile.lastName}`} className='card-image' />
          </div>
          <div className='card-text-cont'>
            <h1 className='text-2 spacer-1'>{`${profile.firstName} ${profile.lastName}`}</h1>
            <h2 className='text-3 spacer-1'>{profile.job}</h2>
            <a href={`mailto:${profile.email}`} className='text-4 spacer-2 link'>{profile.email}</a>
            <div className='card-links-cont'>
              {profile.link.map((link, linkIndex) => {
                return (
                  <a key={linkIndex} href={link.url} target='_blank' rel="noreferrer" className='card-links-link'>
                    <FontAwesomeIcon icon={getIconByName(link.name)} className='link'/>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className='quote-cont'>
          <div className='quote-text-cont'>
            <p className='text-quote spacer-2' dangerouslySetInnerHTML={{ __html: profile.description1 }}/>
            <p className='text-quote spacer-2' dangerouslySetInnerHTML={{ __html: profile.description2 }}/>
          </div>
          <div className='quote-button-cont'>
            <a href={`mailto:${profile.email}`} target="_blank" rel="noreferrer" className='button-quote btn'>
              <span>{contact}</span>
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a href='https://cv.mathi3u.com/' target="_blank" rel="noreferrer" className='button-quote btn'>
              <span>{cv}</span>
              <FontAwesomeIcon icon={faFile} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
