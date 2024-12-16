import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const Homepage = ({ navigation }) => {
    return (
      <LinearGradient
        colors={['#0E212E', '#004067']}  
        style={styles.container}
      >
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText1}>WEATHER</Text>
          <Text style={styles.weatherText2}>FORECAST</Text>
        </View>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.button}
           onPress={() => navigation.navigate('Today')}  
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    weatherContainer: {
      position: 'absolute',
      top: 50,
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
    },
    weatherText1: {
      paddingTop: 30,
      fontSize: 32,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10, 
    },
    weatherText2: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'yellow',
    },
    logo: {
      width: 250,  
      height: 250,
      top:20,
    },
    button: {
      width: 220,
      height: 80,
      backgroundColor: '#5272A3',
      paddingVertical: 25,
      paddingHorizontal: 30,
      borderRadius: 40,
      alignItems: 'center',
      marginTop: 60, 
      elevation: 8,
    },
    buttonText: {
      color: 'white',
      fontSize: 19,
      fontWeight: 'bold',
    },
  });

  export default Homepage;