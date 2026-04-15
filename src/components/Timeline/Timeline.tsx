import React from 'react';
import './Timeline.css';
import type { TimelineData } from '../../types/timeline';
import TimelineList from './layers/TimelineList';
import TimelineTitle from './layers/TimelineTitle';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faBuilding } from "@fortawesome/free-solid-svg-icons";

interface Timelines {
  timelines: TimelineData[];
  t: (key: string) => string;
}

const Timeline: React.FC<Timelines> = ({ timelines, t }) => {
  return (
    <section className='b-2'>
      <div className='cont-title'>
        <h2 className='text-1'>{t(timelines[0]?.type === 'experience' ? 'Experiences' : 'Education')}</h2>
      </div>
      <div className='timeline-item-cont'>
        {timelines.map((timeline, index) => (
          <div className='timeline-item' key={index}>
            <div className='timeline-line-cont'>
              <div className='timeline-line'></div>
              <div className='timeline-round'>
                {timeline.logo 
                  ? <img className='timeline-round-image' src={timeline.logo} alt={`Logo ${timeline.name}`} /> 
                  : <FontAwesomeIcon icon={timeline.type === 'experience' ? faBuilding : faAward} />
                }
              </div>
            </div>
            <div className='timeline-text-cont'>
              <h3 className='text-2 spacer-1'>
                <TimelineTitle name={timeline.name} place={timeline.place} url={timeline.url} t={t} />
              </h3>
              <div className='timeline-subtext-cont spacer-2'>
                <p className='text-3 ellipsis'>{timeline.period}</p>
                <p className='text-separator'>●</p>
                <p className='text-3 ellipsis'>{timeline.detail}</p>
              </div>
              <TimelineList isList={timeline.isList} description={timeline.description} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
