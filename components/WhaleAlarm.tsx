import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Siren } from 'lucide-react';

interface WhaleAlarmProps {
  onAlarmStateChange: (isActive: boolean) => void;
}

export const WhaleAlarm: React.FC<WhaleAlarmProps> = ({ onAlarmStateChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');

  const ALARM_MESSAGES = [
    "WHALE SIGHTED OFF THE PORT BOW!",
    "DEPTH CHARGES PRIMED!",
    "MASSIVE BUY PRESSURE DETECTED!",
    "HARPOONS AT THE READY!",
    "THE WHITE WHALE BREACHES!"
  ];

  useEffect(() => {
    // Random alarm trigger
    const triggerAlarm = () => {
      if (Math.random() > 0.6) { // 40% chance every check
        const msg = ALARM_MESSAGES[Math.floor(Math.random() * ALARM_MESSAGES.length)];
        setMessage(msg);
        setIsActive(true);
        onAlarmStateChange(true);

        // Turn off after 4 seconds
        setTimeout(() => {
          setIsActive(false);
          onAlarmStateChange(false);
        }, 4000);
      }
    };

    const interval = setInterval(triggerAlarm, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-24 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className="bg-red-900/90 border-2 border-red-500 text-white px-8 py-4 rounded-xl shadow-[0_0_50px_#ef4444] flex items-center gap-4 animate-bounce">
            <Siren className="w-8 h-8 animate-spin" />
            <div className="flex flex-col items-center">
              <span className="font-meme text-2xl tracking-widest text-red-200">CRITICAL ALERT</span>
              <span className="font-tech text-sm">{message}</span>
            </div>
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
