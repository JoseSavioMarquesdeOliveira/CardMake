import { useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

// IMPORTANT: Replace with your own Google Cloud credentials
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
const BACKUP_FILE_NAME = 'cardmake_backup.json';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function useGoogleDrive() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const redirectUri = AuthSession.makeRedirectUri({ preferLocalhost: true });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        setAccessToken(authentication.accessToken);
        fetchUserInfo(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      Alert.alert('Authentication Error', response.error?.message || 'An unknown error occurred.');
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userInfo = await userInfoResponse.json();
    setUser(userInfo);
  };
  
  const signIn = async () => {
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        Alert.alert("Configuration Needed", "Please replace 'YOUR_GOOGLE_CLIENT_ID_HERE' in src/hooks/useGoogleDrive.ts with your actual Google Client ID.");
        return;
    }
    await promptAsync();
  };

  const signOut = async () => {
    if (accessToken) {
        await AuthSession.revokeAsync({ token: accessToken, clientId: GOOGLE_CLIENT_ID }, discovery);
        setAccessToken(null);
        setUser(null);
    }
  };

  const searchForFile = async (token: string) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FILE_NAME}'&spaces=drive`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0].id : null;
  };

  const backupCard = async (cardData: any) => {
    if (!accessToken) return Alert.alert("Not signed in", "Please sign in to Google Drive first.");
    setIsProcessing(true);
    try {
        const fileId = await searchForFile(accessToken);
        const fileContent = JSON.stringify(cardData, null, 2);
        
        const metadata = { name: BACKUP_FILE_NAME, mimeType: 'application/json' };
        const body = new FormData();
        body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        body.append('file', new Blob([fileContent], { type: 'application/json' }));

        const method = fileId ? 'PATCH' : 'POST';
        const url = fileId
            ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
            : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

        const response = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${accessToken}` },
            body,
        });

        if (response.ok) {
            Alert.alert("Success", "Backup completed successfully!");
        } else {
            const error = await response.json();
            throw new Error(error.error.message);
        }
    } catch (e: any) {
        Alert.alert("Backup Failed", e.message);
    } finally {
        setIsProcessing(false);
    }
  };

  const restoreCard = async () => {
    if (!accessToken) return Alert.alert("Not signed in", "Please sign in to Google Drive first.");
    setIsProcessing(true);
    try {
        const fileId = await searchForFile(accessToken);
        if (!fileId) {
            throw new Error("No backup file found.");
        }

        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
            const data = await response.json();
            Alert.alert("Success", "Restore completed successfully!");
            return data;
        } else {
            const error = await response.json();
            throw new Error(error.error.message);
        }
    } catch (e: any) {
        Alert.alert("Restore Failed", e.message);
        return null;
    } finally {
        setIsProcessing(false);
    }
  };

  return { user, signIn, signOut, backupCard, restoreCard, isAuthenticated: !!accessToken, isProcessing };
}
