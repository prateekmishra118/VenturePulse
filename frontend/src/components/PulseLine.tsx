interface PulseLineProps {
  className?: string;
  stroke?: string;
  animated?: boolean;
}

export function PulseLine({ className = '', stroke = 'currentColor', animated = true }: PulseLineProps) {
  return (
    <svg
      viewBox="0 0 400 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M0 30 H120 L140 30 L155 8 L172 52 L188 30 L200 30 L215 18 L230 42 L245 30 H400"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={animated ? 1 : undefined}
        strokeDashoffset={animated ? 1 : undefined}
        style={
          animated
            ? {
                animation: 'pulse-draw 2.4s ease-out forwards'
              }
            : undefined
        }
      />
      {animated && (
        <style>{`
          @keyframes pulse-draw {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      )}
    </svg>
  );
}
