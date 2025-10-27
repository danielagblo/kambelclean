'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO string format
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="text-center bg-white rounded-xl px-6 py-4 shadow-lg border-2 border-[#374957]">
        <div className="text-4xl font-bold" style={{ color: '#374957' }}>
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <div className="text-sm text-gray-600 font-medium">Days</div>
      </div>
      <div className="text-2xl font-bold" style={{ color: '#374957' }}>:</div>
      <div className="text-center bg-white rounded-xl px-6 py-4 shadow-lg border-2 border-[#374957]">
        <div className="text-4xl font-bold" style={{ color: '#374957' }}>
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div className="text-sm text-gray-600 font-medium">Hours</div>
      </div>
      <div className="text-2xl font-bold" style={{ color: '#374957' }}>:</div>
      <div className="text-center bg-white rounded-xl px-6 py-4 shadow-lg border-2 border-[#374957]">
        <div className="text-4xl font-bold" style={{ color: '#374957' }}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div className="text-sm text-gray-600 font-medium">Minutes</div>
      </div>
      <div className="text-2xl font-bold" style={{ color: '#374957' }}>:</div>
      <div className="text-center bg-white rounded-xl px-6 py-4 shadow-lg border-2 border-[#374957]">
        <div className="text-4xl font-bold" style={{ color: '#374957' }}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="text-sm text-gray-600 font-medium">Seconds</div>
      </div>
    </div>
  );
}

