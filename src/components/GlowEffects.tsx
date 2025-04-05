
import React from 'react';

export const GlowFilters = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Clean white SVG filter for text glow effect */}
        <filter
          id="white-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur 
            stdDeviation="2" 
            result="blur1" 
          />
          <feFlood 
            floodColor="#ffffff" 
            floodOpacity="0.7" 
            result="color" 
          />
          <feComposite 
            in="color" 
            in2="blur1" 
            operator="in" 
            result="coloredBlur" 
          />
          <feGaussianBlur 
            in="coloredBlur" 
            stdDeviation="3" 
            result="blurredColor" 
          />
          <feComponentTransfer in="blurredColor" result="brightenedBlur">
            <feFuncR type="linear" slope="1.5" />
            <feFuncG type="linear" slope="1.5" />
            <feFuncB type="linear" slope="1.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="brightenedBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Improved Apollo RGB gradient animated glow filter */}
        <filter id="apollo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feFlood floodColor="#ffffff" floodOpacity="0.9" result="glowColor"/>
          <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
          <feGaussianBlur in="softGlow" stdDeviation="5" result="expandedGlow"/>
          <feComponentTransfer in="expandedGlow" result="brightGlow">
            <feFuncR type="linear" slope="2.2" />
            <feFuncG type="linear" slope="2.2" />
            <feFuncB type="linear" slope="2.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="brightGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* White character glow filter for typing animation */}
        <filter id="typing-char-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#ffffff" floodOpacity="0.8" result="glowColor"/>
          <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
          <feGaussianBlur in="softGlow" stdDeviation="2.5" result="expandedGlow"/>
          <feMerge>
            <feMergeNode in="expandedGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Cursor glow filter - soft white glow */}
        <filter id="cursor-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feFlood floodColor="#ffffff" floodOpacity="0.9" result="glowColor"/>
          <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
          <feGaussianBlur in="softGlow" stdDeviation="2" result="expandedGlow"/>
          <feMerge>
            <feMergeNode in="expandedGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* RGB gradient defs for Apollo text */}
        <linearGradient id="apollo-rgb-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff9a9e">
            <animate
              attributeName="stopColor"
              values="#ff9a9e; #fad0c4; #fbc2eb; #a6c1ee; #f5efef; #ff9a9e"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#fad0c4">
            <animate
              attributeName="stopColor"
              values="#fad0c4; #fbc2eb; #a6c1ee; #f5efef; #ff9a9e; #fad0c4"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#fbc2eb">
            <animate
              attributeName="stopColor"
              values="#fbc2eb; #a6c1ee; #f5efef; #ff9a9e; #fad0c4; #fbc2eb"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        {/* Improved rainbow container background */}
        <linearGradient id="improved-rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8f9fa">
            <animate
              attributeName="stopColor"
              values="#f8f9fa; #e9ecef; #dee2e6; #ced4da; #f8f9fa"
              dur="10s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#e9ecef">
            <animate
              attributeName="stopColor"
              values="#e9ecef; #dee2e6; #ced4da; #f8f9fa; #e9ecef"
              dur="10s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#dee2e6">
            <animate
              attributeName="stopColor"
              values="#dee2e6; #ced4da; #f8f9fa; #e9ecef; #dee2e6"
              dur="10s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export const GlowText = ({ text, isApollo = false }: { text: string; isApollo?: boolean }) => {
  if (isApollo) {
    return (
      <span className="apollo-text">
        {text}
      </span>
    );
  }

  return <span className="glow-text">{text}</span>;
};
