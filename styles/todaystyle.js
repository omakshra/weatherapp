import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  scrollContainer: {
    flex: 1,
    padding: width * 0.03,  // 3% of the screen width for padding
  },
  header: { 
    position: 'absolute', 
    top: height * 0.05,  // Adjust based on screen height
    left: width * 0.05,  // Adjust based on screen width
    zIndex: 1 
  },
  button: { 
    position: 'absolute',
    top: height * -0.04,  // Positioning with a negative value relative to screen size
    backgroundColor: '#ffffff80', 
    padding: 8, 
    borderRadius: 20,
  },
  icon: { 
    width: 22, 
    height: 22 
  },
  text: { 
    position: 'absolute', 
    left: width * 0.1,  // Adjust the text position based on screen width
    fontSize: width * 0.05,  // 5% of screen width
    fontWeight: 'bold', 
    color: '#fff',
    paddingTop: 10 
  },
  cityText: { 
    position: 'absolute', 
    color: '#fff', 
    fontSize: width * 0.05,  // Dynamic font size based on screen width
    top: -40 
  },
  card: {
    position: 'absolute',
    top: height * 0.1,  // 10% of screen height
    width: width * 0.85,  // 85% of screen width
    height: height * 0.35,  // 35% of screen height
    padding: 10,
    backgroundColor: '#3F508D',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherDescription: {
    fontSize: width * 0.04,  // Adjust font size based on screen width
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
  expandedCard: { 
    height: height * 0.6  // 60% of screen height for the expanded card
  },
  card2: { 
    position: 'absolute', 
    top: height * 0.52,  // Position based on screen height
    width: width * 0.85,  // 85% of screen width
    height: height * 0.3,  // 30% of screen height
    padding: 10, 
    backgroundColor: '#3F508D', 
    borderRadius: 10 
  },
  tempUnitButton: { 
    position: 'absolute', 
    top: 10, 
    backgroundColor: '#ffffff80', 
    padding: 5, 
    borderRadius: 20, 
    right: 10 
  },
  tempUnitText: { 
    fontSize: 14, 
    color: '#000' 
  },
  arrowButton: { 
    position: 'absolute', 
    top: 10, 
    right: 45, 
    padding: 5 
  },
  arrowIcon: { 
    width: 20, 
    height: 20 
  },
  weatherInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    right: 10, 
    bottom: 30 
  },
  weatherDetails: { 
    marginLeft: 30 
  },
  weatherStats: { 
    alignItems: 'flex-start', 
    bottom: 15 
  },
  
  weatherText: { 
    color: '#fff', 
    fontSize: 18, 
    marginTop: 5 
  },
  expandedDetails: { 
    marginTop: 20, 
    alignItems: 'flex-start' 
  },
  
  // Bottom navigation styles
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.1,  // 10% of screen height for bottom nav
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: { 
    alignItems: 'center', 
    paddingTop: 5, 
    paddingHorizontal: 10,  // Ensure padding around each icon for better spacing
  },
  selectedNavItem: {
    backgroundColor: '#3F508D',  // Black background for selected icon
    borderRadius: 5,  // Rounded corners around the selected icon
    padding: 5,  // Padding around the icon to create breathing space
  },
  navIcon: {
    width: 25,
    height: 25,
    marginBottom: 5, 
    tintColor: '#000',  // Default icon color is black
  },
  selectedNavIcon: {
    tintColor: '#fff',  // White icon color when selected
  },
  navText: { 
    color: '#000',  // Default text color is black
    fontSize: 13, 
    marginTop: 4, 
    bottom: 10 
  },
  selectedNavText: {
    color: '#fff',  // White text color when the tab is selected
  },
  
  // Loading indicator styles
  loadingIndicator: { 
    marginTop: 50 
  },
  
  // Hourly scroll and hourly item styles
  hourlyScroll: {
    marginTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  hourlyItem: {
    width: width * 0.25,  // 25% of screen width
    height: height * 0.2,  // 20% of screen height
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10, 
    backgroundColor: '#4E62AA',  // Adjust background color as needed
    borderRadius: 30,  // Oval shape: large border-radius creates the oval effect
    paddingVertical: 8, // Adjust padding to prevent overflow
    paddingHorizontal: 10,  // Added horizontal padding to make the content fit  
    elevation: 5,  // Optional: to add shadow effect for depth
  },
  hourText: {
    color: '#fff',
    fontSize: 16, 
    marginTop: -8,
  },
  weicon: {
    width: 80,  // Reduced size for the icon to fit inside the oval card
    height: 80, 
    marginBottom: 5,
    marginBottom: -15,
  },
});

export default styles;
