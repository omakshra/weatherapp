import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Animated, ScrollView, Alert, PermissionsAndroid, Platform ,Linking} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/todaystyle';
import axios from 'axios';
import { getWeatherIcon } from '../utils/weatherIcons';
import todayIcon from '../assets/today.png';  
import weeklyIcon from '../assets/weekly.png';  
import mapIcon from '../assets/map.png';  
import weatherIcon from '../assets/rain.png'; 
import Map from '../pages/Map';
import Weather from '../pages/Weather';
import CurrentLoc from '../utils/currentLoc';

const Today = () => {
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);  // Added weekly data state
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null); 
  const [isCelsius, setIsCelsius] = useState(true);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [expandAnimation] = useState(new Animated.Value(0)); 
  const [arrowRotation] = useState(new Animated.Value(0)); 
  const [selectedTab, setSelectedTab] = useState('Today');
  const icons = [todayIcon, weeklyIcon, mapIcon, weatherIcon];

  const apiKey = '10d7d686087b6518358edcc5a6221d22';
  const darkModeColors = ['#0E212E', '#004067'];
  const lightModeColors = ['#C3CED4', '#A1C6E8'];
  const darkModeIcon = require('../assets/dark.png');
  const lightModeIcon = require('../assets/light.png');
  const dropdownIcon = require('../assets/dropdown.png');
  
  const fetchWeather = async (latitude, longitude) => {
    try {
      //current weather
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      setWeatherData(response.data);
      //hourly forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const forecastResponse = await axios.get(forecastUrl);
      setHourlyData(forecastResponse.data.list);

      // Using 5 Day / 3 Hour API for the weekly forecast
      const weeklyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const weeklyResponse = await axios.get(weeklyUrl);
      setWeeklyData(weeklyResponse.data.list.filter((_, index) => index % 8 === 0));  // Filter out every 8th entry for daily forecast
    } catch (error) {
      console.error('Error fetching weather data: ', error);
    } finally {
      setLoading(false);
    }
  };
  const handleLocationFetched = (latitude, longitude) => {
    setLocation({ latitude, longitude });
  };
  useEffect(() => {
    if (location) {
      fetchWeather(location.latitude, location.longitude);
    }
  }, [location]);
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0]; 
  };

  const getHourlyDataForToday = () => {
    const todayDate = getCurrentDate();
    return hourlyData.filter((hour) => {
      const hourDate = new Date(hour.dt * 1000).toISOString().split('T')[0];
      return hourDate === todayDate;
    });
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleTemperatureUnit = () => setIsCelsius(!isCelsius);
  const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const convertToFahrenheit = (celsius) => (celsius * 9/5) + 32;
  const filteredHourlyData = getHourlyDataForToday();

  const toggleCardExpansion = useCallback(() => {
    setIsCardExpanded(prevState => !prevState);

    Animated.timing(expandAnimation, {
      toValue: isCardExpanded ? 0 : 1,
      useNativeDriver: false,
    }).start();

    Animated.timing(arrowRotation, {
      toValue: isCardExpanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [expandAnimation, isCardExpanded, arrowRotation]);

  const cardHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [280, 500], 
  });

  const arrowRotationInterpolation = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <LinearGradient colors={isDarkMode ? darkModeColors : lightModeColors} style={styles.container}>
      <CurrentLoc onLocationFetched={handleLocationFetched} />
      <View style={styles.header}>
        {/* Conditionally render the dark mode icon only for "Today" and "Weekly" pages */}
        {(selectedTab === 'Today' || selectedTab === 'Weekly' || selectedTab === 'Weather') && (
          <TouchableOpacity onPress={toggleTheme} style={styles.button}>
            <Image source={isDarkMode ? lightModeIcon : darkModeIcon} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        
        <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
      ) : weatherData ? (
        <>
        
          {selectedTab === 'Today' || selectedTab === 'Weekly' ? (
            <Animated.View style={[styles.card, { height: cardHeight }]}>
              <TouchableOpacity style={styles.tempUnitButton} onPress={toggleTemperatureUnit}>
                <Text style={styles.tempUnitText}>{isCelsius ? '°F' : '°C'}</Text>
              </TouchableOpacity>
              <Text style={styles.cityText}>{weatherData.name}</Text>
              <TouchableOpacity onPress={toggleCardExpansion} style={styles.arrowButton}>
                <Animated.Image
                  source={dropdownIcon}
                  style={[styles.arrowIcon, { transform: [{ rotate: arrowRotationInterpolation }] }] }
                />
              </TouchableOpacity>
              
              <View style={styles.weatherInfo}>
                {getWeatherIcon(weatherData.weather[0]?.description, styles.weicon)}
                <View style={styles.weatherDetails}>
                  <Text style={styles.weatherText}>
                    {isCelsius
                      ? `${weatherData.main?.temp ?? 'N/A'}°C`
                      : `${convertToFahrenheit(weatherData.main?.temp ?? 0).toFixed(1)}°F`}
                  </Text>
                  
                  <Text style={styles.weatherText}>{weatherData.weather[0]?.description ?? 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.weatherStats}>
                <Text style={styles.weatherText}>Wind speed: {weatherData.wind?.speed ?? 'N/A'} m/s</Text>
                <Text style={styles.weatherText}>Humidity: {weatherData.main?.humidity ?? 'N/A'}%</Text>
                <Text style={styles.weatherText}>Precipitation: {weatherData.rain?.['1h'] ?? 'N/A'} mm</Text>
              </View>

              {isCardExpanded && (
                <Animated.View
                  style={[styles.expandedDetails, {
                    height: expandAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 200],
                    }),
                  }]} >
                  <Text style={styles.weatherText}>Sunrise: {formatTime(weatherData.sys?.sunrise)}</Text>
                  <Text style={styles.weatherText}>Sunset: {formatTime(weatherData.sys?.sunset)}</Text>
                  <Text style={styles.weatherText}>Pressure: {weatherData.main?.pressure ?? 'N/A'} hPa</Text>
                  <Text style={styles.weatherText}>Visibility: {weatherData.visibility ?? 'N/A'} meters</Text>
                </Animated.View>
              )}
            </Animated.View>
          ) : null}

{selectedTab === 'Today' && !isCardExpanded && (
  <View style={styles.container}>
    <View style={styles.card2}>
      <Text style={styles.weatherText}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
        {filteredHourlyData.map((hour, index) => (
          <View key={index} style={styles.hourlyItem}>
            <Text style={styles.hourText}>
              {hour.dt ? formatTime(hour.dt) : 'N/A'}
            </Text>
            <View style={styles.weatherIconCard2}>
              {hour.weather && hour.weather[0] ? getWeatherIcon(hour.weather[0].description, styles.weicon) : null}
            </View>
            <Text style={styles.weatherText}>
              {hour.main && hour.main.temp !== undefined
                ? isCelsius
                  ? `${hour.main.temp}°C`
                  : `${convertToFahrenheit(hour.main.temp).toFixed(1)}°F`
                : 'N/A'}
            </Text>
            {/* Add weather description below the temperature */}
            <Text style={styles.weatherDescription}>
              {hour.weather && hour.weather[0] ? hour.weather[0].description : 'N/A'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
)}

          {selectedTab === 'Map' && (
            <View style={{flex:1,width:"100%"}}>
              <Map /> 
            </View>
          )}

          {selectedTab === 'Weather' && (
            <View style={styles.container}>
              <Weather /> 
            </View>
          )}

          {selectedTab === 'Weekly' && !isCardExpanded && (
  <View style={styles.container}>
    <View style={styles.card2}>
      <Text style={styles.weatherText}>Weekly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
        {weeklyData.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <View key={index} style={styles.hourlyItem}>
              <Text style={styles.hourText}>{dayName}</Text>
              <View style={styles.weatherIconCard2}>
                {getWeatherIcon(day.weather[0]?.description, styles.weicon)}
              </View>
              <Text style={styles.weatherText}>
                {isCelsius
                  ? `${day.main.temp}°C`
                  : `${convertToFahrenheit(day.main.temp).toFixed(1)}°F`}
              </Text>
              {/* Add weather description below the temperature */}
              <Text style={styles.weatherDescription}>
                {day.weather && day.weather[0] ? day.weather[0].description : 'N/A'}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  </View>
)}

        </>
      ) : (
        <Text style={styles.weatherText}>Failed to load weather data.</Text>
      )}

<View style={styles.bottomNav}>
  {['Today', 'Weekly', 'Map', 'Weather'].map((label, index) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.navItem,
        selectedTab === label && styles.selectedNavItem,  // Apply background only to selected icon
      ]}
      onPress={() => handleTabChange(label)}
    >
      <Image 
        source={icons[index]} 
        style={[
          styles.navIcon, 
          selectedTab === label && styles.selectedNavIcon,  // Apply white icon color when selected
        ]}
      />
      <Text 
        style={[
          styles.navText, 
          selectedTab === label && styles.selectedNavText  // Text color remains black for selected
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  ))}
</View>


    </LinearGradient>
  );
};

export default Today;
