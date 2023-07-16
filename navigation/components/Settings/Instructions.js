import React, { useRef, useState } from 'react';
import {StyleSheet,SafeAreaView,Image,Text,TouchableOpacity,View,Dimensions,Animated} from 'react-native';
import Swiper from 'react-native-swiper';


const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to App!',
    message: 'The simplest and safest way to access your favorite app.',
    action: 'Get started',
  },
  {
    title: 'The future is here',
    message:
      'Proident ipsum sunt qui aliquip veniam deserunt sint minim cupidatat amet',
    action: 'Continue',
  },
  {
    title: "Here's the great news",
    message:
      'Proident ipsum sunt qui aliquip veniam deserunt sint minim cupidatat amet',
    action: 'Create your account',
  },
];


export default function Example() {
  const [slide, setSlide] = useState(0);

  const swiper = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const animatedBackgroundLeft = scrollX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1, 0, -1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ left: animatedBackgroundLeft }}>
        <Image
          source={{ uri: 'https://withfra.me/shared/Landing.1.png' }}
          resizeMode="contain"
          style={styles.slideImage}
        />
      </Animated.View>
      <Swiper
        ref={swiper}
        showsPagination={false}
        loop={false}
        onIndexChanged={setSlide}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        onTouchStart={() => {
          Animated.timing(contentOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }}
        onTouchEnd={() => {
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }}
        scrollEventThrottle={1}>
        {slides.map((item, index) => {
          return (
            <Animated.View
              key={index}
              style={[styles.slide, { opacity: contentOpacity }]}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideText}>{item.message}</Text>

              <TouchableOpacity
                onPress={() => {
                  swiper.current.scrollTo(slide + 1, true);
                }}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>{item.action}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Swiper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1f26',
  },
  slide: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingHorizontal: 36,
  },
  slideImage: {
    width: width * slides.length,
    height: 0.6 * height,
    position: 'absolute',
    top: 47,
    left: 0,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  slideText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#a9b1cf',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e5afb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 36,
    marginVertical: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});