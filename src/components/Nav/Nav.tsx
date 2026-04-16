import React from 'react';
import './Nav.css';
import { NavLanguageSelect } from './layers/NavLanguageSelect';

const Nav: React.FC = () => {
  return (
    <section className='b-e-1'>
      <div className='nav-cont'>
        <div className='nav-title-cont'>
          <h3 className='text-2'>mathi3u.com</h3>
        </div>
        <div className='nav-language-cont'>
          <NavLanguageSelect />
        </div>
      </div>
    </section>
  );
};

export default Nav;
