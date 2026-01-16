import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, Card } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

interface QRModalProps {
  visible: boolean;
  onDismiss: () => void;
  value: string;
  title: string;
}

export default function QRModal({ visible, onDismiss, value, title }: QRModalProps) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <Card style={styles.card}>
          <Card.Title title={title} titleStyle={styles.title} />
          <Card.Content style={styles.content}>
            <View style={styles.qrContainer}>
                {value ? <QRCode value={value} size={200} /> : null}
            </View>
            <Button onPress={onDismiss} style={styles.button}>Close</Button>
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
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});
