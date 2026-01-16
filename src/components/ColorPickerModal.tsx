import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Modal, Portal, Card, Text, TouchableRipple } from 'react-native-paper';
import { presetColors } from '../data/colors';

interface ColorPickerModalProps {
  visible: boolean;
  onDismiss: () => void;
  onColorChange: (color: string) => void;
}

export default function ColorPickerModal({
  visible,
  onDismiss,
  onColorChange,
}: ColorPickerModalProps) {
  
  const handleColorSelect = (color: string) => {
    onColorChange(color);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <Card style={styles.card}>
          <Card.Title title="Select a Color" />
          <Card.Content>
            <ScrollView style={styles.scrollView}>
              {presetColors.map((color) => (
                <TouchableRipple key={color} onPress={() => handleColorSelect(color)}>
                  <View style={styles.colorRow}>
                    <View style={[styles.swatch, { backgroundColor: color }]} />
                    <Text style={styles.hexCode}>{color}</Text>
                  </View>
                </TouchableRipple>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxHeight: '80%',
  },
  scrollView: {
    height: 350,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  hexCode: {
    fontSize: 16,
  }
});
