import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Alert, Switch, FlatList, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import divideImage from './images'
import axios from 'axios';

const objectivesList = [
  'Color Diagonals',
  'Column Color Variety',
  'Column Shade Variety',
  'Row Color Variety',
  'Row Shade Variety',
  'Shade Variety',
  'Light Shades',
  'Medium Shades',
  'Deep Shades',
  'Color Variety'
];

const backgroundImage = require('../../assets/images/stainedGlass2.jpg')

export default function HomeScreen() {
  const [playerColor, setPlayerColor] = useState<string>(''); // State for player color
  const [selectedObjectives, setSelectedObjectives] = useState<{ [key: string]: boolean }>({}); // State for objectives
  const [remainingTokens, setRemainingTokens] = useState<string>('0'); // State for tokens

  const handleSwitchChange = (objective: string) => {
    setSelectedObjectives((prev) => ({
      ...prev,
      [objective]: !prev[objective],
    }));
  };

  const [image, setImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  // const [imageArray, setImageArray] = useState<string[]>([]);
  var imageArray: string[];
  const [showScoreCalculation, setShowScoreCalculation] = useState(false);
  const [dotsCount, setDotsCount] = useState<number | null>(null);

  const requestPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraResult.status === 'granted' && mediaLibraryResult.status === 'granted';
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    const selected = Object.keys(selectedObjectives).filter((key) => selectedObjectives[key]);
    if (!playerColor || selected.length !== 3 || !remainingTokens) {
      Alert.alert('Incomplete Input', 'Please fill all fields and select exactly 3 objectives.');
    }
    else if (!hasPermission) {
      alert('Permission to access camera and media library is required!');
      return;
    }
    else {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [5, 4], // Optional: restrict the aspect ratio
        quality: 1, // Optional: set the quality of the photo
      });

      if (!result.canceled) {
        // setImage(result.uri); // Set the captured image URI
        setImageSelected(true); // Indicate that an image has been selected
        const images = await divideImage(result.assets[0].uri);
        imageArray = images; // Update the state with the array of image URIs
        console.log('Image Array:', imageArray)
        console.log(images)
        processImage();
      }
    }
  };

  const calculateScore = () => {
    // Implement your score calculation logic here
    setShowScoreCalculation(true);
  };

  const processImage = async () => {
    if (!imageArray[1]) return;

    const formData = new FormData();
    formData.append('image', {
      uri: imageArray[1],
      type: 'image/jpeg',
      name: 'dice.jpg',
    });

    try {
      const response = await axios.post('http://127.0.0.1:5000/process-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDotsCount(response.data.num_dots);
      console.log(dotsCount)
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  return (
    <ImageBackground
      source= { backgroundImage }
  style = { styles.background }
    >
    <View style={ styles.container }>
      {/* Dropdown for Player Color */ }
      < Text style = { styles.label } > Choose Player Color: </Text>
        < Picker
  selectedValue = { playerColor }
  onValueChange = {(itemValue) => setPlayerColor(itemValue)} 
  style = { styles.dropdown }
  >
  <Picker.Item label="Select Color" value = "" />
    <Picker.Item label="Red" value = "Red" />
      <Picker.Item label="Blue" value = "Blue" />
        <Picker.Item label="Green" value = "Green" />
          <Picker.Item label="Yellow" value = "Yellow" />
            <Picker.Item label="Purple" value = "Purple" />
              </Picker>

{/* Checklist for Objectives */ }
<Text style={ styles.label }> Select 3 Objectives: </Text>
  <View>
{
  objectivesList.map((objective) => (
    <View key= { objective } style = { styles.switchContainer } >
    <Switch
                value={ selectedObjectives[objective] || false }
                onValueChange = {() => handleSwitchChange(objective)}
              />
  < Text style = { styles.switchLabel } > { objective } </Text>
    </View>
          ))}
</View>

{/* Dropdown for Remaining Tokens */ }
<Text style={ styles.label }> Number of Remaining Tokens: </Text>
  < Picker
selectedValue = { remainingTokens }
onValueChange = {(itemValue) => setRemainingTokens(itemValue)}
style = { styles.dropdown }
  >
  <Picker.Item label="Select Tokens" value = "0" />
  {
    [...Array(7).keys()].map((num) => (
      <Picker.Item key= { num } label = {`${num}`} value = {`${num}`} />
          ))}
</Picker>

{/* "Go" Button */ }
<TouchableOpacity style={ styles.button } onPress = { takePhoto } >
  <Text style={ styles.buttonText }> Go </Text>
    </TouchableOpacity>

{/* Conditionally render the "Calculate Score" button */ }
{
  imageSelected && (
    <TouchableOpacity style={ styles.button } onPress = { calculateScore } >
      <Text style={ styles.buttonText }> Calculate Score </Text>
        </TouchableOpacity>
        )
}
{showScoreCalculation && (
  <View style={styles.scoreContainer}>
    <Text style={styles.scoreHeading}>Score Calculated</Text>
    <FlatList
      data={imageArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image source={{ uri: item }} style={styles.image} />
      )}
      numColumns={5} // Display images in a grid with 4 columns
    />
  </View>
)}
</View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginTop: 8,
  },
  dropdown: {
    width: 180,
    height: 50,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: -10,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
    backgroundColor: '#758a6999'
  },
  button: {
    backgroundColor: '#bec7ff',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: '#3c6425',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 80, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    margin: 5,
  },
  scoreContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  scoreHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
})
