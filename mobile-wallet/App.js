import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet } from 'react-native';

// Import screens
import WalletScreen from './src/screens/WalletScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import StoreLocatorScreen from './src/screens/StoreLocatorScreen';
import ContentDiscoveryScreen from './src/screens/ContentDiscoveryScreen';
import CreatorDashboardScreen from './src/screens/CreatorDashboardScreen';
import V4VPlayerScreen from './src/screens/V4VPlayerScreen';
import MerchantOnboardingScreen from './src/screens/MerchantOnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigation
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>💰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="V4V Discovery"
        component={ContentDiscoveryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🎵</Text>
          ),
          tabBarLabel: 'V4V'
        }}
      />
      <Tab.Screen
        name="Scan & Pay"
        component={ScannerScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>📱</Text>
          ),
          tabBarLabel: 'Scan'
        }}
      />
      <Tab.Screen
        name="Stores"
        component={StoreLocatorScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🏪</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Creator"
        component={CreatorDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🎨</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main app with stack navigation for modals
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="V4VPlayer" 
          component={V4VPlayerScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="MerchantOnboarding" 
          component={MerchantOnboardingScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default App;
