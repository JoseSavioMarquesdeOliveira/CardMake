import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, IconButton, Text as PaperText } from 'react-native-paper';
import { useCard, CardLink } from '../contexts/CardContext';
import QRModal from './QRModal';
import { Picker } from '@react-native-picker/picker';

const linkTypes: CardLink['type'][] = ['email', 'phone', 'website', 'linkedin', 'github', 'whatsapp', 'instagram'];

const getLinkPrefix = (type: CardLink['type'], value: string, message?: string) => {
  switch (type) {
    case 'email':
      return `mailto:${value}`;
    case 'phone':
      // For phone numbers, encode exactly what the user types, prefixed with tel:
      return `tel:${value}`;
    case 'whatsapp':
        let cleanedNumber = value.replace(/\D/g, ''); 
        if (!cleanedNumber.startsWith('55') && cleanedNumber.length > 0) {
          cleanedNumber = `55${cleanedNumber}`;
        }
        let whatsappUrl = `https://wa.me/${cleanedNumber}`;
        if (message) {
            whatsappUrl += `?text=${encodeURIComponent(message)}`;
        }
        return whatsappUrl;
    case 'instagram':
        // Instagram expects username only. Prepend if not already a full URL.
        return value.startsWith('http') ? value : `https://instagram.com/${value.replace('@', '')}`;
    case 'github':
        // GitHub expects username only. Prepend if not already a full URL.
        return value.startsWith('http') ? value : `https://github.com/${value}`;
    default:
      return value.startsWith('http') ? value : `https://${value}`;
  }
};

export default function LinkEditor() {
  const { cardData, setCardData } = useCard();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedLink, setSelectedLink] = React.useState<{type: string, value: string, message?: string} | null>(null);
  const [addLinkType, setAddLinkType] = useState<CardLink['type'] | ''>(''); 

  const handleLinkChange = (id: string, field: 'value' | 'message', text: string) => {
    const newLinks = cardData.links.map(link => 
      link.id === id ? { ...link, [field]: text } : link
    );
    setCardData({ ...cardData, links: newLinks });
  };

  const handleRemoveLink = (id: string) => {
    const newLinks = cardData.links.filter(link => link.id !== id);
    setCardData({ ...cardData, links: newLinks });
  };

  const handleAddLink = (type: CardLink['type']) => {
    const newLink: CardLink = {
      id: Date.now().toString(),
      type,
      value: '',
      ...(type === 'whatsapp' && { message: '' }) 
    };
    setCardData({ ...cardData, links: [...cardData.links, newLink] });
    setAddLinkType(''); 
  };
  
  const showQrModal = (link: CardLink) => {
    setSelectedLink({type: link.type, value: getLinkPrefix(link.type, link.value, link.message)});
    setModalVisible(true);
  }

  return (
    <View>
      <QRModal 
        visible={modalVisible} 
        onDismiss={() => setModalVisible(false)}
        value={selectedLink?.value ?? ''}
        title={`QR Code for ${selectedLink?.type}`}
      />
      {cardData.links.map(link => (
        <View key={link.id} style={styles.linkRowContainer}>
          <View style={styles.linkValueAndActionsRow}>
            <TextInput
              label={link.type.charAt(0).toUpperCase() + link.type.slice(1)}
              value={link.value}
              onChangeText={text => handleLinkChange(link.id, 'value', text)}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
            />
            <IconButton
              icon="qrcode"
              onPress={() => showQrModal(link)}
            />
            <IconButton
              icon="delete"
              onPress={() => handleRemoveLink(link.id)}
            />
          </View>
          {link.type === 'whatsapp' && (
            <TextInput
              label="Pre-filled Message (optional)"
              value={link.message}
              onChangeText={text => handleLinkChange(link.id, 'message', text)}
              mode="outlined"
              style={[styles.input, styles.messageInput]}
              multiline
              numberOfLines={2}
            />
          )}
        </View>
      ))}
      <View style={[styles.pickerContainer, { backgroundColor: cardData.cardColor, borderColor: cardData.nameColor }]}>
        <Picker
          selectedValue={addLinkType}
          onValueChange={(itemValue: CardLink['type']) => {
            if (itemValue !== '') { 
              handleAddLink(itemValue);
            }
            setAddLinkType(itemValue); 
          }}
          style={{ color: cardData.nameColor }}
          itemStyle={{ color: cardData.nameColor }}
          dropdownIconColor={cardData.nameColor}
        >
          <Picker.Item label="Add New Link..." value="" enabled={false} />
          {linkTypes.map(type => (
            <Picker.Item key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linkRowContainer: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  linkValueAndActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
  },
  messageInput: {
    marginTop: 8,
    flex: undefined, 
  },
  deleteButton: {
    marginLeft: 0,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
    // Background color will be dynamically set
  }
});
