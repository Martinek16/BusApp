import React from 'react';
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';


const { width, height } = Dimensions.get('window');


export default function Example() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        alt=""
        style={styles.background}
        source={{
          uri: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
        }}
      />

      <View style={[styles.background, styles.overflow]} />

      <View style={styles.container}>
        <View style={styles.alert}>
          <Text style={styles.alertTitle}>BusApp</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overflow: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  alertTitle: {
    fontSize: 36,
    textAlign:'center',
    lineHeight: 44,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
});