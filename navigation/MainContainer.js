// Uvoz knjižnic
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/HomeScreen';
import TimetableScreen from './screens/TimeTableScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';

//Screen names
const homeName = "Domov";
const timetableName = "Vozni red";
const settingsName = "Nastavitve";
const notificationsName = "Obvestila";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === timetableName) {
              iconName = focused ? 'list' : 'list-outline';

            } else if (rn === notificationsName) {
              iconName = focused ? 'notifications' : 'notifications-outline';

            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'grey',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: { paddingBottom: 0, fontSize: 10 },
          tabBarStyle: { padding: 10, height: 80}
        })}>

        <Tab.Screen name={homeName} component={HomeScreen} options={{ headerShown: false }}/>
        <Tab.Screen name={timetableName} component={TimetableScreen} />
        <Tab.Screen name={notificationsName} component={NotificationsScreen}/>

      </Tab.Navigator>
    </NavigationContainer>
  );
}
