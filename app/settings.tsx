import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, Card, Divider, Avatar } from 'react-native-paper';
import { useGoogleDrive } from '../src/hooks/useGoogleDrive';
import { useCard } from '../src/contexts/CardContext';

export default function SettingsScreen() {
  const { user, signIn, signOut, backupCard, restoreCard, isAuthenticated, isProcessing } = useGoogleDrive();
  const { cardData, setCardData } = useCard();

  const handleRestore = async () => {
    Alert.alert(
      "Confirm Restore",
      "Are you sure you want to overwrite your current card data with the backup from Google Drive?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Restore", 
          style: "destructive", 
          onPress: async () => {
            const restoredData = await restoreCard();
            if (restoredData) {
              setCardData(restoredData);
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title="Data Management" />
        <Card.Content>
          {!isAuthenticated ? (
            <>
              <Text style={styles.description}>
                Connect your Google Drive account to back up and restore your card data.
              </Text>
              <Button
                icon="google-drive"
                mode="contained"
                onPress={signIn}
                loading={isProcessing}
                disabled={isProcessing}
              >
                Connect to Google Drive
              </Button>
            </>
          ) : (
            <>
              <View style={styles.userInfo}>
                <Avatar.Image size={48} source={{ uri: user?.picture }} />
                <View style={styles.userDetails}>
                  <Text variant="titleMedium">{user?.name}</Text>
                  <Text variant="bodySmall">{user?.email}</Text>
                </View>
              </View>
              <Button
                icon="logout"
                mode="outlined"
                onPress={signOut}
                style={styles.button}
              >
                Disconnect
              </Button>
              <Divider style={styles.divider} />
              <Button
                icon="backup-restore"
                mode="contained"
                onPress={() => backupCard(cardData)}
                style={styles.button}
                loading={isProcessing}
                disabled={isProcessing}
              >
                Backup Now
              </Button>
              <Button
                icon="cloud-download"
                mode="outlined"
                onPress={handleRestore}
                style={styles.button}
                loading={isProcessing}
                disabled={isProcessing}
              >
                Restore from Backup
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
      <Text style={styles.notice}>Note: You must provide your own Google Client ID in `src/hooks/useGoogleDrive.ts` for this feature to work.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  description: {
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userDetails: {
    marginLeft: 15,
  },
  notice: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
});
