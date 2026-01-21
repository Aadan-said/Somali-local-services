import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, StyleSheet, Platform } from 'react-native';

export default function ClientLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#5c6bf0',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome name="th-large" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="jobs"
                options={{
                    title: 'Jobs',
                    tabBarIcon: ({ color }) => <FontAwesome name="list-ul" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="create-request"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color }) => (
                        <View style={styles.createButton}>
                            <FontAwesome name="plus" size={22} color="#fff" />
                        </View>
                    ),
                    tabBarIconStyle: {
                        marginTop: -30,
                    }
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ color }) => <FontAwesome name="credit-card" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <FontAwesome name="user-circle" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        elevation: 10,
        backgroundColor: '#ffffff',
        borderRadius: 1,
        height: 65,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderTopWidth: 0,
    },
    createButton: {
        width: 60,
        height: 60,
        backgroundColor: '#5c6bf0',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#5c6bf0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 4,
        borderColor: '#f8fafc',
    }
});
