import {StatusBar} from 'expo-status-bar';
import {PaperProvider} from 'react-native-paper';
import {AppTheme} from "./Utils/Theming";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./Screens/Home";
import ProfileScreen from "./Screens/Profile";
import Icon from 'react-native-paper/src/components/Icon';

function App() {

    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();

    return (
        <PaperProvider theme={AppTheme}>
            <StatusBar style="light"/>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="HomeStack"
                    screenOptions={{
                        tabBarActiveTintColor: '#274251',
                    }}
                >
                    <Tab.Screen
                        name="HomeStack"
                        component={HomeScreen}
                        options={{
                            headerShown: false,
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color, size }) => (
                                <Icon source="home" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="SettingsStack"
                        component={ProfileScreen}
                        options={{
                            tabBarLabel: 'Profile',
                            headerShown: true,
                            title: 'Profile',
                            tabBarAccessibilityLabel: 'Profile',
                            tabBarIcon: ({ color, size }) => (
                                <Icon source="information-variant" color={color} size={size} />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

export default App;
