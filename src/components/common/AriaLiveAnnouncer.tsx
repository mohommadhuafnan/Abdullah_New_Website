import React from 'react';
import { useCMS } from '../../context/CMSContext';

export const AriaLiveAnnouncer: React.FC = () => {
  const { liveMessage, isAssertive } = useCMS();

  return (
    <>
      {/* Polite announcer for normal updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {!isAssertive ? liveMessage : ''}
      </div>

      {/* Assertive announcer for critical alerts / errors */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {isAssertive ? liveMessage : ''}
      </div>
    </>
  );
};
