import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState("")

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        find countries:
        <input
          value={search}
          onChange={handleSearch}
        />
      </form>
      {search === "" ? null :  filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>capital: {filteredCountries[0].capital}</p>
          <p>area: {filteredCountries[0].area} sq. km</p>
          <ul>
            {Object.values(filteredCountries[0].languages).map((language, index) => (
              <li key={index}>{language}</li>  
            ))}
          </ul>
          <img src={filteredCountries[0].flags.svg} alt={filteredCountries[0].name.common} />
        </div>
      ) : (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => showCountry(country)}>show</button>
              {selectedCountry.cca3 === country.cca3 && (
                <div>
                  <h2>{selectedCountry.name.common}</h2>
                  <p>capital: {selectedCountry.capital}</p>
                  <p>area: {selectedCountry.area} sq. km</p>
                  <ul>
                    {Object.values(selectedCountry.languages).map((language, index) => (
                      <li key={index}>{language}</li>  
                    ))}
                  </ul>
                  <img src={selectedCountry.flags.svg} alt={selectedCountry.name.common} />
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
