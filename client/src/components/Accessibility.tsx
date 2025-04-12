import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Switch, Select, Slider } from 'antd';
import {
  EyeOutlined,
  FontSizeOutlined,
  AudioOutlined,
  PauseOutlined,
  PlayOutlined,
  StopOutlined
} from '@ant-design/icons';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface AccessibilityProps {
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onHighContrastToggle: (enabled: boolean) => void;
}

const Accessibility: React.FC<AccessibilityProps> = ({
  onFontSizeChange,
  onHighContrastToggle
}) => {
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const {
    isSpeaking,
    voices,
    loadVoices,
    speak,
    stop,
    pause,
    resume
  } = useTextToSpeech();

  useEffect(() => {
    loadVoices();
    if (voices.length > 0) {
      setSelectedVoice(voices[0]);
    }
  }, [loadVoices, voices]);

  const handleHighContrastToggle = (checked: boolean) => {
    setHighContrast(checked);
    onHighContrastToggle(checked);
  };

  const handleTextToSpeechToggle = (checked: boolean) => {
    setTextToSpeech(checked);
    if (checked) {
      speak('Text to speech enabled', { rate, pitch, volume, voice: selectedVoice || undefined });
    } else {
      stop();
    }
  };

  const handleSpeak = () => {
    const text = document.body.innerText;
    speak(text, { rate, pitch, volume, voice: selectedVoice || undefined });
  };

  return (
    <div className="accessibility-toolbar" role="toolbar" aria-label="Accessibility toolbar">
      <div className="accessibility-group">
        <Tooltip title="Font Size">
          <Button.Group>
            <Button
              icon={<FontSizeOutlined />}
              onClick={() => onFontSizeChange('small')}
              aria-label="Small font size"
            >
              A
            </Button>
            <Button
              icon={<FontSizeOutlined />}
              onClick={() => onFontSizeChange('medium')}
              aria-label="Medium font size"
            >
              A
            </Button>
            <Button
              icon={<FontSizeOutlined />}
              onClick={() => onFontSizeChange('large')}
              aria-label="Large font size"
            >
              A
            </Button>
          </Button.Group>
        </Tooltip>

        <Tooltip title="High Contrast">
          <Switch
            checked={highContrast}
            onChange={handleHighContrastToggle}
            checkedChildren={<EyeOutlined />}
            unCheckedChildren={<EyeOutlined />}
            aria-label="Toggle high contrast mode"
          />
        </Tooltip>
      </div>

      <div className="accessibility-group">
        <Tooltip title="Text to Speech">
          <Switch
            checked={textToSpeech}
            onChange={handleTextToSpeechToggle}
            checkedChildren={<AudioOutlined />}
            unCheckedChildren={<AudioOutlined />}
            aria-label="Toggle text to speech"
          />
        </Tooltip>

        {textToSpeech && (
          <>
            <Button.Group>
              <Button
                icon={<PlayOutlined />}
                onClick={handleSpeak}
                disabled={isSpeaking}
                aria-label="Start reading"
              />
              <Button
                icon={<PauseOutlined />}
                onClick={pause}
                disabled={!isSpeaking}
                aria-label="Pause reading"
              />
              <Button
                icon={<StopOutlined />}
                onClick={stop}
                disabled={!isSpeaking}
                aria-label="Stop reading"
              />
            </Button.Group>

            <div className="text-to-speech-controls">
              <div>
                <label htmlFor="rate">Rate:</label>
                <Slider
                  id="rate"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={rate}
                  onChange={setRate}
                  aria-label="Speech rate"
                />
              </div>

              <div>
                <label htmlFor="pitch">Pitch:</label>
                <Slider
                  id="pitch"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={pitch}
                  onChange={setPitch}
                  aria-label="Speech pitch"
                />
              </div>

              <div>
                <label htmlFor="volume">Volume:</label>
                <Slider
                  id="volume"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={setVolume}
                  aria-label="Speech volume"
                />
              </div>

              <div>
                <label htmlFor="voice">Voice:</label>
                <Select
                  id="voice"
                  value={selectedVoice?.name}
                  onChange={(value) => {
                    const voice = voices.find((v) => v.name === value);
                    setSelectedVoice(voice || null);
                  }}
                  options={voices.map((voice) => ({
                    value: voice.name,
                    label: voice.name
                  }))}
                  aria-label="Select voice"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Accessibility; 