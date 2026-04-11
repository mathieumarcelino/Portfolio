import React from 'react';
import './Timeline.css';

const List: React.FC<{ items: string[] }> = ({ items }) => {
  if (!items) return null;

  return (
    <div className='timeline-list text-4 spacer-4'>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default List;
