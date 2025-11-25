import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  velocity: { x: number; y: number };
}

interface ConfettiEffectProps {
  trigger?: boolean;
  duration?: number;
}

export function ConfettiEffect({ trigger = false, duration = 3000 }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    setIsActive(true);
    const colors = ["#3b82f6", "#a3e635", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
    const newParticles: Particle[] = [];

    // Create 50 particles
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: Math.random() * 2 + 1,
        },
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setIsActive(false);
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 sm:w-3 sm:h-3"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animation: `confetti-fall ${duration}ms ease-out forwards`,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${Math.random() * 200}ms`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
