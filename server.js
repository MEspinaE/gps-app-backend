const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const sequelize = require('./config/database');
const GpsPoint = require('./models/GpsPoint');

const app = express();
const port = 5000;

// Cargar las claves SSL
const privateKey = fs.readFileSync('localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('localhost.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use(cors());
app.use(bodyParser.json());

// Verificar conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión con la base de datos exitosa');
  })
  .catch(err => {
    console.error('No se pudo conectar con la base de datos:', err);
  });

// Rutas de la API
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de GPS');
});

// Rutas de GPS
app.get('/api/gps', async (req, res) => {
  try {
    const gpsPoints = await GpsPoint.findAll();
    res.json(gpsPoints);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los puntos GPS' });
  }
});

app.get('/api/gps-from-api', async (req, res) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=London&key=YOUR_GOOGLE_API_KEY');
    const gpsData = response.data.results.map(result => ({
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      sent_at: new Date(),
      phone_identifier: 'GoogleAPI'
    }));

    for (const point of gpsData) {
      await GpsPoint.create({
        latitude: point.latitude,
        longitude: point.longitude,
        sent_at: point.sent_at,
        phone_identifier: point.phone_identifier
      });
    }

    res.json(gpsData);
  } catch (err) {
    console.error('Error al obtener los puntos GPS de la API externa:', err);
    res.status(500).json({ error: 'Error al obtener los puntos GPS de la API externa' });
  }
});

// Crear nuevo punto GPS
app.post('/api/gps', async (req, res) => {
  const { latitude, longitude, sent_at, phone_identifier } = req.body;

  if (!latitude || !longitude || !sent_at || !phone_identifier) {
    return res.status(400).json({ error: 'Faltan parámetros necesarios' });
  }

  const sentAtDate = new Date(sent_at);
  if (isNaN(sentAtDate)) {
    return res.status(400).json({ error: 'Fecha inválida' });
  }

  try {
    const gpsPoint = await GpsPoint.create({
      latitude,
      longitude,
      sent_at: sentAtDate,
      phone_identifier
    });
    res.status(201).json({ message: 'Punto GPS guardado', gpsPoint });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el punto GPS' });
  }
});

// Iniciar el servidor HTTPS
https.createServer(credentials, app).listen(port, () => {
  console.log(`Servidor HTTPS escuchando en https://localhost:${port}`);
});
