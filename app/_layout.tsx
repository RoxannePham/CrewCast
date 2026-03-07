import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, router, useSegments, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { ChatProvider } from "@/context/ChatContext";

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === 'auth' || segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      hasRedirected.current = true;
      router.replace('/onboarding');
    } else if (isAuthenticated && !hasCompletedOnboarding && !inAuthGroup) {
      hasRedirected.current = true;
      router.replace('/onboarding');
    } else if (isAuthenticated && hasCompletedOnboarding && inAuthGroup) {
      hasRedirected.current = true;
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, hasCompletedOnboarding, segments, navigationState?.key]);

  if (isLoading) {
    return (
      <View style={splashStyles.container}>
        <LinearGradient
          colors={['#F6F1E8', '#EFE8DC', '#E8DFD0']}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient colors={['#FF8F9B', '#FF5E73']} style={splashStyles.logoCircle}>
          <Text style={splashStyles.logoText}>CC</Text>
        </LinearGradient>
        <Text style={splashStyles.appName}>CrewCast</Text>
        <ActivityIndicator color="#FF7B8A" style={{ marginTop: 24 }} />
      </View>
    );
  }

  return <>{children}</>;
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: '#1E1E1E',
  },
});

function RootLayoutNav() {
  return (
    <AuthGate>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/worker-setup" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/host-setup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="candidate/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="messages/index" options={{ headerShown: false }} />
        <Stack.Screen name="messages/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="notifications" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="organizations/index" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="organizations/[id]" options={{ headerShown: false, presentation: 'card' }} />
      </Stack>
    </AuthGate>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <NotificationsProvider>
              <ChatProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <KeyboardProvider>
                    <RootLayoutNav />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </ChatProvider>
            </NotificationsProvider>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
