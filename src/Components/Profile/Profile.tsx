import React from 'react';
import './Profile.css';

interface Profile {
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
  logo: string;
}

interface ProfileProps {
  profile: Profile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
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
            <img src={profile.image} alt={`${profile.firstName} ${profile.lastName}`} className='card-image' />
          </div>
          <div className='card-text-cont'>
            <h1 className='text-2 spacer-1'>{`${profile.firstName} ${profile.lastName}`}</h1>
            <h2 className='text-3 spacer-1'>{profile.job}</h2>
            <a href={`mailto:${profile.email}`} className='text-4 spacer-2'>{profile.email}</a>
            <div className='card-links-cont'>
              {profile.link.map((link, linkIndex) => {
                return (
                  <a key={linkIndex} href={link.url} target="_blank" className='card-links-link'>
                    <img src={link.logo} alt={link.name} className='card-links-image' />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className='quote-cont'>
          <div className='quote-text-cont'>
            <p className='text-quote spacer-2' dangerouslySetInnerHTML={{ __html: profile.description1 }}/>
            <p className='text-quote' dangerouslySetInnerHTML={{ __html: profile.description2 }}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
