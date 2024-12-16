import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { getWeatherIcon } from '../utils/weatherIcons';  // Ensure you have this function correctly implemented

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);  // Array to store weather data for all cities
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');  // To hold the city name
  const [suggestions, setSuggestions] = useState([]); // For city suggestions
  const [loadingSuggestions, setLoadingSuggestions] = useState(false); // For suggestion loading state

  const apiKey = '10d7d686087b6518358edcc5a6221d22'; 

  // Function to fetch weather data based on city name
  const fetchWeatherData = (cityName) => {
    setLoading(true);
    setError(null);
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
      .then((response) => {
        const newCityData = response.data;

        // Check if the city is already in the weatherData array (case insensitive)
        const cityExists = weatherData.some((city) => city.name.toLowerCase() === newCityData.name.toLowerCase());

        if (!cityExists) {
          // Add the new city data to the weatherData array
          setWeatherData((prevData) => {
            const newData = [...prevData, newCityData]; // Add new data to the end

            // Ensure there are no more than 4 cards by removing the first card if needed
            if (newData.length > 4) {
              newData.shift(); // Remove the oldest city (the first city in the array)
            }

            return newData;
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching weather data');
        setLoading(false);
      });
  };

  // Function to fetch city suggestions from OpenWeather API
  const fetchCitySuggestions = (query) => {
    if (query.trim()) {
      setLoadingSuggestions(true);
      axios
        .get(`https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}`)
        .then((response) => {
          setSuggestions(response.data.list);
          setLoadingSuggestions(false);
        })
        .catch((err) => {
          setSuggestions([]);
          setLoadingSuggestions(false);
        });
    } else {
      setSuggestions([]);
    }
  };

  // Use useEffect to fetch data for default cities (Chennai, Mumbai, Kolkata)
  useEffect(() => {
    const defaultCities = ['Chennai', 'Mumbai', 'Kolkata'];
    setLoading(true); // Start loading before fetching the default data
    Promise.all(
      defaultCities.map((city) =>
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      )
    )
      .then((responses) => {
        const newWeatherData = responses.map((response) => response.data);
        setWeatherData(newWeatherData);  // Set initial data for default cities
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching default weather data');
        setLoading(false);
      });
  }, []);
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  
  const handleSearch = (cityName) => {
    setCity(''); // Clear input after search
    setSuggestions([]); // Clear suggestions
    fetchWeatherData(cityName); // Fetch weather data for searched city
  };

  const handleSelectSuggestion = (suggestion) => {
    setCity(suggestion.name); // Set the city name to input field
    setSuggestions([]); // Clear the suggestions list
    fetchWeatherData(suggestion.name); // Fetch weather data for the selected city
  };

  if (loading) {
    return (
      <View >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }
  

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter city"
          value={city}
          onChangeText={(text) => {
            setCity(text);
            fetchCitySuggestions(text); // Fetch suggestions as user types
          }}
        />
        <TouchableOpacity onPress={() => handleSearch(city)} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && !loadingSuggestions && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => `${item.id}-${item.name}-${item.sys.country}-${item.coord.lon}`} // Adding lon or lat for uniqueness
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)} style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>
                {item.name}, {item.sys.country}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      {/* Weather Cards for the Cities */}
      <FlatList
  data={weatherData.slice().reverse()} // Reverse the array before rendering
  keyExtractor={(item) => item.name}
  renderItem={({ item }) => {
    const { main, weather, name } = item;
    const temperature = main?.temp;
    const description = weather?.[0]?.description;

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Text style={styles.city}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.temp}>{temperature}°C</Text>
          {getWeatherIcon(description, styles.icon)}
        </View>
      </View>
    );
  }}
  contentContainerStyle={styles.weatherListContainer}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 35,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 5,
  },
  searchInput: {
    width: 250,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#3F508D',
    padding: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    width: 329,
    height: 134,
    padding: 10,
    backgroundColor: '#3F508D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 20,
    color: '#fff',
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  icon: {
    width: 48,
    height: 48,
  },
  suggestionsList: {
    position: 'absolute',
    top: 70, // Adjust based on your UI
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
  },
  weatherListContainer: {
    paddingBottom: 20,  // Add some space at the bottom
  },

  // New styles for the loading screen
  loadingText: {
    color: '#ffffff',  // Make text white
    fontSize: 18,
    marginTop: 10,  // Space between the indicator and the text
  },
  errorText: {
    color: '#ffffff',  // White text
    fontSize: 20,
    textAlign: 'center',
    top:'50%'
  },
});

export default Weather;
