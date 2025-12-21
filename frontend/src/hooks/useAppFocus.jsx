import { useState, useEffect, useRef } from 'react';

export const useAppFocus = () => {
  const [switchCount, setSwitchCount] = useState(() => {
    const saved = localStorage.getItem('nn-switch-count');
    return saved ? Number(saved) : 0;
  });
  const [isFocused, setIsFocused] = useState(() => {
    const saved = localStorage.getItem('nn-is-focused');
    return saved ? saved === 'true' : true;
  });
  const sessionStartRef = useRef(0); // ✅ Fix 1: Initialize with 0, set Date.now() in useEffect

  useEffect(() => {
    // ✅ Fix 2: Set timestamp INSIDE useEffect (pure render)
    sessionStartRef.current = Date.now();

    const handleFocus = () => {
      setIsFocused(true);
      setSwitchCount(prev => {
        const switches = prev + 1;
        if (switches > 10) {
          sessionStartRef.current = Date.now(); // ✅ Safe here
          return 1;
        }
        return switches;
      });
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const visibilityChange = () => {
      if (document.hidden) {
        setIsFocused(false);
        setSwitchCount(prev => prev + 1);
      } else {
        setIsFocused(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', visibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', visibilityChange);
    };
  }, []);

    useEffect(() => {
    localStorage.setItem('nn-switch-count', String(switchCount));
  }, [switchCount]);

  useEffect(() => {
    localStorage.setItem('nn-is-focused', String(isFocused));
  }, [isFocused]);

  return { isFocused, switchCount };
};
