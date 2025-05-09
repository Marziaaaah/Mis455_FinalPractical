document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const countryInput = document.getElementById('countryInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('results');

    // Event Listeners
    searchBtn.addEventListener('click', () => {
        fetchCountryData(countryInput.value);
    });

    countryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchCountryData(countryInput.value);
        }
    });

    // Focus input field on page load with a slight delay
    setTimeout(() => {
        countryInput.focus();
    }, 500);

    /**
     * Fetches country data from the REST Countries API
     * @param {string} countryName - The name of the country to search for
     */
    async function fetchCountryData(countryName) {
        // Input validation
        if (!countryName.trim()) {
            displayError('Please enter a country name');
            return;
        }

        // Show loading state
        displayLoading();

        try {
            // Make API request
            const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);

            // Check for successful response
            if (!response.ok) {
                throw new Error(`Country not found. Please check the spelling and try again. (Status: ${response.status})`);
            }

            // Parse response data
            const data = await response.json();

            // If no data returned
            if (!data || data.length === 0) {
                throw new Error('No countries found matching your search.');
            }

            // Display the results
            displayCountries(data);

        } catch (error) {
            // Handle errors
            displayError(error.message);
        }
    }

    /**
     * Displays country information in cards
     * @param {Array} countries - Array of country objects from the API
     */
    function displayCountries(countries) {
        // Clear previous results
        resultsContainer.innerHTML = '';

        // Create elements for each country
        countries.forEach(country => {
            // Extract required data with fallbacks for missing data
            const name = country.name.common || 'N/A';
            const officialName = country.name.official || 'N/A';
            const capital = country.capital ? country.capital.join(', ') : 'N/A';
            const flagUrl = country.flags?.svg || country.flags?.png || '';
            const flagAlt = country.flags?.alt || `Flag of ${name}`;

            // Get currency information
            let currencyText = 'N/A';
            if (country.currencies) {
                const currencies = Object.values(country.currencies).map(currency =>
                    `${currency.name} (${currency.symbol || 'N/A'})`
                ).join(', ');
                currencyText = currencies || 'N/A';
            }

            // Additional information with fallbacks
            const region = country.region || 'N/A';
            const subregion = country.subregion || '';
            const population = country.population ? formatNumber(country.population) : 'N/A';
            const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
            const area = country.area ? `${formatNumber(country.area)} km²` : 'N/A';
            const timezones = country.timezones ? country.timezones.join(', ') : 'N/A';
            const drivingSide = country.car?.side ? capitalizeFirstLetter(country.car.side) : 'N/A';
            const continent = country.continents ? country.continents.join(', ') : 'N/A';

            // Create country card element
            const countryCard = document.createElement('div');
            countryCard.className = 'country-card';

            // Add HTML content to the card
            countryCard.innerHTML = `
                <div class="flag-container">
                    <img src="${flagUrl}" alt="${flagAlt}" loading="lazy">
                </div>
                <div class="country-info">
                    <h2>${name}</h2>
                    <div class="info-grid">
                        <span class="info-label">Official Name:</span>
                        <span class="info-value">${officialName}</span>
                        
                        <span class="info-label">Capital:</span>
                        <span class="info-value">${capital}</span>
                        
                        <span class="info-label">Currency:</span>
                        <span class="info-value">${currencyText}</span>
                        
                        <span class="info-label">Region:</span>
                        <span class="info-value">${region} ${subregion ? `<span class="badge">${subregion}</span>` : ''}</span>
                        
                        <span class="info-label">Continent:</span>
                        <span class="info-value">${continent}</span>
                        
                        <span class="info-label">Population:</span>
                        <span class="info-value">${population}</span>
                        
                        <span class="info-label">Languages:</span>
                        <span class="info-value">${languages}</span>
                        
                        <span class="info-label">Area:</span>
                        <span class="info-value">${area}</span>
                        
                        <span class="info-label">Driving Side:</span>
                        <span class="info-value">${drivingSide}</span>
                    </div>
                </div>
            `;

            // Add the card to the results container
            resultsContainer.appendChild(countryCard);
        });
    }

    /**
     * Displays an error message
     * @param {string} message - The error message to display
     */
    function displayError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Displays a loading indicator
     */
    function displayLoading() {
        resultsContainer.innerHTML = `
            <div class="loading">
                <p>Searching for country data...</p>
            </div>
        `;
    }

    /**
     * Formats a number with thousands separators
     * @param {number} num - The number to format
     * @returns {string} The formatted number
     */
    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    /**
     * Capitalizes the first letter of a string
     * @param {string} str - The string to capitalize
     * @returns {string} The capitalized string
     */
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});