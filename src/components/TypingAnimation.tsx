
import React, { useState, useEffect, useRef } from 'react';

interface TypingAnimationProps {
  text: string;
  typingSpeed?: number;
  onComplete?: () => void;
  hasGlow?: boolean;
  containerMaxWidth?: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text, 
  typingSpeed = 50,
  onComplete,
  hasGlow = false,
  containerMaxWidth = "100%"
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOutGlow, setFadeOutGlow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    let charCount = 0;

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
            // Calculate which characters should have the typing glow
            const chars = visibleText.split('').map((char, idx) => {
              const isRecentlyTyped = currentIndex - partStart - 3 <= idx && idx < currentIndex - partStart + 1;
              return (
                <span 
                  key={`${part.id}-${idx}`} 
                  className={isRecentlyTyped ? "typing-glow-char" : ""}
                >
                  {char}
                </span>
              );
            });
            textSegments.push(<span key={part.id}>{chars}</span>);
          }
        }
      }
      
      position = Math.max(position, partEnd);
    });

    return textSegments;
  };

  return (
    <div 
      ref={containerRef}
      className="typing-animation-container"
      style={{ maxWidth: containerMaxWidth }}
    >
      <div className="text-wrapper">
        {renderProcessedText()}
        {!isComplete && (
          <span 
            className={`typing-caret ${hasGlow ? 'glowing-caret' : ''}`}
          ></span>
        )}
      </div>
    </div>
  );
};

export default TypingAnimation;
