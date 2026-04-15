import React from 'react';
import './Footer.css';

interface FooterProps {
  t: (key: string) => string;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <section className='b-1'>
      <div className='footer'>
        <p className='footer-text text-4'>{t('Developed by mathi3u.com')}</p>
      </div>
    </section>
  );
};

export default Footer;
