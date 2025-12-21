import { useState, useRef, useEffect, useCallback } from 'react';

export const useCamera = () => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const [eyeData, setEyeData] = useState({
    blinkRate: 15,
    fixations: 120,
    dilation: 0.12
  });
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      // ✅ BETTER CAMERA SETTINGS
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // ✅ FORCE PLAY + ERROR HANDLING
        videoRef.current.play().catch(err => {
          console.error('Video play failed:', err);
        });
      }

      // ✅ SIMULATED EYE DATA - Updates every 2s
      intervalRef.current = setInterval(() => {
        setEyeData({
          blinkRate: 12 + Math.random() * 18, // 12-30 blinks/min
          fixations: 100 + Math.random() * 80,  // 100-180 fixations
          dilation: 0.08 + Math.random() * 0.15 // 0.08-0.23 pupil
        });
      }, 2000);

      setIsActive(true);
      console.log('✅ Camera + Eye tracking ACTIVE');
    } catch (error) {
      console.error('Camera failed:', error);
      alert('Camera access denied. Check browser permissions.');
      setIsActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setEyeData({ blinkRate: 15, fixations: 120, dilation: 0.12 });
    setIsActive(false);
    console.log('🛑 Camera stopped');
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return { 
    videoRef, 
    eyeData, 
    isActive, 
    startCamera, 
    stopCamera 
  };
};
