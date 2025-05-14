'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './CitySelection.module.css';

const cities = [
  { name: 'Yapkashnagar', distance: 60, image: '/assets/images/yapkashnagar.png', description: 'The Neon Oasis: Glowing alleys and rooftop races, powered by solar energy.' },
  { name: 'Lihaspur', distance: 50, image: '/assets/images/lihaspur.png', description: 'The Misty Labyrinth: Ancient temples shrouded in fog, whispers of forgotten tech.' },
  { name: 'Narmis City', distance: 40, image: '/assets/images/narmis-city.png', description: 'The Steel Jungle: Towering skyscrapers and hidden underground networks.' },
  { name: 'Shekharvati', distance: 30, image: '/assets/images/shekharvati.png', description: 'The Sun-Kissed Valley: Rolling hills and forgotten mining tunnels.' },
  { name: 'Nuravgram', distance: 20, image: '/assets/images/nuravgram.png', description: 'The Quirky Village: Talking robots and malfunctioning AI guardians.' }
];

export default function CitySelection() {
  const router = useRouter();
  const [selections, setSelections] = useState(Array(3).fill(null));
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [hint, setHint] = useState('');

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      const gameStartTime = sessionStorage.getItem('gameStartTime');
      if (!gameStartTime) {
        sessionStorage.setItem('gameStartTime', new Date().toISOString());
      }

      const startTime = new Date(gameStartTime);
      const currentTime = new Date();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      setTimeLeft(120 - elapsedTime);

      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            alert('Time is up! The fugitive has escaped.');
            router.push('/');
            return 0;
          }
          if (prevTime <= 30) {
            alert('Hurry! The fugitive is about to escape!');
          }
          return prevTime - 1;
        });
      }, 1000);

      const hint = sessionStorage.getItem('hint');
      setHint(hint || '');

      return () => clearInterval(timer);
    }
  }, [router]);

  const handleSelect = (copIndex, cityName) => {
    const newSelections = [...selections];
    newSelections[copIndex] = cityName;
    setSelections(newSelections);
    setError('');
  };

  const validateSelections = () => {
    const selectedCities = selections.filter(city => city !== null);

    if (selectedCities.length !== 3) {
      setError('All detectives must select a city');
      return false;
    }

    if (new Set(selectedCities).size !== 3) {
      setError('Each detective needs a unique city');
      return false;
    }

    return true;
  };

  const proceedToVehicles = () => {
    if (!validateSelections()) return;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('citySelections', JSON.stringify(selections));
    }
    router.push('/vehicle-selection');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Assign Cities</h1>
      <p className={styles.timer}>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</p>

      <div className={styles.hintBox}>
        <div className={styles.hintIcon}>🕵️♂️</div>
        <p className={styles.hintText}>{hint}</p>
      </div>

      <div className={styles.detectivesGrid}>
        {selections.map((selectedCity, index) => (
          <div key={index} className={styles.detectiveCard}>
            <div className={styles.detectiveHeader}>
              <Image
                src={`/assets/images/cop${index+1}.png`}
                width={80}
                height={80}
                alt={`Detective ${index+1}`}
                className={styles.avatar}
              />
              <h3>Detective #{index + 1}</h3>
            </div>

            <div className={styles.selectWrapper}>
              <select
                value={selectedCity || ''}
                onChange={(e) => handleSelect(index, e.target.value)}
                className={styles.select}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option
                    key={city.name}
                    value={city.name}
                    disabled={selections.includes(city.name) && selectedCity !== city.name}
                  >
                    {city.name} ({city.distance}km)
                  </option>
                ))}
              </select>
              <div className={styles.selectArrow}>▼</div>
            </div>

            {selectedCity && (
              <div className={styles.cityPreview}>
                <Image
                  src={cities.find(c => c.name === selectedCity).image}
                  alt={selectedCity}
                  width={300}
                  height={200}
                  className={styles.cityImage}
                />
                <div className={styles.cityInfo}>
                  <span>{selectedCity}</span>
                  <span>{cities.find(c => c.name === selectedCity).distance}km from HQ</span>
                  <p>{cities.find(c => c.name === selectedCity).description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button
        className={styles.proceedButton}
        onClick={proceedToVehicles}
        disabled={selections.some(city => !city)}
      >
        Confirm Cities
      </button>
    </div>
  );
}
