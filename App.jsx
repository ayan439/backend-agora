import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from './utils/supabase';
import SignIn from './signIn';
import HomeScreen from './homeScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = ({ isSignedIn }) => {
  return (
    <Stack.Navigator initialRouteName={isSignedIn ? 'HomeScreen' : 'SignIn'}>
      <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In', headerShown: false }} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home', headerShown: false }} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsSignedIn(!!session);
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackNavigator isSignedIn={isSignedIn} />
    </NavigationContainer>
  );
}
