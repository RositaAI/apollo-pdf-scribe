
import React from 'react';

export const GlowFilters = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Enhanced SFG-like bloom filter for text glow effect */}
        <filter
          id="bloom-filter"
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
            floodColor="#0EA5E9" 
            floodOpacity="0.3" 
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
            stdDeviation="4" 
            result="blurredColor" 
          />
          <feComponentTransfer in="blurredColor" result="brightenedBlur">
            <feFuncR type="linear" slope="2.5" />
            <feFuncG type="linear" slope="2.5" />
            <feFuncB type="linear" slope="2.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="brightenedBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Improved Apollo name SFG-like blue glow filter */}
        <filter id="apollo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#0EA5E9" floodOpacity="0.7" result="glowColor"/>
          <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
          <feGaussianBlur in="softGlow" stdDeviation="3" result="expandedGlow"/>
          <feComponentTransfer in="expandedGlow" result="brightGlow">
            <feFuncR type="linear" slope="3" />
            <feFuncG type="linear" slope="3" />
            <feFuncB type="linear" slope="3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="brightGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Typing glow filter that follows the cursor */}
        <filter id="typing-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feFlood floodColor="#3b82f6" floodOpacity="0.6" result="glowColor"/>
          <feComposite in="glowColor" in2="blur" operator="in" result="softGlow"/>
          <feGaussianBlur in="softGlow" stdDeviation="2" result="expandedGlow"/>
          <feMerge>
            <feMergeNode in="expandedGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Rainbow container background with improved realism */}
        <linearGradient id="improved-rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#24cbde">
            <animate
              attributeName="stopColor"
              values="#24cbde; #bd52f9; #1cc98c; #57a9f7; #ebb347; #24cbde"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#bd52f9">
            <animate
              attributeName="stopColor"
              values="#bd52f9; #1cc98c; #57a9f7; #ebb347; #24cbde; #bd52f9"
              dur="8s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#1cc98c">
            <animate
              attributeName="stopColor"
              values="#1cc98c; #57a9f7; #ebb347; #24cbde; #bd52f9; #1cc98c"
              dur="8s"
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
