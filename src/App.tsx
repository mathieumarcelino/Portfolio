import React from 'react';
import './reset.css';
import './App.css';

import Nav from './Components/Nav/Nav';
import Profile from './Components/Profile/Profile';
import Timeline from './Components/Timeline/Timeline';
import Project from './Components/Project/Project';
import Footer from 'Components/Footer/Footer';

import { LanguageProvider, useLanguage } from './Contexts/LanguageContext';
import { useProfile } from './hooks/useProfile';
import { useLinks } from 'hooks/useLink';
import { useTranslations } from 'hooks/useTranslations';
import { useExperiences } from './hooks/useExperiences';
import { useEducations } from 'hooks/useEducations';
import { useProjects } from './hooks/useProjects';

function AppContent() {
  const { language } = useLanguage();

  const t = useTranslations(language);
  const links = useLinks();
  const profile = useProfile(language);
  const experiences = useExperiences(language, t);
  const educations = useEducations(language, t);
  const projects = useProjects(language);

  if (!profile || !experiences || !educations || !projects) {
    return <div className='loading'><div className="spinner"></div></div>;
  }

  return (
    <div className='main'>
      <div className='el-1'>
        <Nav />
      </div>
      {profile && (
        <div className='el-1'>
          <Profile profile={profile} links={links} translations={t} />
        </div>
      )}
      {(experiences || educations) && (
        <div className='el-2'>
          {experiences && (
            <Timeline timelines={experiences} isEducation={false} translations={t} />
          )}
          {educations && (
            <Timeline timelines={educations} isEducation={true} translations={t} />
          )}
        </div>
      )}
      {projects && (
        <div className='el-1'>
          <Project title={t('Projects')} projects={projects} />
        </div>
      )}
      <div className='el-1'>
        <Footer />
      </div>  
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
