import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, SegmentedButtons, IconButton } from 'react-native-paper';
import { useCard } from '../src/contexts/CardContext';
import CardPreview from '../src/components/CardPreview';
import LinkEditor from '../src/components/LinkEditor';
import DesignEditor from '../src/components/DesignEditor';
import QRCodeGenerator from '../src/components/QRCodeGenerator';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';

// The screen component is now the Editor UI
export default function EditorScreen() {
  const { cardData, setCardData } = useCard();
  const [editMode, setEditMode] = React.useState('content');
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="check"
          onPress={() => {
            // Card is auto-saved by context, so just navigate back
            router.back();
          }}
        />
      ),
    });
  }, [navigation]);


  const renderEditorMode = () => {
    switch (editMode) {
      case 'content':
        return (
          <>
            <TextInput
              label="Name"
              value={cardData.name}
              onChangeText={(text) => setCardData({ ...cardData, name: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Title"
              value={cardData.title}
              onChangeText={(text) => setCardData({ ...cardData, title: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Bio"
              value={cardData.bio}
              onChangeText={(text) => setCardData({ ...cardData, bio: text })}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            <Text variant="titleLarge" style={styles.sectionTitle}>Links</Text>
            <LinkEditor />
          </>
        );
      case 'design':
        return <DesignEditor />;
      case 'qr':
        return <QRCodeGenerator />;
      default:
        return null;
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* 1. Live Preview */}
      <View style={styles.previewContainer}>
        <CardPreview />
      </View>

      {/* 2. Editor Controls */}
      <View style={styles.controlsContainer}>
        <SegmentedButtons
          value={editMode}
          onValueChange={setEditMode}
          buttons={[
            { value: 'content', label: 'Content' },
            { value: 'design', label: 'Design' },
            { value: 'qr', label: 'QR Code' },
          ]}
          style={styles.input}
        />
        {renderEditorMode()}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewContainer: {
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
  },
  controlsContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
});
