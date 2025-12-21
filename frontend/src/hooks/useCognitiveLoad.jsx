import { useMemo } from 'react';
import { useCamera } from './useCamera';
import { useTypingSpeed } from './useTypingSpeed';
import { useAppFocus } from './useAppFocus';

export const useCognitiveLoad = (taskLoad) => {
  const camera = useCamera();
  const { charsPerMinute } = useTypingSpeed();
  const { isFocused, switchCount } = useAppFocus();

  const loadScore = useMemo(() => {
    // Eye score (pupil dilation 0.08-0.23 → 0-1)
    const eyeScoreRaw = (camera.eyeData.dilation - 0.08) / 0.15;
    const eyeScore = Math.min(Math.max(eyeScoreRaw, 0), 1);

    // Typing score (>400cpm = high cognitive load)
    const typingScore = Math.min(charsPerMinute / 400, 1);

    // Switch score (>8 switches = distracted)
    const switchScore = Math.min(switchCount / 8, 1);

    // Task score (from Week 1)
    const taskScore = Math.min(taskLoad, 1);

    // Focus penalty (unfocused window)
    const focusPenalty = isFocused ? 0 : 0.3;

    // NeuralNest magic formula! 🎉
    const brainLoad = (eyeScore + typingScore + switchScore + taskScore) / 4 - focusPenalty;
    
    return Math.min(Math.max(brainLoad, 0), 1);
  }, [camera.eyeData.dilation, charsPerMinute, switchCount, taskLoad, isFocused]);

  const resetMetrics = () => {
    // Clear localStorage (forces child hooks to reset on next render)
    localStorage.removeItem('nn-switch-count');
    localStorage.removeItem('nn-is-focused');
    
    // Force child hooks to re-initialize by triggering re-render
    window.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new CustomEvent('focus'));
    window.dispatchEvent(new CustomEvent('blur'));
  };

  return {
    // ✅ ALL camera properties
    isActive: camera.isActive,
    videoRef: camera.videoRef,
    eyeData: camera.eyeData,
    startCamera: camera.startCamera,
    stopCamera: camera.stopCamera,
    
    // ✅ Typing + Focus
    charsPerMinute,
    isFocused,
    switchCount,
    
    // ✅ Single brain load score
    loadScore,

    resetMetrics
  };
};
