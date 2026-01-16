import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for a single link
export interface CardLink {
  id: string;
  type: 'phone' | 'email' | 'linkedin' | 'github' | 'website' | 'whatsapp' | 'instagram';
  value: string; // The primary value (e.g., phone number, username, URL)
  message?: string; // Optional: for WhatsApp pre-filled messages
}

// Define types for design options
export type LayoutStyle = 'center' | 'left';
export type FontFamily = 'sans-serif' | 'serif' | 'monospace' | 'Roboto' | 'Lato' | 'Montserrat';

// Define the types for the card data
interface CardData {
  // Content
  name: string;
  title: string;
  bio: string;
  links: CardLink[];
  avatarUri: string | null;
  // Design
  themeColor: string;
  cardColor: string;
  nameColor: string;
  titleColor: string;
  bioColor: string;
  nameSize: number;
  titleSize: number;
  bioSize: number;
  padding: number;
  fontFamily: FontFamily;
  layoutStyle: LayoutStyle;
}

// Define the type for the context value
interface CardContextType {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

// Create the context
const CardContext = createContext<CardContextType | undefined>(undefined);

const CARD_STORAGE_KEY = '@CardMakePro:cardData';

// Define the initial state for a new card
const initialCardData: CardData = {
  // Content
  name: 'Your Name',
  title: 'Your Title',
  bio: 'A short and engaging bio about yourself.',
  links: [
    { id: '1', type: 'email', value: 'example@email.com' },
    { id: '2', type: 'phone', value: '+123456789' },
    { id: '3', type: 'website', value: 'your-website.com' },
    { id: '4', type: 'whatsapp', value: '5511987654321', message: 'Hello, I saw your card!' }, // Example: Brazilian number with DDD and pre-filled message
    { id: '5', type: 'instagram', value: 'yourusername' },
  ],
  avatarUri: null,
  // Design
  themeColor: '#6200ee',
  cardColor: '#212121', // Default to a dark card background for dark theme visibility
  nameColor: '#FFFFFF', // Default to white text
  titleColor: '#E0E0E0', // Default to light grey text
  bioColor: '#B0B0B0', // Default to light grey text
  nameSize: 24,
  titleSize: 18,
  bioSize: 14,
  padding: 16,
  fontFamily: 'sans-serif',
  layoutStyle: 'center',
};

// Create the provider component
export function CardProvider({ children }: { children: ReactNode }) {
  const [cardData, setCardData] = useState<CardData>(initialCardData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadCardData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(CARD_STORAGE_KEY);
        if (storedData) {
          setCardData(JSON.parse(storedData));
        }
      } catch (e) {
        console.error('Failed to load card data from AsyncStorage', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCardData();
  }, []);

  // Save data to AsyncStorage whenever cardData changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      const saveCardData = async () => {
        try {
          await AsyncStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(cardData));
        } catch (e) {
          console.error('Failed to save card data to AsyncStorage', e);
        }
      };
      saveCardData();
    }
  }, [cardData, isLoaded]);

  // If data is not yet loaded, you might want to render a loading spinner
  if (!isLoaded) {
    return null; // Or a loading component
  }

  return (
    <CardContext.Provider value={{ cardData, setCardData }}>
      {children}
    </CardContext.Provider>
  );
}

// Create a custom hook for easy context consumption
export function useCard() {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
}
