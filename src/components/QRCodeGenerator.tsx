import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCard } from '../contexts/CardContext';
import { Text, Button, Divider } from 'react-native-paper';

export default function QRCodeGenerator() {
  const { cardData } = useCard();

  // Simple string for now. This can be expanded to a vCard or URL.
  const qrValue = `Name: ${cardData.name}\nTitle: ${cardData.title}`;
  
  const generatePdf = async () => {
    // 1. Create HTML for the card
    const html = `
      <html>
        <body style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <div style="width: 3.5in; height: 2in; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: white; display: flex; flex-direction: column; align-items: ${cardData.layoutStyle}; justify-content: center;">
            <h1 style="font-family: ${cardData.fontFamily}, sans-serif; font-size: 24px; margin: 0; color: #000;">${cardData.name}</h1>
            <h2 style="font-family: ${cardData.fontFamily}, sans-serif; font-size: 16px; margin: 0; color: #666;">${cardData.title}</h2>
            <p style="font-family: ${cardData.fontFamily}, sans-serif; font-size: 12px; text-align: ${cardData.layoutStyle}; color: #444;">${cardData.bio}</p>
          </div>
        </body>
      </html>
    `;

    try {
      // 2. Generate PDF from HTML
      const { uri } = await Print.printToFileAsync({
        html,
        width: Math.round(3.5 * 300), // 3.5 inches at 300 dpi
        height: Math.round(2 * 300), // 2 inches at 300 dpi
      });

      // 3. Share the PDF
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share your business card' });

    } catch (error) {
      console.error(error);
      alert('Failed to generate PDF.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Card</Text>
      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={250}
          logo={{ uri: cardData.avatarUri ?? undefined }}
          logoSize={50}
          logoBackgroundColor="white"
          logoBorderRadius={25}
          backgroundColor="white"
          color="black"
        />
      </View>
      <Text style={styles.instructions}>
        Scan this QR code to get the card details.
      </Text>

      <Divider style={styles.divider} />
      
      <Button icon="file-pdf-box" mode="contained" onPress={generatePdf}>
        Export to PDF
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    marginTop: 20,
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 24,
    width: '80%',
  }
});
