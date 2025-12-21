import { useState, useEffect, useRef } from 'react';

export const useTypingSpeed = () => {
  const [charsPerMinute, setCharsPerMinute] = useState(0);
  const keyPressesRef = useRef([]); // Timestamp array
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const handleKeyDown = (e) => {
      // ✅ TRACK ALL TYPING - WhatsApp, VSCode, Notepad, Everywhere!
      const now = Date.now();
      
      // Debounce: Ignore keys <100ms apart
      if (now - lastKeyTimeRef.current > 100) {
        keyPressesRef.current.push(now);
        lastKeyTimeRef.current = now;
        
        // Keep only last 2 minutes of data
        const cutoff = now - 120000;
        keyPressesRef.current = keyPressesRef.current.filter(time => time > cutoff);
        
        // Calculate CPM from last 60 seconds
        const recent = keyPressesRef.current.filter(time => time > now - 60000);
        if (recent.length > 5) {
          const cpm = Math.round(recent.length * 60 / 60); // Keys per minute
          setCharsPerMinute(Math.min(cpm, 500)); // Cap at 500cpm
        }
      }
    };

    // ✅ GLOBAL LISTENER - Works across ALL apps/tabs!
    document.addEventListener('keydown', handleKeyDown, true); // Capture phase
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  // Reset on unmount
  useEffect(() => {
    return () => {
      keyPressesRef.current = [];
      setCharsPerMinute(0);
    };
  }, []);

  return { charsPerMinute };
};
