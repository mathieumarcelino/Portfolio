import React from 'react';
import './Timeline.css';

const NotList: React.FC<{ items: string[] }> = ({ items }) => {
  if (!items) return null;

  return (
    <div className='timeline-not-list text-4 spacer-4'>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
};

export default NotList;
