import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const [value, setValue] = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [items, setItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    fetch('http://64.226.120.188:3000/api/obvestila')
      .then((response) => response.json())
      .then((data) => {
        // Razvrsti po nujnosti
        const sortedByPriority = data.sort((a, b) => {
          if (a.nujno === 'DA' && b.nujno !== 'DA') {
            return -1;
          } else if (a.nujno !== 'DA' && b.nujno === 'DA') {
            return 1;
          } else {
            return 0;
          }
        });

        // Razvrsti po datumu objave (najnovejša objava na vrhu)
        const sortedByDate = sortedByPriority.sort((a, b) => {
          const dateA = a.objavljeno === 'DA' ? new Date('11.05.2023') : new Date(a.objavljeno);
          const dateB = b.objavljeno === 'DA' ? new Date('11.05.2023') : new Date(b.objavljeno);
          return dateB - dateA;
        });

        setItems(sortedByDate);
        setSortedItems(sortedByDate);
      })
      .catch((error) => console.error(error));
  }, []);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = items.filter(
      (item) =>
        item.naslov?.toLowerCase().includes(text.toLowerCase()) ||
        item.obvestilo?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const expandCard = (index) => {
    setValue(index === value ? -1 : index);
    scrollViewRef.current.scrollTo({ y: index * 80, animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {searchVisible && (
            <View style={styles.searchBar}>
              <TextInput
                style={styles.input}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
          )}

          <ScrollView ref={scrollViewRef}>
            {searchQuery === ''
              ? sortedItems.map(
                  (
                    { id_obvestila, naslov, podnaslov, obvestilo, dodatno, zacetek, konec, objavljeno },
                    index
                  ) => {
                    const isActive = value === index;
                    const truncatedTitle =
                      naslov && naslov.length > 20 ? naslov.substring(0, 20) + ' ...' : naslov;
                    const truncatedDescription =
                      obvestilo && obvestilo.length > 100
                        ? obvestilo.substring(0, 100) + ' ...'
                        : obvestilo;
                    return (
                      <TouchableOpacity
                        key={id_obvestila}
                        onPress={() => {
                          expandCard(index);
                        }}
                      >
                        <View
                          style={[
                            styles.radio,
                            isActive && isClicked && styles.expandedCard,
                          ]}
                        >
                          <View style={styles.radioTop}>
                            <Text style={styles.radioLabel}>{naslov}</Text>
                          </View>
                          {isActive && (
                            <View>
                              {podnaslov && (
                                <Text style={styles.radioPodnaslov}>{podnaslov}</Text>
                              )}
                              {obvestilo && (
                                <Text style={styles.radioDescription}>{obvestilo}</Text>
                              )}
                              {dodatno && <Text style={styles.radioDescription}>{dodatno}</Text>}
                              {zacetek && (
                                <Text style={styles.radioDescription}>
                                  <Text style={styles.dateLabel}>OD: </Text>
                                  {zacetek}
                                </Text>
                              )}
                              {konec && (
                                <Text style={styles.radioDescription}>
                                  <Text style={styles.dateLabel}>DO: </Text>
                                  {konec}
                                </Text>
                              )}
                              {objavljeno && (
                                <Text style={styles.radioDescription}>
                                  <View style={styles.emptyRow} />
                                  <Text style={styles.dateLabel}>Objavljeno: </Text>
                                  {objavljeno}
                                </Text>
                              )}
                            </View>
                          )}
                          {!isActive && (
                            <Text style={styles.radioDescription}>{truncatedDescription}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  }
                )
              : filteredItems.map(
                  (
                    { id_obvestila, naslov, podnaslov, obvestilo, dodatno, zacetek, konec, objavljeno },
                    index
                  ) => {
                    const isActive = value === index;
                    const truncatedDescription =
                      obvestilo && obvestilo.length > 100
                        ? obvestilo.substring(0, 100) + '...'
                        : obvestilo;
                    return (
                      <TouchableOpacity
                        key={id_obvestila}
                        onPress={() => {
                          expandCard(index);
                        }}
                      >
                        <View
                          style={[
                            styles.radio,
                            isActive && isClicked && styles.expandedCard,
                          ]}
                        >
                          <View style={styles.radioTop}>
                            <Text style={styles.radioLabel}>{naslov}</Text>
                          </View>
                          {isActive && (
                            <View>
                              {podnaslov && (
                                <Text style={styles.radioPodnaslov}>{podnaslov}</Text>
                              )}
                              {obvestilo && (
                                <Text style={styles.radioDescription}>{obvestilo}</Text>
                              )}
                              {dodatno && <Text style={styles.radioDescription}>{dodatno}</Text>}
                              {zacetek && (
                                <Text style={styles.radioDescription}>
                                  <Text style={styles.dateLabel}>OD: </Text>
                                  {zacetek}
                                </Text>
                              )}
                              {konec && (
                                <Text style={styles.radioDescription}>
                                  <Text style={styles.dateLabel}>DO: </Text>
                                  {konec}
                                </Text>
                              )}
                              {objavljeno && (
                                <Text style={styles.radioDescription}>
                                  <Text style={styles.dateLabel}>Objavljeno: </Text>
                                  {objavljeno}
                                </Text>
                              )}
                            </View>
                          )}
                          {!isActive && (
                            <Text style={styles.radioDescription}>{truncatedDescription}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  }
                )}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.settingsButton} onPress={toggleSearch}>
          <Ionicons
            name={searchVisible ? 'close' : 'search-outline'}
            size={24}
            color={searchVisible ? '#FF0000' : 'grey'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  settingsButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardContainer: {
    flex: 1,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 8,
    borderRadius: 6,
    borderColor: '#000',
  },
  input: {
    flex: 1,
  },
  radio: {
    position: 'relative',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  radioTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioPodnaslov: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  radioDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  expandedCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 24,
  },
  emptyRow: {
    marginBottom: 12,
  },
});