import { StyleSheet, Image, Platform, View, Button, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as ImagePicker from 'expo-image-picker'

const CameraScreen = () => {
  const [image, setImage] = useState(null);

  const requestPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraResult.status === 'granted' && mediaLibraryResult.status === 'granted';
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      alert('Permission to access camera and media library is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [5, 4], // Optional: restrict the aspect ratio
      quality: 1, // Optional: set the quality of the photo
    });

    if (!result.cancelled) {
      setImage(result.uri); // Set the captured image URI
    }
  };

  return (
    <View style= { styles.container } >
    <Text style={ styles.title }> Take a Picture </Text>
      < Button title = "Take Photo" onPress = { takePhoto } />
        { image && <Image source={ { uri: image } } style = { styles.image } />}
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default CameraScreen;