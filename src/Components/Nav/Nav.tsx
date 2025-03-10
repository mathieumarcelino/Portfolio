import React from 'react';
import { useLanguage } from '../../Contexts/LanguageContext';
import './Nav.css';

const Nav: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <section className='b-e-1'>
      <div className='nav-cont'>
        <div className='nav-title-cont'>
          <h3 className='text-2'>mathi3u.com</h3>
        </div>
        <div className='nav-language-cont'>
          <h3 className={`text-2 pointer ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>English</h3>
          <h3 className={`text-2 pointer ${language === 'fr' ? 'active' : ''}`} onClick={() => setLanguage('fr')}>Français</h3>
        </div>
      </div>
    </section>
  );
};

export default Nav;
