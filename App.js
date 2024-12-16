import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homepage from './pages/Homepage';
import Today from './pages/Today';
import Map from './pages/Map';
import Weather from './pages/Weather';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home screen - has a header */}
        <Stack.Screen name="Home" component={Homepage} />
        
        {/* Today screen - no header */}
        <Stack.Screen 
          name="Today" 
          component={Today} 
          options={{ headerShown: false }} // This removes the header for "Today"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
