import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; 
import CurrentLoc from '../utils/currentLoc';

// Get device dimensions
const { width, height } = Dimensions.get('window'); // Screen width and height

const Map = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);  // Location will initially be null
  const [marker, setMarker] = useState(null); // State to store the marker's position
  const [locationError, setLocationError] = useState(null); // Error state for location
  const [isLoadingWeather, setIsLoadingWeather] = useState(false); // To track weather data fetching status
  const [isLocationLoading, setIsLocationLoading] = useState(true); // To track if location is still being fetched

  const apiKey = '10d7d686087b6518358edcc5a6221d22';

  const handleLocationFetched = (latitude, longitude) => {
    setLocation({ latitude, longitude });
    setMarker({ latitude, longitude }); // Set marker at current location
    setIsLocationLoading(false); // Location has been successfully fetched
  };

  // Handle location fetch error
  const handleLocationError = (error) => {
    setLocationError('Unable to fetch location. Please enable location services.');
    setIsLocationLoading(false); // Stop the loading indicator
  };

  // Fetch weather data whenever the marker is placed
  useEffect(() => {
    if (marker) {
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${marker.latitude}&lon=${marker.longitude}&appid=${apiKey}&units=metric`;
      
      const fetchWeatherData = async () => {
        setIsLoadingWeather(true); // Start loading weather data
        try {
          const response = await fetch(weatherApiUrl);
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        } finally {
          setIsLoadingWeather(false); // Stop loading after fetching data
        }
      };

      fetchWeatherData();
    }
  }, [marker]); // This effect runs when the marker position changes

  const handleMapPress = (event) => {
    // Get the coordinates where the user tapped
    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Set the marker position
    setMarker({ latitude, longitude });

    // Clear previous weather data
    setWeatherData(null);
  };

  return (
    <View style={styles.container}>
      <CurrentLoc 
        onLocationFetched={handleLocationFetched}
        onLocationError={handleLocationError}
      />

      {/* Map View */}
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress} // Handle tap event on the map
        >
          {marker && (
            <Marker
              coordinate={marker}
              title={`Weather in this location`}
              description={
                isLoadingWeather
                  ? 'Fetching weather data...'
                  : weatherData
                  ? `Temperature: ${weatherData.main.temp}°C\n${weatherData.weather[0].description}`
                  : 'No weather data available'
              }
            />
          )}
        </MapView>
      ) : (
        // If location is not available, show a loading indicator and message
        <View style={styles.loadingContainer}>
          {isLocationLoading ? (
            <View>
              <Text style={styles.loadingText}>Please wait while we fetch your location...</Text>
              <Text style={styles.loadingText}>Please ensure that location services are enabled.</Text>
            </View>
          ) : (
            <Text style={styles.loadingText}>Location is unavailable. Please enable location services.</Text>
          )}

          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Location Error Message */}
      {locationError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}

      {/* Weather Information */}
      {weatherData && marker && !isLoadingWeather && (
        <View style={styles.weatherInfo}>
          <Text style={styles.title}>Weather Information</Text>
          <Text>{`Location: ${weatherData.name}`}</Text>
          <Text>{`Temperature: ${weatherData.main.temp}°C`}</Text>
          <Text>{`Condition: ${weatherData.weather[0].description}`}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
  map: {
    flex: 1,
  },
  weatherInfo: {
    padding: 10,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    borderRadius: 10,
    opacity: 0.8,
  },
  errorContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    opacity: 0.8,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0, // Position at the top of the screen
    left: 0, // Position at the left of the screen
    right: 0, // Ensure it takes the full width of the screen
    bottom: 0, // Ensure it takes the full height of the screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    display: 'flex', // Flexbox layout
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: Add a semi-transparent background to dim the screen
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
  },
  platformSpecificText: {
    fontSize: Platform.OS === 'ios' ? 18 : 16, // Different font size for iOS and Android
    color: 'black',
  },
});

export default Map;
