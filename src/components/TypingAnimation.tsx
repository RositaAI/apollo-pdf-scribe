
import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  typingSpeed?: number;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text, 
  typingSpeed = 50,
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete && onComplete();
    }
  }, [currentIndex, text, typingSpeed, isComplete, onComplete]);

  return (
    <span className="typing-animation" style={{ width: 'auto' }}>
      {displayText}
    </span>
  );
};

export default TypingAnimation;
