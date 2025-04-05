
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
      onComplete && onComplete();
    }
  }, [currentIndex, text, typingSpeed, isComplete, onComplete]);

  // Render processed text with special styling for "Apollo"
  const renderProcessedText = () => {
    const currentText = displayText;
    return processedText.map(part => {
      const partText = part.text;
      const textIndex = text.indexOf(partText);
      
      if (currentText.length > textIndex) {
        // Calculate how much of this part should be visible
        const visibleLength = Math.min(
          partText.length,
          currentText.length - textIndex
        );
        
        if (visibleLength > 0) {
          const visibleText = partText.slice(0, visibleLength);
          
          if (part.isApollo) {
            return (
              <span 
                key={part.id} 
                className="apollo-text"
              >
                {visibleText}
              </span>
            );
          }
          
          return <span key={part.id}>{visibleText}</span>;
        }
      }
      
      return null;
    }).filter(Boolean);
  };

  return (
    <span 
      className={`typing-animation relative inline-block ${hasGlow ? 'glow-typing' : ''}`}
      style={{ 
        width: 'auto',
        filter: isComplete ? 'blur(0px)' : 'blur(0.4px)'
      }}
    >
      <span className="relative">
        {hasGlow ? renderProcessedText() : displayText}
        {!isComplete && (
          <span 
            className={`absolute right-0 top-0 h-full w-1 ${
              hasGlow ? 'glowing-caret' : 'bg-blue-500'
            }`} 
            style={{
              animation: 'blink-caret 0.75s step-end infinite',
              opacity: 0.8
            }}
          ></span>
        )}
      </span>
    </span>
  );
};

export default TypingAnimation;
