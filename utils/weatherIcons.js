import React from 'react';
import { Image } from 'react-native';

import clearSkyIcon from '../assets/clear-sky.png';
import fewCloudsIcon from '../assets/few-clouds.png';
import brokenCloudsIcon from '../assets/broken-clouds.png';
import showerRainIcon from '../assets/shower-rain.png';
import rainIcon from '../assets/rain.png';
import thunderstormIcon from '../assets/thunderstorm.png';
import snowIcon from '../assets/snow.png';
import mistIcon from '../assets/mist.png';
import drizzleicon from '../assets/drizzle.png';

export const getWeatherIcon = (condition, style) => {
  // Make sure the condition is a string before calling toLowerCase
  const conditionLower = condition && typeof condition === 'string' ? condition.toLowerCase() : '';
  if (conditionLower.includes('drizzle')) {
    return <Image source={drizzleicon} style={style} />;
  }
  if (conditionLower.includes('thunderstorm')) {
    return <Image source={thunderstormIcon
    } style={style} />;
  }
  // Default behavior in case the condition is invalid
  switch (conditionLower) {
    case 'clear sky':
      return <Image source={clearSkyIcon} style={style} />;
    case 'few clouds':
      return <Image source={fewCloudsIcon} style={style} />;
    case 'scattered clouds':
    case 'overcast clouds':
    case 'broken clouds':
      return <Image source={brokenCloudsIcon} style={style} />;
    
    case 'extreme rain':
    case 'very heavy rain':
    case 'heavy intensity rain':
    case 'shower rain':
      return <Image source={showerRainIcon} style={style} />;
    case 'heavy rain':
      return <Image source={showerRainIcon} style={style} />;
    case 'light rain':
    case 'moderate rain':
    case 'light intensity shower rain':
    case 'rain':
      return <Image source={rainIcon} style={style} />;
    case 'thunderstorm':
      return <Image source={thunderstormIcon} style={style} />;
    case 'light snow':
    case 'rain and snow':
    case 'heavy snow':
    case 'freezing rain':
    case 'snow':
      return <Image source={snowIcon} style={style} />;
    case 'smoke':
    case 'haze':
    case 'fog':
    case 'mist':
      return <Image source={mistIcon} style={style} />;
    default:
      return <Image source={brokenCloudsIcon} style={style} />; 
    
  }
};
