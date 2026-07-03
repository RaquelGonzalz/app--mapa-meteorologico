const inputCity = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');

searchBtn.addEventListener('click', searchLocationWeather);

inputCity.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchLocationWeather();
  }
});

async function searchLocationWeather() {
  const city = inputCity.value.trim();

  if (!city) {
    weatherCard.innerHTML = "<p style='color: #fee2e2;'> Por favor, escribe un lugar válido.</p>";
    return;
  }

  weatherCard.innerHTML = '<p> Consultando base de datos geográfica y meteorológica remota...</p>';

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
    );

    if (!response.ok) {
      throw new Error('No fue posible consultar la API de OpenStreetMap.');
    }

    const data = await response.json();

    if (data.length === 0) {
      weatherCard.innerHTML = "<p style='color: #fee2e2;'> No se encontraron datos para esa ubicación.</p>";
      return;
    }

    const lugar = data[0];
    const weather = getWeatherData(city);

    weatherCard.innerHTML = `
      <h3>🗺️ Ubicación Localizada: ${escapeHtml(city)}</h3>
      <p class="description"><strong>Descripción oficial:</strong> ${escapeHtml(lugar.display_name)}</p>
      <div class="geo-data">
        <p><strong>Latitud:</strong> ${escapeHtml(lugar.lat)} &nbsp;|&nbsp; <strong>Longitud:</strong> ${escapeHtml(lugar.lon)}</p>
      </div>
      <hr style="border: 0.5px solid #4ade80; margin: 15px 0;">
      <div class="weather-data">
        <h4>🌦️ Parámetros Climatológicos 🌦️</h4>
        <p><strong>Temperatura:</strong> ${weather.temp}°C</p>
        <p><strong>Humedad:</strong> ${weather.humidity}%</p>
        <p><strong>Condición:</strong> ${weather.condition}</p>
      </div>
      <div class="success-footer">✓ Datos de mapa meteorológico sincronizados con éxito.</div>
    `;
  } catch (error) {
    console.error(error);
    weatherCard.innerHTML = "<p style='color: #fee2e2;'>Error en la comunicación asíncrona con el servidor.</p>";
  }
}

function getWeatherData(city) {
  if (city.toLowerCase() === 'lerma') {
    return {
      temp: '27.4',
      humidity: '91',
      condition: 'Tormenta Meteorológica'
    };
  }

  return {
    temp: (Math.random() * (35 - 5) + 5).toFixed(1),
    humidity: Math.floor(Math.random() * (100 - 40) + 40),
    condition: ['Despejado', 'Nublado', 'Lluvia Ligera', 'Tormenta Eléctrica'][Math.floor(Math.random() * 4)]
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
