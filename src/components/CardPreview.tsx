import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Icon } from 'react-native-paper';
import { useCard, CardLink } from '../contexts/CardContext';

const iconMapping: Record<CardLink['type'], string> = {
  phone: 'phone',
  email: 'email',
  website: 'web',
  linkedin: 'linkedin',
  github: 'github',
  whatsapp: 'whatsapp',
  instagram: 'instagram',
};

export default function CardPreview() {
  const { cardData } = useCard();
  const isCentered = cardData.layoutStyle === 'center';

  // Dynamically create styles based on context
  const dynamicStyles = {
    card: {
      backgroundColor: cardData.cardColor,
      padding: cardData.padding,
    },
    cardContent: {
      alignItems: isCentered ? 'center' : 'flex-start',
    },
    avatarContainer: {
      backgroundColor: cardData.avatarUri ? 'transparent' : cardData.themeColor,
      borderRadius: 40,
      marginBottom: 16,
    },
    textContainer: {
      alignItems: isCentered ? 'center' : 'flex-start',
    },
    name: {
      fontFamily: cardData.fontFamily,
      fontWeight: 'bold',
      textAlign: isCentered ? 'center' : 'left',
      color: cardData.nameColor,
      fontSize: cardData.nameSize,
    },
    title: {
      fontFamily: cardData.fontFamily,
      marginBottom: 8,
      textAlign: isCentered ? 'center' : 'left',
      color: cardData.titleColor,
      fontSize: cardData.titleSize,
    },
    bio: {
      fontFamily: cardData.fontFamily,
      textAlign: isCentered ? 'center' : 'left',
      color: cardData.bioColor,
      fontSize: cardData.bioSize,
    },
    linksContainer: {
      justifyContent: isCentered ? 'space-around' : 'flex-start',
      gap: isCentered ? 0 : 16,
    }
  };

  return (
    <Card style={[styles.card, dynamicStyles.card]}>
      <Card.Content style={dynamicStyles.cardContent}>
        {cardData.avatarUri ? (
          <Avatar.Image size={80} source={{ uri: cardData.avatarUri }} style={dynamicStyles.avatarContainer} />
        ) : (
          <Avatar.Icon size={80} icon="account" style={dynamicStyles.avatarContainer} />
        )}
        <View style={[styles.textContainer, dynamicStyles.textContainer]}>
          <Text style={dynamicStyles.name}>{cardData.name}</Text>
          <Text style={dynamicStyles.title}>{cardData.title}</Text>
          <Text style={dynamicStyles.bio}>{cardData.bio}</Text>
        </View>
        <View style={[styles.linksContainer, dynamicStyles.linksContainer]}>
          {cardData.links.map(link => (
            <Icon
              key={link.id}
              source={iconMapping[link.type] || 'link'}
              size={30}
              color={cardData.themeColor}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    width: '90%',
    alignSelf: 'center',
  },
  textContainer: {
    marginBottom: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    width: '90%',
  }
});
