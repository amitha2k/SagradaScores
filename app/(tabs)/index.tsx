import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Alert, Switch, FlatList} from 'react-native';
import { Picker } from '@react-native-picker/picker';

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

  const handleGo = () => {
    const selected = Object.keys(selectedObjectives).filter((key) => selectedObjectives[key]);
    if (playerColor && selected.length === 3 && remainingTokens) {
      Alert.alert('Input Received', `Player Color: ${playerColor}\nObjectives: ${selected.join(', ')}\nRemaining Tokens: ${remainingTokens}`);
    } else {
      Alert.alert('Incomplete Input', 'Please fill all fields and select exactly 3 objectives.');
    }
  };

  return (
    <ImageBackground
      source={backgroundImage} 
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Dropdown for Player Color */}
        <Text style={styles.label}>Choose Player Color:</Text>
        <Picker
          selectedValue={playerColor}
          onValueChange={(itemValue) => setPlayerColor(itemValue)}
          style={styles.dropdown}
        >
          <Picker.Item label="Select Color" value="" />
          <Picker.Item label="Red" value="Red" />
          <Picker.Item label="Blue" value="Blue" />
          <Picker.Item label="Green" value="Green" />
          <Picker.Item label="Yellow" value="Yellow" />
          <Picker.Item label="Purple" value="Purple" />
        </Picker>

        {/* Checklist for Objectives */}
        <Text style={styles.label}>Select 3 Objectives:</Text>
        <View>
          {objectivesList.map((objective) => (
            <View key={objective} style={styles.switchContainer}>
              <Switch
                value={selectedObjectives[objective] || false}
                onValueChange={() => handleSwitchChange(objective)}
              />
              <Text style={styles.switchLabel}>{objective}</Text>
            </View>
          ))}
        </View>

        {/* Dropdown for Remaining Tokens */}
        <Text style={styles.label}>Number of Remaining Tokens:</Text>
        <Picker
          selectedValue={remainingTokens}
          onValueChange={(itemValue) => setRemainingTokens(itemValue)}
          style={styles.dropdown}
        >
          <Picker.Item label="Select Tokens" value="0" />
          {[...Array(11).keys()].map((num) => (
            <Picker.Item key={num} label={`${num}`} value={`${num}`} />
          ))}
        </Picker>

        {/* "Go" Button */}
        <TouchableOpacity style={styles.button} onPress={handleGo}>
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
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
    backgroundColor:'#758a6999'
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
});
