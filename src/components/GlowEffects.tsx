
import React from 'react';

export const GlowFilters = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Bloom filter for text glow effect */}
        <filter
          id="bloom-filter"
          width="200%"
          height="200%"
          x="-50%"
          y="-50%"
        >
          <feComponentTransfer result="amplified">
            <feFuncR type="linear" slope="0.7" intercept="0"></feFuncR>
            <feFuncG type="linear" slope="0.7" intercept="0"></feFuncG>
            <feFuncB type="linear" slope="0.7" intercept="0"></feFuncB>
          </feComponentTransfer>
          <feColorMatrix in="amplified" type="saturate" values="0" result="desaturated"></feColorMatrix>
          <feComponentTransfer in="desaturated" result="thresholded">
            <feFuncR type="table" tableValues="0,1"></feFuncR>
            <feFuncG type="table" tableValues="0,1"></feFuncG>
            <feFuncB type="table" tableValues="0,1"></feFuncB>
          </feComponentTransfer>
          <feColorMatrix
            in="thresholded"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    1 0 0 0 0"
            result="alphaMask"
          ></feColorMatrix>
          <feComposite
            in="SourceGraphic"
            in2="alphaMask"
            operator="arithmetic"
            k1="1"
            k2="0"
            k3="0"
            k4="0"
            result="maskedSource"
          ></feComposite>
          <feComponentTransfer in="maskedSource" result="brightened">
            <feFuncR type="linear" slope="1"></feFuncR>
            <feFuncG type="linear" slope="1"></feFuncG>
            <feFuncB type="linear" slope="1"></feFuncB>
          </feComponentTransfer>
          <feGaussianBlur
            in="brightened"
            stdDeviation="10"
            edgeMode="none"
            result="blurredBloom"
          ></feGaussianBlur>
          <feGaussianBlur
            in="brightened"
            stdDeviation="4"
            edgeMode="none"
            result="blurredBloom2"
          ></feGaussianBlur>
          <feComposite
            in="SourceGraphic"
            in2="blurredBloom"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="finalBloom"
          ></feComposite>
          <feComposite
            in="finalBloom"
            in2="blurredBloom2"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          ></feComposite>
        </filter>

        {/* Apollo name gradient glow filter */}
        <filter id="apollo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 20 -8"
            result="glow"
          />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>

        {/* Gradient definition for Apollo text */}
        <linearGradient id="apollo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#24cbde">
            <animate
              attributeName="stopColor"
              values="#24cbde; #bd52f9; #1cc98c; #57a9f7; #ebb347; #24cbde"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#bd52f9">
            <animate
              attributeName="stopColor"
              values="#bd52f9; #1cc98c; #57a9f7; #ebb347; #24cbde; #bd52f9"
              dur="4s"
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
