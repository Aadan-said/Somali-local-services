import { Stack } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuthStore } from '../src/store/auth.store';
import { notificationService } from '../src/services/notification.service';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import MobileErrorBoundary from './components/ErrorBoundary';

export default function RootLayout() {
    const [loaded, error] = useFonts({
        ...FontAwesome.font,
    });

    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();

        // Register for push notifications
        notificationService.registerForPushNotifications();
    }, []);

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <MobileErrorBoundary>
            <RootLayoutNav />
        </MobileErrorBoundary>
    );
}

import { useRouter, useSegments } from 'expo-router';

function RootLayoutNav() {
    const { isAuthenticated, isLoading } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            router.replace('/index'); // index will handle role-based routing
        }
    }, [isAuthenticated, segments, isLoading]);

    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(client)" />
            <Stack.Screen name="(provider)" />
        </Stack>
    );
}
