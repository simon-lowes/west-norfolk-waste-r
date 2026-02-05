import React, { useState } from 'react';
import { View, Image, StyleSheet, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme';
import { Camera, X, ImageIcon } from 'lucide-react-native';
import { Button } from './Button';

interface PhotoPickerProps {
  photoUri: string | null;
  onPhotoSelected: (uri: string | null) => void;
}

export function PhotoPicker({ photoUri, onPhotoSelected }: PhotoPickerProps) {
  const { colors, layout } = useTheme();
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (useCamera: boolean) => {
    setError(null);

    try {
      // Request permissions
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          setError('Camera permission is required');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          setError('Photo library permission is required');
          return;
        }
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (err) {
      setError('Failed to pick image');
    }
  };

  const removePhoto = () => {
    onPhotoSelected(null);
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.imageContainer,
            {
              borderRadius: layout.radiusMedium,
              backgroundColor: colors.surfaceSecondary,
            },
          ]}
        >
          <Image source={{ uri: photoUri }} style={styles.image} />
          <Pressable
            onPress={removePhoto}
            style={[styles.removeButton, { backgroundColor: colors.error }]}
          >
            <X size={16} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button
          title="Take Photo"
          variant="outline"
          size="small"
          onPress={() => pickImage(true)}
          icon={<Camera size={16} color={colors.text} strokeWidth={2} />}
          style={styles.button}
        />
        <Button
          title="Choose Photo"
          variant="outline"
          size="small"
          onPress={() => pickImage(false)}
          icon={<ImageIcon size={16} color={colors.text} strokeWidth={2} />}
          style={styles.button}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    marginTop: 8,
    fontSize: 13,
  },
});
