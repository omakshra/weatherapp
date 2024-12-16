import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import GetLocation from 'react-native-get-location';

const CurrentLoc = ({ onLocationFetched }) => {
  const [isLocationRequestInProgress, setIsLocationRequestInProgress] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const getLocation = async () => {
    if (isLocationRequestInProgress) return;

    setIsLocationRequestInProgress(true);

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need access to your location to fetch the weather data.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fetchLocation();
      } else {
        setLocationError('Permission Denied');
        Alert.alert('Permission Denied', 'Location permission is required to fetch weather data.');
        setIsLocationRequestInProgress(false);
      }
    } else {
      fetchLocation(); // Automatically request location for iOS
    }
  };

  const fetchLocation = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,  // Increased timeout to 1 minute
      });
      const { latitude, longitude } = location;
      onLocationFetched(latitude, longitude); // Pass location to parent component
    } catch (error) {
      console.error('Error getting geolocation: ', error);

      setLocationError(error.message || 'Failed to fetch location');
      
      switch (error.code) {
        case 'UNAVAILABLE':
          handleLocationError('Location services are unavailable.');
          break;
        case 'TIMEOUT':
          Alert.alert('Timeout', 'Failed to retrieve location. Try again later.');
          break;
        case 'DENIED':
          Alert.alert('Permission Denied', 'Location permission is required.');
          break;
        case 'LOCATION_DENIED':
          handleLocationError('Location services denied.');
          break;
        default:
          Alert.alert('Error', 'An unknown error occurred.');
      }
    } finally {
      setIsLocationRequestInProgress(false);
    }
  };

  const handleLocationError = (message) => {
    if (Platform.OS === 'android') {
      Alert.alert(
        'Location Services Off',
        message || 'Your location services are off. Please enable them to fetch your location.',
        [
          { text: 'Open Location Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel', onPress: () => setIsLocationRequestInProgress(false), style: 'cancel' },
        ]
      );
    } else if (Platform.OS === 'ios') {
      Alert.alert(
        'Location Services Off',
        message || 'Please enable Location Services in your device settings to allow location access.',
        [
          { text: 'Go to Settings', onPress: () => Linking.openURL('app-settings:') },
          { text: 'Cancel', onPress: () => setIsLocationRequestInProgress(false), style: 'cancel' },
        ]
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return null; // This component doesn't render anything, just fetches location and calls the callback
};

export default CurrentLoc;
