import React from 'react';
import './Timeline.css';

interface Timeline {
  name: string;
  place: string;
  url: string;
  detail: string;
  description: string;
  logo: string;
  period: {
    start: string;
    end: string;
  };
}

interface Timelines {
  title: string;
  timelines: Timeline[];
}

const formatDate = (dateStringStart: string, dateStringEnd: string): string => {
  
  const formatDateText = (dateString: string): string => {
    if (dateString === 'today') return 'Aujourd\'hui';
    const date = new Date(dateString);
    const monthNames = [
      'Janv.', 'Fevr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juill.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Dec.'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  if (/^\d{4}$/.test(dateStringStart) && /^\d{4}$/.test(dateStringEnd)) {
    return `${dateStringStart} - ${dateStringEnd}`;
  }

  if (dateStringStart === '' && /^\d{4}$/.test(dateStringEnd)) {
    return dateStringEnd;
  }

  return `${formatDateText(dateStringStart)} - ${formatDateText(dateStringEnd)}`;
};


const Timeline: React.FC<Timelines> = ({ title, timelines }) => {
  return (
    <section className='b-2'>
      <div className='cont-title'>
        <h2 className='text-1'>{title}</h2>
      </div>
      <div className='timeline-item-cont'>
        {timelines.map((timeline, index) => (
          <div className='timeline-item' key={index}>
            <div className='timeline-line-cont'>
              <div className='timeline-line'></div>
              <div className='timeline-round'>
                <img className='timeline-round-image' src={`/logos/${timeline.logo}`} alt={`Logo ${timeline.place}`} />
              </div>
            </div>
            <div className='timeline-text-cont'>
              <h3 className='text-2 spacer-1'>{timeline.name} <a target="_blank" className='link' href={timeline.url}>{timeline.place}</a></h3>
              <div className='timeline-subtext-cont spacer-2'>
                <p className='text-3 ellipsis'>{formatDate(timeline.period.start, timeline.period.end)}</p>
                <p className='text-separator'>●</p>
                <p className='text-3 ellipsis'>{timeline.detail}</p>
              </div>
              <p className='text-4 spacer-4' dangerouslySetInnerHTML={{ __html: timeline.description }}/>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
