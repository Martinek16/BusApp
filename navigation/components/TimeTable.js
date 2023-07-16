import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function Example() {
  const [jobExperience, setJobExperience] = useState([]);

  useEffect(() => {
    fetch('http://192.168.88.18:3000/BusLine')
      .then((response) => response.json())
      .then((data) => setJobExperience(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>

        {jobExperience.map(({  LineName, LineStart, LineDuration }, index) => {
          return (
            <View key={index} style={styles.cardWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}>
                <View style={styles.card}>
                  <View style={styles.cardIcon}>
                    <FeatherIcon color="#000" name="clock" size={30} />
                  </View>

                  <View style={styles.cardDelimiter}>
                    {index !== 0 && (
                      <View style={styles.cardDelimiterLine} />
                    )}
                    <View style={[styles.cardDelimiterInset]} />
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.cardBodyContent}>
                      <Text style={styles.cardTitle}>{LineName}</Text>

                      <Text style={styles.cardSubtitle}> {LineStart}</Text>

                      <Text style={styles.cardDates}>
                        Duration: {LineDuration} minutes
                      </Text>
                    </View>

                    <View style={styles.cardBodyAction}>
                      <FeatherIcon
                        color="#181818"
                        name="arrow-right"
                        size={16}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDelimiter: {
    position: 'relative',
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  cardDelimiterInset: {
    width: 12,
    height: 12,
    borderWidth: 3,
    borderRadius: 9999,
    backgroundColor: '#fff',
    borderColor: '#ffcb05',
    zIndex: 9,
    position: 'relative',
  },
  cardDelimiterLine: {
    position: 'absolute',
    left: 30,
    top: '50%',
    borderLeftWidth: 1,
    borderColor: '#eee',
    height: '100%',
    zIndex: 1,
  },
  cardBody: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  cardBodyContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  cardBodyAction: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    maxWidth: 28,
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#464646',
    marginBottom: 3,
  },
  cardDates: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ababab',
  },
});