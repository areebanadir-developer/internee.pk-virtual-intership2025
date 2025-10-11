 const API_KEY = "a9d963a9f4658f299bf8d0b94f6ab688";

  
    const BACKGROUNDS = {
      Clear: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1600&q=60',
      Clouds: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=60',
      Rain: 'https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1600&q=60',
      Drizzle: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=60',
      Thunderstorm: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1600&q=60',
      Snow: 'https://images.unsplash.com/photo-1600379684406-2e8b6a7a4d9b?auto=format&fit=crop&w=1600&q=60',
      Mist: 'https://images.unsplash.com/photo-1505483531331-2b3a1b0f5b7d?auto=format&fit=crop&w=1600&q=60',
      Smoke: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=60',
      Haze: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=60',
      Default: 'https://images.unsplash.com/photo-1517817748499-2b3d0e014f3b?auto=format&fit=crop&w=1600&q=60'
    };

    const ICON_MAP = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️',
      Smoke: '💨',
      Haze: '🌫️',
      Fog: '🌫️',
      Default: '🌈'
    };

    const form = document.getElementById('cityForm');
    const cityInput = document.getElementById('city');
    const searchBtn = document.getElementById('searchBtn');
    const geoBtn = document.getElementById('geoBtn');
    const status = document.getElementById('status');
    const message = document.getElementById('message');
    const result = document.getElementById('result');
    const iconEl = document.getElementById('icon');
    const tempEl = document.getElementById('temp');
    const descEl = document.getElementById('description');
    const humidityEl = document.getElementById('humidity');
    const windEl = document.getElementById('wind');
    const bg = document.getElementById('bg');

    function setStatus(text, withLoader = false) {
      status.innerHTML = withLoader ? `<span class="loader" aria-hidden="true"></span> ${text}` : text;
    }

    function setMessage(text, type = '') {
      message.className = 'message' + (type ? ' ' + type : '');
      message.textContent = text;
    }

    function chooseBackground(main) {
      if (!main) return BACKGROUNDS.Default;
      return BACKGROUNDS[main] || BACKGROUNDS.Default;
    }

    function chooseIcon(main) {
      return ICON_MAP[main] || ICON_MAP.Default;
    }

    function showWeather(data) {
      if (!data || !data.main) return;
      result.classList.add('visible');

      const temp = data.main.temp;
      const desc = (data.weather && data.weather[0] && data.weather[0].description) ? data.weather[0].description : '—';
      const main = (data.weather && data.weather[0] && data.weather[0].main) ? data.weather[0].main : null;
      const humidity = data.main.humidity;
      const wind = (data.wind && typeof data.wind.speed !== 'undefined') ? data.wind.speed : '—';

      iconEl.textContent = chooseIcon(main);
      tempEl.textContent = `${Math.round(temp)} °C`;
      descEl.textContent = desc[0].toUpperCase() + desc.slice(1);
      humidityEl.textContent = `Humidity: ${humidity}%`;
      windEl.textContent = `Wind: ${wind} m/s`;

      const bgUrl = chooseBackground(main);
      bg.style.backgroundImage = `linear-gradient(rgba(4,4,4,0.25), rgba(4,4,4,0.25)), url('${bgUrl}')`;

      setMessage('Successfully loaded weather data.', 'success');
    }

    function clearUI() {
      result.classList.remove('visible');
      setMessage('');
      status.textContent = '';
    }

    function buildCityUrl(city) {
      const q = encodeURIComponent(city.trim());
      return `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${API_KEY}`;
    }
    
    function buildCoordUrl(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    }

    async function fetchWeather(url) {
      if (!API_KEY || API_KEY === '') {
        setMessage('Add your OpenWeatherMap API key into the script (API_KEY).', 'error');
        throw new Error('Missing API key');
      }

      setStatus('Fetching weather...', true);
      setMessage('');
      try {
        const res = await fetch(url);
        if (!res.ok) {
          let errText = `HTTP ${res.status}`;
          try {
            const errJson = await res.json();
            if (errJson && errJson.message) errText = errJson.message;
          } catch (e) { /* ignore */ }
          throw new Error(errText);
        }
        const data = await res.json();
        setStatus('');
        return data;
      } catch (err) {
        setStatus('');
        throw err;
      }
    }

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      clearUI();

      const city = cityInput.value.trim();
      if (!city) {
        setMessage('Please enter a city name.', 'error');
        cityInput.focus();
        return;
      }

      try {
        const data = await fetchWeather(buildCityUrl(city));
        showWeather(data);
      } catch (err) {
        setMessage(`Could not load weather: ${err.message}`, 'error');
      }
    });

    
    geoBtn.addEventListener('click', async () => {
      clearUI();
      if (!navigator.geolocation) {
        setMessage('Geolocation is not supported by your browser.', 'error');
        return;
      }

      setStatus('Locating…', true);
      setMessage('');
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus('Fetching weather for your location...', true);
        try {
          const data = await fetchWeather(buildCoordUrl(latitude, longitude));
          setStatus('');
          showWeather(data);
        } catch (err) {
          setMessage(`Could not load weather: ${err.message}`, 'error');
        }
      }, (err) => {
        setStatus('');
        if (err.code === 1) {
          setMessage('Permission denied. Allow location to use this feature.', 'error');
        } else {
          setMessage('Could not get your location: ' + (err.message || 'unknown error'), 'error');
        }
      }, {
        enableHighAccuracy: false,
        timeout: 10000
      });
    });

    
    cityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { /* handled by form submit */ }
    });

    setMessage('Tip: try "Karachi" or "London". For geolocation use the "Use my location" button.');