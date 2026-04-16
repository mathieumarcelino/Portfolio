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
import { useExperiences } from './hooks/useExperiences';
import { useEducations } from 'hooks/useEducations';
import { useProjects } from './hooks/useProjects';

function AppContent() {
  const { language } = useLanguage();

  const links = useLinks();
  const profile = useProfile(language);
  const experiences = useExperiences(language);
  const educations = useEducations(language);
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
        <Profile profile={profile} links={links} />
      </div>
      <div className='el-2'>
        <Timeline timelines={experiences} />
        <Timeline timelines={educations} />
      </div>
      <div className='el-1'>
        <Project projects={projects} />
      </div>
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
