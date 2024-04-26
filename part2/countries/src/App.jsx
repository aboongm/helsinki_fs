import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [wind, setWind] = useState(null);
  const [icon, setIcon] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState(null);

  const api_key = import.meta.env.VITE_OP;

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const showCountry = (country) => {
    setSelectedCountry(country);
  };

  const renderedWeather = (country) => {
    console.log('country: ', country.latlng);
    const lat = country.latlng[0]
    const lon = country.latlng[1]
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
      )
      .then((response) => {
        const temperatureKelvin = response.data.main.temp;
        const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2); 
        setTemperature(temperatureCelsius)
        setIcon(response.data.weather[0].icon)
        setWeatherDescription(response.data.weather[0].description)
        setWind(response.data.wind.speed)
      });

      return (
        <>
          <div>temperature {temperature} Celcius</div>
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={weatherDescription}
            width={100}
            height={100}
          />
          <div>wind {wind} m/s</div>
        </>
      )
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        find countries:
        <input value={search} onChange={handleSearch} />
      </form>
      {search === "" ? null : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>capital: {filteredCountries[0].capital}</p>
          <p>area: {filteredCountries[0].area} sq. km</p>
          <ul>
            {Object.values(filteredCountries[0].languages).map(
              (language, index) => (
                <li key={index}>{language}</li>
              )
            )}
          </ul>
          <img
            src={filteredCountries[0].flags.svg}
            alt={filteredCountries[0].name.common}
            width={200}
            height={200}
          />
          <h1>Weather in {filteredCountries[0].capital}</h1>
          {renderedWeather(filteredCountries[0])}
        </div>
      ) : (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => showCountry(country)}>show</button>
              {selectedCountry.cca3 === country.cca3 && (
                <div>
                  <h2>{selectedCountry.name.common}</h2>
                  <p>capital: {selectedCountry.capital}</p>
                  <p>area: {selectedCountry.area} sq. km</p>
                  <ul>
                    {Object.values(selectedCountry.languages).map(
                      (language, index) => (
                        <li key={index}>{language}</li>
                      )
                    )}
                  </ul>
                  <img
                    src={selectedCountry.flags.svg}
                    alt={selectedCountry.name.common}
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
