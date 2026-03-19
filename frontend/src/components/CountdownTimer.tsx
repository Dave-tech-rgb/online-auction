import React, { useEffect, useState } from 'react';
import { differenceInSeconds, differenceInMinutes, differenceInHours } from 'date-fns';

interface CountdownTimerProps {
  endTime: string;
  onExpire?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, onExpire }) => {
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [isExpiringSoon, setIsExpiringSoon] = useState<boolean>(false);
  const [hasExpired, setHasExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endTime);
      const totalSecondsLeft = differenceInSeconds(end, now);

      if (totalSecondsLeft <= 0) {
        setHasExpired(true);
        setTimeLeftStr('Auction Ended');
        if (onExpire) {
          onExpire();
        }
        return;
      }

      const hours = differenceInHours(end, now);
      const minutes = differenceInMinutes(end, now) % 60;
      const seconds = totalSecondsLeft % 60;

      // Check if expiring in less than 5 minutes for 'expiring soon' warning
      if (totalSecondsLeft < 300) {
        setIsExpiringSoon(true);
      } else {
        setIsExpiringSoon(false);
      }

      setTimeLeftStr(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [endTime, onExpire]);

  return (
    <div
      className={`font-semibold text-sm ${
        hasExpired
          ? 'text-gray-500'
          : isExpiringSoon
          ? 'text-red-500 animate-pulse'
          : 'text-gray-700'
      }`}
    >
      {hasExpired ? 'Expired' : `Ends in: ${timeLeftStr}`}
    </div>
  );
};

export default CountdownTimer;
