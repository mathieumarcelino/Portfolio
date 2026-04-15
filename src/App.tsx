import React from 'react';
import './reset.css';
import './App.css';

import Nav from './components/Nav/Nav';
import Profile from './components/Profile/Profile';
import Timeline from './components/Timeline/Timeline';
import Project from './components/Project/Project';
import Footer from 'components/Footer/Footer';

import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
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
      <div className='el-1'>
        <Profile profile={profile} links={links} t={t} />
      </div>
      <div className='el-2'>
        <Timeline timelines={experiences} t={t} />
        <Timeline timelines={educations} t={t} />
      </div>
      <div className='el-1'>
        <Project projects={projects} t={t} />
      </div>
      <div className='el-1'>
        <Footer t={t} />
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
