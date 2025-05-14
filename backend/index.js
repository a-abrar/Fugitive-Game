require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const cities = [
  { name: 'Yapkashnagar', distance: 60 },
  { name: 'Lihaspur', distance: 50 },
  { name: 'Narmis City', distance: 40 },
  { name: 'Shekharvati', distance: 30 },
  { name: 'Nuravgram', distance: 20 }
];

const vehicles = [
  { kind: 'EV Bike', range: 60, count: 2 },
  { kind: 'EV Car', range: 100, count: 1 },
  { kind: 'EV SUV', range: 120, count: 1 }
];

// Generate tricky hint
const generateHint = (fugitiveCity) => {
  const otherCities = cities.filter(c => c.name !== fugitiveCity.name);
  const randomCity = otherCities[Math.floor(Math.random() * otherCities.length)];
  const difference = fugitiveCity.distance - randomCity.distance;
  
  return difference > 0 ?
    `The fugitive is hiding ${difference}km farther than ${randomCity.name}` :
    `The fugitive is hiding ${Math.abs(difference)}km closer than ${randomCity.name}`;
};

app.get('/api/fugitive-location', (req, res) => {
  try {
    const fugitiveIndex = Math.floor(Math.random() * cities.length);
    const fugitiveLocation = cities[fugitiveIndex];
    const hint = generateHint(fugitiveLocation);
    
    res.json({ fugitiveLocation, hint });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate fugitive location' });
  }
});

app.post('/api/capture-status', (req, res) => {
  try {
    const { copChoices } = req.body;
    const fugitiveLocation = req.headers['fugitive-location'] ? JSON.parse(req.headers['fugitive-location']) : null;

    if (!fugitiveLocation) {
      return res.status(400).json({ error: 'Fugitive location not provided' });
    }

    const result = copChoices.some(cop => {
      const vehicle = vehicles.find(v => v.kind === cop.vehicle);
      return cop.city === fugitiveLocation.name &&
             vehicle.range >= fugitiveLocation.distance * 2;
    });

    res.json({
      success: result,
      fugitiveLocation,
      message: result ?
        `Fugitive captured in ${fugitiveLocation.name}!` :
        `Fugitive escaped from ${fugitiveLocation.name}!`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process capture status' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));