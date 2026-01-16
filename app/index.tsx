import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Link } from 'expo-router';
import CardPreview from '../src/components/CardPreview';
import { useCard } from '../src/contexts/CardContext';

export default function HomeScreen() {
  const { cardData } = useCard();
  
  // A simple check to see if the card is still in its initial state
  const isPristine = cardData.name === 'Your Name';

  return (
    <View style={styles.container}>
      <View style={styles.previewWrapper}>
        {isPristine ? (
          <View style={styles.welcomeContainer}>
            <Text variant="headlineSmall" style={styles.welcomeTitle}>Welcome to CardMake Pro</Text>
            <Text variant="bodyLarge" style={styles.welcomeText}>
              Create and share your professional digital business card in minutes.
            </Text>
            <Text variant="bodyLarge" style={styles.welcomeText}>
              Tap "Create Your Card" to get started!
            </Text>
          </View>
        ) : (
          <CardPreview />
        )}
      </View>
      
      <Link href="/editor" asChild>
        <Button mode="contained" icon="pencil" style={styles.button}>
          {isPristine ? "Create Your Card" : "Edit Your Card"}
        </Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  previewWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  welcomeTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 8,
  }
});
