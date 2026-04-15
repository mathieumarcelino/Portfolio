import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TimelineTitleProps {
  name: string;
  place: string;
  url: string;
}

const TimelineTitle: React.FC<TimelineTitleProps> = ({ name, place, url }) => {
  const { t } = useLanguage();
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
