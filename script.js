function displayPreview(data) {
    const weatherContainer = document.querySelector('#weatherContainer');
    weatherContainer.innerHTML = ''; // Vide le contenu existant

    const newWeatherCard = document.createElement('div');
    newWeatherCard.classList.add('weather-card');

    // Utiliser flexbox pour aligner les éléments sur une seule ligne
    newWeatherCard.style.display = 'inline-flex';
    newWeatherCard.style.alignItems = 'center';

    newWeatherCard.innerHTML = `
        <div class="weather-info">
            <div>${new Date(data.dt * 1000).toLocaleString()}</div>
            <div>${data.name}</div>
            <div>
                <i class="wi wi-owm-${data.weather[0].id}"></i>
                <span>${data.weather[0].description}</span>
            </div>
            <div>${Math.round(data.main.temp - 273.15)}°C</div>
        </div>
    `;
    newWeatherCard.addEventListener('click', () => displayMoreInfo(data, newWeatherCard));
    weatherContainer.appendChild(newWeatherCard);
}

function displayMoreInfo(data, row) {
    // Vérifier si les informations détaillées sont déjà affichées
    const detailContainer = document.querySelector('.detail-container');

    if (detailContainer) {
        // Si les informations détaillées sont déjà affichées, les supprimer
        detailContainer.remove();
        row.classList.remove('active-row');
    } else {
        // S'il n'y a pas de détails affichés, créer la structure et les afficher
        const activeRow = document.querySelector('.active-row');
        if (activeRow) {
            activeRow.classList.remove('active-row');
        }
        row.classList.add('active-row');

        const container = document.querySelector('.container');
        const newDetailContainer = document.createElement('div');
        newDetailContainer.classList.add('detail-container');
        newDetailContainer.innerHTML = `
            <div class="detail-column">
                <div>
                    <span>Ressenti: ${Math.round(data.main.feels_like - 273.15)}°C</span>
                </div>
                <div>
                    <span>Pression: ${data.main.pressure} hPa</span>
                </div>
                <div>
                    <span>Humidité: ${data.main.humidity}%</span>
                </div>
            </div>
            <div class="detail-column">
                <div>
                    <span>Levé du soleil: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</span>
                </div>
                <div>
                    <span>Couché du soleil: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</span>
                </div>
            </div>
            <div class="detail-column">
                <div>
                    <span>Vitesse du vent: ${data.wind.speed} m/s</span>
                </div>
                <div>
                    <span>Direction du vent: ${data.wind.deg}°</span>
                </div>
                <div>
                    <span>Visibilité: ${data.visibility / 1000} km</span>
                </div>
            </div>
            <div class="plus-infos">
                <span>Plus d'informations sur <a href="https://openweathermap.org/city/${data.id}" target="_blank">${data.name}</a></span>
            </div>
        `;

        // Insérer les détails après le conteneur
        container.appendChild(newDetailContainer);
    }
}


function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'ee07e2bf337034f905cde0bdedae3db8';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            resetWeatherDisplay(); // Réinitialiser l'affichage avant d'afficher de nouvelles prévisions
            displayWeather(data); // Afficher les informations de base
        })
        .catch(error => {
            console.log('Erreur:', error);
        });
}

function resetWeatherDisplay() {
    const activeRow = document.querySelector('.active-row');
    if (activeRow) {
        activeRow.classList.remove('active-row'); // Retirer la classe active pour replier les informations détaillées
        const detailContainer = document.querySelector('.detail-container');
        if (detailContainer) {
            detailContainer.remove(); // Supprimer les informations détaillées
        }
    }
}

function displayWeather(data) {
    displayPreview(data); // Afficher l'aperçu
}


// -------------------------------------------- //
// Event listeners

document.getElementById('cityInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Ajouter un événement de clic au bouton localisation
function getLocation() {
    // Demander la géolocalisation de l'utilisateur
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            // Récupérer les coordonnées de la position actuelle
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiKey = 'ee07e2bf337034f905cde0bdedae3db8';

            // Utiliser les coordonnées pour obtenir la ville via une API de géocodage
            fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    // Extraire le nom de la ville à partir des données de l'API
                    const cityName = data[0].name;
                    // Remplir l'input avec le nom de la ville
                    document.getElementById('cityInput').value = cityName;
                })
                .catch(error => {
                    console.log('Erreur:', error);
                });
        }, error => {
            console.error('Erreur de géolocalisation:', error);
        });
    } else {
        console.log('La géolocalisation n\'est pas prise en charge par votre navigateur.');
    }
}
