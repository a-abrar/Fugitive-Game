'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './Result.module.css';

export default function Result() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const calculateResult = async () => {
      try {
        const fugitiveLocation = JSON.parse(sessionStorage.getItem('fugitiveLocation'));
        const citySelections = JSON.parse(sessionStorage.getItem('citySelections'));
        const vehicleSelections = JSON.parse(sessionStorage.getItem('vehicleSelections'));

        if (!fugitiveLocation || !citySelections || !vehicleSelections) {
          router.push('/');
          return;
        }

        const response = await fetch('https://fugitive-game-backend.onrender.com/api/capture-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'fugitive-location': JSON.stringify(fugitiveLocation)
          },
          body: JSON.stringify({ copChoices: vehicleSelections })
        });

        const data = await response.json();
        setResult({
          success: data.success,
          fugitiveLocation,
          selectedCities: citySelections,
          message: data.message
        });
      } catch (err) {
        setError('Failed to calculate results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    calculateResult();
  }, [router]);

  const restartGame = () => {
    sessionStorage.clear();
    router.push('/');
  };

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Investigation Result</h1>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Analyzing investigation data...</p>
        </div>
      ) : (
        <div className={styles.resultContent}>
          <div className={styles.resultVisual}>
            <Image
              src={result.success ? '/assets/images/criminal.png' : '/assets/images/criminal.png'}
              width={300}
              height={300}
              alt={result.success ? "Captured" : "Escaped"}
              className={styles.resultImage}
            />
            <div className={styles.resultDetails}>
              <h2 className={result.success ? styles.success : styles.failure}>
                {result.success ? 'CAPTURE SUCCESSFUL!' : 'FUGITIVE ESCAPED!'}
              </h2>
              <p>{result.message}</p>
              <div className={styles.cityComparison}>
                <div className={styles.cityList}>
                  <h3>Selected Cities:</h3>
                  {result.selectedCities.map((city, index) => (
                    <div
                      key={index}
                      className={`${styles.city} ${city === result.fugitiveLocation.name ? styles.correct : ''}`}
                    >
                      Detective {index + 1}: {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className={styles.restartButton} onClick={restartGame}>
            Start New Investigation
          </button>
        </div>
      )}
    </div>
  );
}
