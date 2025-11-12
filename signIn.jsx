import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import supabase from './utils/supabase';

export default function SignIn({ navigation }) {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    try {
      setLoading(true);
      const redirectUrl = 'myapp://auth';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      if (data?.url) {
        await InAppBrowser.openAuth(data.url, redirectUrl);
        // The onAuthStateChange listener in App.jsx will handle navigation
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleDeepLink = async (event) => {
      try {
        const { url } = event;
        console.log('Deep link received:', url);
        
        const urlParts = url.split('#');
        if (urlParts.length > 1) {
          const params = new URLSearchParams(urlParts[1]);
          const code = params.get('code');

          if (code) {
            console.log('Code found:', code);
            const { data, error } = await supabase.auth.exchangeCodeForSession({ code });
            if (error) throw error;
          }
        }
      } catch (err) {
        console.error('Auth Error:', err.message);
        Alert.alert('Auth Error', err.message);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In</Text>
          <Button title="Sign in with Google" onPress={signInWithGoogle} />
        </>
      )}
    </View>
  );
}