import React from 'react';

interface TimelineListProps {
  isList: boolean;
  description: string[];
}

const TimelineList: React.FC<TimelineListProps> = ({ isList, description }) => {
  if (description.length === 0) return null;
  return (
    <div className='text-4 spacer-4'>
      {isList ? (
          <ul>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
      )
      : (
          <div className='timeline-not-list'>
            {description.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
      )}
    </div>
  );
};

export default TimelineList;
