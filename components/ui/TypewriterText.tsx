'use client';

import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

type Phase = 'typing' | 'pausing' | 'deleting' | 'switching';

interface State {
  textIndex: number;
  displayText: string;
  phase: Phase;
}

export function TypewriterText({
  texts,
  className = '',
  typingSpeed = 75,
  deletingSpeed = 38,
  pauseTime = 2200,
}: TypewriterTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState<State>({
    textIndex: 0,
    displayText: texts[0] ?? '',
    phase: 'pausing',
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (shouldReduceMotion || texts.length <= 1) return;

    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const { textIndex, displayText, phase } = stateRef.current;
      const currentText = texts[textIndex] ?? '';

      if (phase === 'typing') {
        if (displayText.length < currentText.length) {
          setState((s) => ({ ...s, displayText: currentText.slice(0, s.displayText.length + 1) }));
          timer = setTimeout(tick, typingSpeed);
        } else {
          setState((s) => ({ ...s, phase: 'pausing' }));
          timer = setTimeout(tick, pauseTime);
        }
      } else if (phase === 'pausing') {
        setState((s) => ({ ...s, phase: 'deleting' }));
        timer = setTimeout(tick, deletingSpeed);
      } else if (phase === 'deleting') {
        if (displayText.length > 0) {
          setState((s) => ({ ...s, displayText: s.displayText.slice(0, -1) }));
          timer = setTimeout(tick, deletingSpeed);
        } else {
          setState((s) => ({ ...s, phase: 'switching' }));
          timer = setTimeout(tick, 200);
        }
      } else {
        const nextIndex = (textIndex + 1) % texts.length;
        setState({ textIndex: nextIndex, displayText: '', phase: 'typing' });
        timer = setTimeout(tick, typingSpeed);
      }
    };

    timer = setTimeout(tick, pauseTime);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion, texts, typingSpeed, deletingSpeed, pauseTime]);

  if (shouldReduceMotion) {
    return <span className={className}>{texts[0]}</span>;
  }

  return (
    <span className={className}>
      {state.displayText}
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block w-[2px] h-[0.85em] bg-accent-light align-middle animate-[blink_1s_ease-in-out_infinite]"
      />
    </span>
  );
}
