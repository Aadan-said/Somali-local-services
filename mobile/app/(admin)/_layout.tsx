import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet } from 'react-native';

export default function AdminLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#5c6bf0',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: {
                backgroundColor: '#fff',
                borderTopWidth: 0,
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                height: 60,
                paddingBottom: 10,
            },
            headerShown: false,
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <FontAwesome name="dashboard" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="users"
                options={{
                    title: 'Users',
                    tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="providers"
                options={{
                    title: 'Providers',
                    tabBarIcon: ({ color }) => <FontAwesome name="shield" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color }) => <FontAwesome name="warning" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
