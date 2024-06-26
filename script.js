document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const city = prompt("Enter city name:");
    const weatherApiKey = '8d8e1cfb167326e92308c17a092885de';
    const pixabayApiKey = '44539755-5bf4719ec0cabfe122acd2fb1'; 

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    const pixabayUrl = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${city}&image_type=photo&orientation=horizontal`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('city').innerText = data.name;
                document.getElementById('description').innerText = data.weather[0].description;
                document.getElementById('temperature').innerText = `${data.main.temp.toFixed(2)}°`;
                document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                document.getElementById('real-feel').innerText = `${data.main.feels_like.toFixed(2)}°`;
                document.getElementById('wind-speed').innerText = `${data.wind.speed.toFixed(2)} km/h`;
                document.getElementById('chance-of-rain').innerText = `--%`;
                document.getElementById('uv-index').innerText = `--`;

                // Fetch 5-day forecast
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`;
                return fetch(forecastUrl);
            } else {
                throw new Error('City not found');
            }
        })
        .then(response => response.json())
        .then(data => {
            const forecastElement = document.getElementById('forecast');
            forecastElement.innerHTML = ''; // Clear previous forecast

            for (let i = 0; i < data.list.length; i += 8) {
                const forecastData = data.list[i];
                const forecastItem = document.createElement('div');
                forecastItem.className = 'forecast';

                const time = new Date(forecastData.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                forecastItem.innerHTML = `
                    <p>${time}</p>
                    <img src="http://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" alt="Weather Icon">
                    <p>${forecastData.main.temp.toFixed(2)}°</p>
                `;
                forecastElement.appendChild(forecastItem);
            }

            // Fetch city image from Pixabay
            return fetch(pixabayUrl);
        })
        .then(response => response.json())
        .then(data => {
            if (data.hits && data.hits.length > 0) {
                const imageUrl = data.hits[0].largeImageURL;
                document.body.style.backgroundImage = `url(${imageUrl})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
            } else {
                throw new Error('No images found for the city');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch data. Please try again.');
        });
});
