import React from 'react';

interface TimelineTitleProps {
  name: string;
  place: string;
  url: string;
  t: (key: string) => string;
}

const TimelineTitle: React.FC<TimelineTitleProps> = ({ name, place, url, t }) => {
  return (
    <>
      {name}{' '}
      {place && url ? (
        <>
          {t('at')}{' '}
          <a target="_blank" rel="noreferrer" className="link" href={url} title={place}>
            {place}
          </a>
        </>
      ) : place ? (
        <>
          {t('at')} {place}
        </>
      ) : null}
    </>
  );
};

export default TimelineTitle;
