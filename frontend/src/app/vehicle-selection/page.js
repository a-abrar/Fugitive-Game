'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './VehicleSelection.module.css';

const vehicles = [
  { kind: 'EV Bike', range: 60, count: 2, image: '/assets/images/ev-bike.png' },
  { kind: 'EV Car', range: 100, count: 1, image: '/assets/images/ev-car.png' },
  { kind: 'EV SUV', range: 120, count: 1, image: '/assets/images/ev-suv.png' }
];

export default function VehicleSelection() {
  const router = useRouter();
  const [selections, setSelections] = useState(Array(3).fill(null));
  const [availableVehicles, setAvailableVehicles] = useState(vehicles.map(v => ({ ...v })));
  const [cityData, setCityData] = useState([]);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    const savedCities = JSON.parse(sessionStorage.getItem('citySelections'));
    const storedCities = JSON.parse(sessionStorage.getItem('cities'));
    const gameStartTime = sessionStorage.getItem('gameStartTime');

    if (!savedCities || !storedCities || !gameStartTime) {
      router.push('/');
      return;
    }

    const fullCityData = savedCities.map(cityName =>
      storedCities.find(c => c.name === cityName)
    );
    setCityData(fullCityData);

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
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSelect = (copIndex, vehicleKind) => {
    const newSelections = [...selections];
    const previousVehicle = newSelections[copIndex];
    newSelections[copIndex] = vehicleKind;

    const updatedVehicles = availableVehicles.map(vehicle => {
      if (vehicle.kind === previousVehicle) {
        return { ...vehicle, count: vehicle.count + 1 };
      }
      if (vehicle.kind === vehicleKind) {
        return { ...vehicle, count: vehicle.count - 1 };
      }
      return vehicle;
    });

    setSelections(newSelections);
    setAvailableVehicles(updatedVehicles);
    setError('');

    const currentCity = cityData[copIndex];
    const vehicleData = vehicles.find(v => v.kind === vehicleKind);

    if (vehicleData && currentCity && vehicleData.range < currentCity.distance * 2) {
      setError(`Warning: The fugitive might escape if you choose this vehicle for ${currentCity.name}.`);
    }
  };

  const validateSelections = () => {
    const errors = [];

    if (selections.some(vehicle => !vehicle)) {
      errors.push('All detectives must select a vehicle');
    }

    const invalidRange = selections.some((vehicle, index) => {
      if (!vehicle) return false;
      const vehicleData = vehicles.find(v => v.kind === vehicle);
      return vehicleData.range < cityData[index]?.distance * 2;
    });

    if (invalidRange) {
      errors.push('Some vehicles cannot make the round trip');
    }

    if (errors.length > 0) {
      setError(errors.join(' | '));
      return false;
    }
    return true;
  };

  const proceedToResults = () => {
    if (!validateSelections()) return;

    const vehicleSelections = selections.map((vehicle, index) => ({
      vehicle,
      range: vehicles.find(v => v.kind === vehicle)?.range || 0,
      city: cityData[index]?.name || ''
    }));

    sessionStorage.setItem('vehicleSelections', JSON.stringify(vehicleSelections));
    router.push('/result');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Vehicle Assignment</h1>
      <p className={styles.subtitle}>Choose vehicles that can reach the city and return</p>
      <p className={styles.timer}>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</p>

      <div className={styles.grid}>
        {selections.map((selectedVehicle, copIndex) => {
          const currentCity = cityData[copIndex];
          const vehicleData = vehicles.find(v => v.kind === selectedVehicle);

          return (
            <div key={copIndex} className={styles.card}>
              <div className={styles.copHeader}>
                <Image
                  src={`/assets/images/cop${copIndex+1}.png`}
                  width={120}
                  height={120}
                  alt={`Detective ${copIndex+1}`}
                  className={styles.copImage}
                />
                <div className={styles.copInfo}>
                  <h3>Detective #{copIndex + 1}</h3>
                  {currentCity && (
                    <>
                      <p>📍 {currentCity.name}</p>
                      <p>🚩 Distance: {currentCity.distance}km</p>
                      <p>🔁 Required Range: {currentCity.distance * 2}km</p>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.selectContainer}>
                <select
                  value={selectedVehicle || ''}
                  onChange={(e) => handleSelect(copIndex, e.target.value)}
                  className={styles.select}
                  disabled={!currentCity}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option
                      key={vehicle.kind}
                      value={vehicle.kind}
                      disabled={availableVehicles.find(v => v.kind === vehicle.kind).count === 0}
                    >
                      {vehicle.kind} ({vehicle.range}km) -
                      Available: {availableVehicles.find(v => v.kind === vehicle.kind).count}
                    </option>
                  ))}
                </select>
                <div className={styles.selectArrow}></div>
              </div>

              {selectedVehicle && currentCity && (
                <div className={styles.vehiclePreview}>
                  <div className={styles.rangeComparison}>
                    <span>Required: {currentCity.distance * 2}km</span>
                    <span>Vehicle: {vehicleData.range}km</span>
                  </div>
                  <div className={styles.rangeIndicator}>
                    <div
                      className={styles.rangeBar}
                      style={{
                        width: `${Math.min(vehicleData.range / (currentCity.distance * 2)) * 100}%`,
                        backgroundColor: vehicleData.range >= currentCity.distance * 2
                          ? '#4facfe'
                          : '#ff6b6b'
                      }}
                    />
                  </div>
                  <Image
                    src={vehicleData.image}
                    alt={selectedVehicle}
                    width={300}
                    height={200}
                    className={styles.vehicleImage}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <div className={styles.error}>⚠️ {error}</div>}

      <button
        className={styles.proceedButton}
        onClick={proceedToResults}
        disabled={selections.some(vehicle => !vehicle)}
      >
        Launch Investigation
      </button>
    </div>
  );
}
