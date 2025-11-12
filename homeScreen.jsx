import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, Image, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import supabase from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data: { user: authUser }, error } = await supabase.auth.getUser();
            if (error) throw error;
            
            // Get user metadata (name, picture from Google)
            setUser({
                id: authUser?.id,
                email: authUser?.email,
                name: authUser?.user_metadata?.full_name || 'User',
                photo: authUser?.user_metadata?.avatar_url || 'https://via.placeholder.com/80',
            });
        } catch (error) {
            console.error('Fetch user error:', error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await GoogleSignin.signOut();
            await supabase.auth.signOut();
            Alert.alert("Signed Out", "You have been signed out successfully.");
            // Navigation will be handled by App.jsx via onAuthStateChange
        } catch (error) {
            console.error("Sign Out Error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.background}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>
                <View style={styles.profileCard}>
                    <Image source={{ uri: user?.photo }} style={styles.profileImage} />
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <Text style={styles.userId}>User ID: {user?.id}</Text>

                    {/* Sign Out Button */}
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    userId: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    signOutButton: {
        marginTop: 20,
        backgroundColor: '#ff3b30', // Red color for sign out
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});