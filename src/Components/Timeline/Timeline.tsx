import React from 'react';
import './Timeline.css';
import type { TimelineData } from '../../types/experience';
import List from './List';
import NotList from './NotList';

interface Timelines {
  timelines: TimelineData[];
  isEducation: boolean;
  translations: (key: string) => string;
}

const Timeline: React.FC<Timelines> = ({ timelines, isEducation, translations: t }) => {
  return (
    <section className='b-2'>
      <div className='cont-title'>
        <h2 className='text-1'>{t(isEducation ? 'Education' : 'Experiences')}</h2>
      </div>
      <div className='timeline-item-cont'>
        {timelines.map((timeline, index) => (
          <div className='timeline-item' key={index}>
            <div className='timeline-line-cont'>
              <div className='timeline-line'></div>
              <div className='timeline-round'>
                <img className='timeline-round-image' src={timeline.logo} alt={`Logo ${timeline.place}`} />
              </div>
            </div>
            <div className='timeline-text-cont'>
              <h3 className='text-2 spacer-1'>{timeline.name} {t('at')} <a target="_blank" rel="noreferrer" className='link' href={timeline.url}>{timeline.place}</a></h3>
              <div className='timeline-subtext-cont spacer-2'>
                <p className='text-3 ellipsis'>{timeline.period.start} - {timeline.period.end}</p>
                <p className='text-separator'>●</p>
                <p className='text-3 ellipsis'>{timeline.detail}</p>
              </div>
              {isEducation ? <NotList items={timeline.description} /> : <List items={timeline.description} />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
