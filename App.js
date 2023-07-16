import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';
import MainContainer from './navigation/MainContainer';
import LoadingScreen from './navigation/components/LoadingScreen';

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAppIsReady(true);
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    prepareApp();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert('Opozorilo', 'Naprava ni povezana v omrežje.');
    }
  }, [isConnected]);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MainContainer />
      <StatusBar style="auto" />
    </>
  );
}
