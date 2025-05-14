'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';

const CITIES = [
  { name: 'Yapkashnagar', distance: 60, description: 'The Neon Oasis: Glowing alleys and rooftop races, powered by solar energy.' },
  { name: 'Lihaspur', distance: 50, description: 'The Misty Labyrinth: Ancient temples shrouded in fog, whispers of forgotten tech.' },
  { name: 'Narmis City', distance: 40, description: 'The Steel Jungle: Towering skyscrapers and hidden underground networks.' },
  { name: 'Shekharvati', distance: 30, description: 'The Sun-Kissed Valley: Rolling hills and forgotten mining tunnels.' },
  { name: 'Nuravgram', distance: 20, description: 'The Quirky Village: Talking robots and malfunctioning AI guardians.' }
];

export default function Home() {
  const router = useRouter();
  const ballsContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const createBalls = () => {
      const ballsContainer = ballsContainerRef.current;
      const ballCount = 25;

      while (ballsContainer.firstChild) {
        ballsContainer.removeChild(ballsContainer.firstChild);
      }

      for (let i = 0; i < ballCount; i++) {
        const ball = document.createElement('div');
        ball.className = styles.ball;
        ball.style.left = `${Math.random() * 100}%`;
        ball.style.top = `${Math.random() * 100}%`;
        ball.style.animationDuration = `${Math.random() * 8 + 4}s`;
        ball.style.animationDelay = `${Math.random() * 2}s`;
        ball.style.setProperty('--glow-color', `hsl(${Math.random() * 360}deg, 70%, 50%)`);
        ballsContainer.appendChild(ball);
      }
    };

    createBalls();
    const resizeListener = () => createBalls();
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  const generateCrypticHint = (fugitiveLocation) => {
    const hints = [
      `The fugitive's energy signature matches the solar-powered alleys.`,
      `Whispers of forgotten tech echo in the misty temples.`,
      `The hidden networks beneath the skyscrapers might hold the key.`,
      `The rolling hills hide secrets in their mining tunnels.`,
      `The malfunctioning AI guardians might have seen something.`
    ];

    return hints[Math.floor(Math.random() * hints.length)];
  };

  const startGame = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch('https://fugitive-game-backend.onrender.com/api/fugitive-location');
      if (!response.ok) throw new Error('Network response failed');

      const { fugitiveLocation } = await response.json();
      const hint = generateCrypticHint(fugitiveLocation);

      sessionStorage.setItem('cities', JSON.stringify(CITIES));
      sessionStorage.setItem('fugitiveLocation', JSON.stringify(fugitiveLocation));
      sessionStorage.setItem('hint', hint);
      sessionStorage.setItem('gameStartTime', new Date().toISOString());

      router.push('/city-selection');
    } catch (error) {
      console.error('Investigation failed:', error);
      alert('Surveillance systems offline. Try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.balls} ref={ballsContainerRef}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>Fugitive Hunt: Dark Pursuit</h1>
        <p className={styles.description}>
          A shadow operative has vanished into the grid. Track their digital residue across
          neon-lit cities before they initiate the Blackout Protocol.
        </p>
        <button
          className={`${styles.button} ${isLoading ? styles.loading : ''}`}
          onClick={startGame}
          disabled={isLoading}
        >
          {isLoading ? 'Initializing Detectives...' : 'Activate Pursuit Mode'}
        </button>
      </div>
    </div>
  );
}
