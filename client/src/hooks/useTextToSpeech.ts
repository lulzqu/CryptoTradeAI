import { useState, useCallback } from 'react';

interface TextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const loadVoices = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
  }, []);

  const speak = useCallback(
    (text: string, options: TextToSpeechOptions = {}) => {
      if (!window.speechSynthesis) {
        console.error('Speech synthesis not supported');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.voice = options.voice || voices[0];

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsSpeaking(false);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsSpeaking(true);
  }, []);

  return {
    isSpeaking,
    voices,
    loadVoices,
    speak,
    stop,
    pause,
    resume
  };
}; 