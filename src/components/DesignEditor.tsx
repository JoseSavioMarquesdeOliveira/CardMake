import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, SegmentedButtons, Button, List, Divider, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useCard, FontFamily, LayoutStyle } from '../contexts/CardContext';
import { Alert } from 'react-native';
import ColorPickerModal from './ColorPickerModal';
import { Picker } from '@react-native-picker/picker';

const fontOptions: { label: string, value: FontFamily }[] = [
  { label: 'Sans-Serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Montserrat', value: 'Montserrat' },
];
const layoutOptions: { label: string, value: LayoutStyle, icon: string }[] = [
    { label: 'Center', value: 'center', icon: 'format-align-center' },
    { label: 'Left', value: 'left', icon: 'format-align-left' },
];

type EditableColor = 'cardColor' | 'themeColor' | 'nameColor' | 'titleColor' | 'bioColor';

const SizeControl = ({ label, value, onIncrease, onDecrease }: any) => (
  <View style={styles.controlRow}>
    <Text style={styles.subLabel}>{label}</Text>
    <View style={styles.sizeControlContainer}>
      <Button onPress={onDecrease}>-</Button>
      <Text>{value}px</Text>
      <Button onPress={onIncrease}>+</Button>
    </View>
  </View>
);

export default function DesignEditor() {
  const { cardData, setCardData } = useCard();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentColorField, setCurrentColorField] = useState<EditableColor>('cardColor');
  // fontMenuVisible and fontMenuAnchorRef are removed

  const openColorPicker = (field: EditableColor) => {
    setCurrentColorField(field);
    setModalVisible(true);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to allow access to your photos.");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!pickerResult.canceled) {
      setCardData({ ...cardData, avatarUri: pickerResult.assets[0].uri });
    }
  };
  
  const handleSizeChange = (field: keyof typeof cardData, increment: number) => {
    setCardData(prev => ({...prev, [field]: Math.max(8, (prev[field] as number) + increment) }));
  };

  const ColorRow = ({ label, field }: { label: string, field: EditableColor }) => (
    <TouchableRipple onPress={() => openColorPicker(field)}>
        <View style={[styles.controlRow, { paddingVertical: 8 }]}>
            <Text style={styles.subLabel}>{label}</Text>
            <View style={[styles.colorSwatch, { backgroundColor: cardData[field] }]} />
        </View>
    </TouchableRipple>
  );

  return (
    <View>
        <ColorPickerModal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            onColorChange={(color) => setCardData({ ...cardData, [currentColorField]: color })}
        />

      <List.AccordionGroup>
        <List.Accordion title="Layout & Avatar" id="1" left={props => <List.Icon {...props} icon="view-dashboard-outline" />}>
            <View style={styles.accordionContent}>
                <Text style={styles.subLabel}>Alignment</Text>
                <SegmentedButtons value={cardData.layoutStyle} onValueChange={(v) => setCardData({ ...cardData, layoutStyle: v as any })} buttons={layoutOptions} style={styles.segment} />
                <Button icon="image" mode="contained-tonal" onPress={pickImage} style={{marginTop: 8}}>Change Picture</Button>
            </View>
        </List.Accordion>
        
        <List.Accordion title="Colors" id="2" left={props => <List.Icon {...props} icon="palette" />}>
            <View style={styles.accordionContent}>
                <ColorRow label="Card Background" field="cardColor" />
                <Divider />
                <ColorRow label="Accent / Icons" field="themeColor" />
                <Divider />
                <ColorRow label="Name Text" field="nameColor" />
                <Divider />
                <ColorRow label="Title Text" field="titleColor" />
                <Divider />
                <ColorRow label="Bio Text" field="bioColor" />
            </View>
        </List.Accordion>

        <List.Accordion title="Typography & Spacing" id="3" left={props => <List.Icon {...props} icon="format-letter-case" />}>
            <View style={styles.accordionContent}>
                <Text style={styles.subLabel}>Font Family</Text>
                <View style={[styles.pickerContainer, { backgroundColor: cardData.cardColor, borderColor: cardData.nameColor }]}>
                  <Picker
                    selectedValue={cardData.fontFamily}
                    onValueChange={(itemValue: FontFamily) =>
                      setCardData({ ...cardData, fontFamily: itemValue })
                    }
                    style={{ color: cardData.nameColor }} // For Android picker text
                    itemStyle={{ color: cardData.nameColor }} // For iOS picker items
                    dropdownIconColor={cardData.nameColor} // For Android dropdown arrow
                  >
                    {fontOptions.map(option => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
                <Divider style={{marginVertical: 8}}/>
                <SizeControl label="Name Size" value={cardData.nameSize} onIncrease={() => handleSizeChange('nameSize', 1)} onDecrease={() => handleSizeChange('nameSize', -1)} />
                <SizeControl label="Title Size" value={cardData.titleSize} onIncrease={() => handleSizeChange('titleSize', 1)} onDecrease={() => handleSizeChange('titleSize', -1)} />
                <SizeControl label="Bio Size" value={cardData.bioSize} onIncrease={() => handleSizeChange('bioSize', 1)} onDecrease={() => handleSizeChange('bioSize', -1)} />
                <SizeControl label="Card Padding" value={cardData.padding} onIncrease={() => handleSizeChange('padding', 2)} onDecrease={() => handleSizeChange('padding', -2)} />
            </View>
        </List.Accordion>

      </List.AccordionGroup>
    </View>
  );
}

const styles = StyleSheet.create({
    subLabel: { fontSize: 16, color: '#333' },
    segment: { marginTop: 8 },
    accordionContent: { paddingHorizontal: 16, paddingBottom: 16 },
    controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sizeControlContainer: { flexDirection: 'row', alignItems: 'center' },
    colorSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#eee'},
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: 'white',
    }
});

