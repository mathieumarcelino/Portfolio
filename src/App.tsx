import React from 'react';
import './reset.css';
import './App.css';
import dataEn from './Data/Data/en.json';
import dataFr from './Data/Data/fr.json';
import translationEn from './Data/Translations/en.json';
import translationFr from './Data/Translations/fr.json';
import Nav from './Components/Nav/Nav';
import Profile from './Components/Profile/Profile';
import Timeline from './Components/Timeline/Timeline';
import Project from './Components/Project/Project';
import { LanguageProvider, useLanguage } from './Contexts/LanguageContext';

function AppContent() {
  const { language } = useLanguage();
  const data = language === 'en' ? dataEn : dataFr;
  const translation = language === 'en' ? translationEn : translationFr;

  return (
    <div className='main'>
      <div className='el-1'>
        <Nav />
      </div>
      <div className='el-1'>
        <Profile contact={translation.text.contact} cv={translation.text.cv} profile={data.profile} />
      </div>
      <div className='el-2'>
        <Timeline title={translation.title.experiences} timelines={data.experience} />
        <Timeline title={translation.title.trainings} timelines={data.training} />
      </div>
      <div className='el-1'>
        <Project title={translation.title.projects} projects={data.project} />
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
