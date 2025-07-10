import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FlashMessage from 'react-native-flash-message';

// Screens
import WalletScreen from './src/screens/WalletScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import StoreLocatorScreen from './src/screens/StoreLocatorScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function WalletStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WalletMain" 
        component={WalletScreen} 
        options={{ title: 'PeakeCoin Wallet' }} 
      />
      <Stack.Screen 
        name="TransactionHistory" 
        component={TransactionHistoryScreen}
        options={{ title: 'Transaction History' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ title: 'Payment' }}
      />
    </Stack.Navigator>
  );
}

function PaymentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ title: 'Scan to Pay' }} 
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ title: 'Confirm Payment' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Wallet') {
              iconName = 'account-balance-wallet';
            } else if (route.name === 'Pay') {
              iconName = 'qr-code-scanner';
            } else if (route.name === 'Stores') {
              iconName = 'store';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Wallet" component={WalletStack} />
        <Tab.Screen name="Pay" component={PaymentStack} />
        <Tab.Screen name="Stores" component={StoreLocatorScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}
