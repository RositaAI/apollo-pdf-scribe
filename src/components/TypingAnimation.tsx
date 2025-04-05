
import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  typingSpeed?: number;
  onComplete?: () => void;
  hasGlow?: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text, 
  typingSpeed = 50,
  onComplete,
  hasGlow = false
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOutGlow, setFadeOutGlow] = useState(false);

  // Parse the text to identify "Apollo" occurrences
  const processedText = text.split(/(Apollo)/gi).map((part, index) => {
    if (part.toLowerCase() === "apollo") {
      return { text: part, isApollo: true, id: `apollo-${index}` };
    }
    return { text: part, isApollo: false, id: `text-${index}` };
  });

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex + 1));
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      setTimeout(() => setFadeOutGlow(true), 1000);
      onComplete && onComplete();
    }
  }, [currentIndex, text, typingSpeed, isComplete, onComplete]);

  // Render processed text with special styling for "Apollo"
  const renderProcessedText = () => {
    let textSegments = [];
    let position = 0;

    processedText.forEach((part) => {
      const partText = part.text;
      
      const partStart = text.indexOf(partText, position);
      const partEnd = partStart + partText.length;
      
      if (currentIndex >= partStart) {
        const charsTyped = Math.min(currentIndex - partStart + 1, partText.length);
        
        const visibleText = partText.substring(0, charsTyped);
        
        if (visibleText.length > 0) {
          if (part.isApollo) {
            textSegments.push(
              <span key={part.id} className="apollo-text">
                {visibleText}
              </span>
            );
          } else {
            textSegments.push(<span key={part.id}>{visibleText}</span>);
          }
        }
      }
      
      position = Math.max(position, partEnd);
    });

    return textSegments;
  };

  return (
    <span 
      className={`typing-animation relative inline-block ${hasGlow ? 'glow-typing' : ''} ${fadeOutGlow ? 'glow-fade-out' : ''}`}
    >
      <span className="relative">
        {renderProcessedText()}
        {!isComplete && (
          <span 
            className={`absolute right-0 top-0 h-full w-1 ${
              hasGlow ? 'glowing-caret' : 'bg-gray-300'
            }`} 
            style={{
              animation: 'blink-caret 0.75s step-end infinite',
            }}
          ></span>
        )}
      </span>
    </span>
  );
};

export default TypingAnimation;
