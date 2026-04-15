import React from 'react';
import './Footer.css';
import { useLanguage } from '../../contexts/LanguageContext';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const { t } = useLanguage();
  
  return (
    <section className='b-1'>
      <div className='footer'>
        <p className='footer-text text-4'>{t('Developed by mathi3u.com')}</p>
      </div>
    </section>
  );
};

export default Footer;
