import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
    const [location, setLocation] = useState(null);
    const [showMarkers, setShowMarkers] = useState(false);
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const refRBSheet = useRef();
    const mapRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [stationData, setStationData] = useState([]);
    const [expandedCardIndex, setExpandedCardIndex] = useState(null);


    const scrollViewRef = useRef(null);

    const handleMarkerPress = useCallback(async (station) => {
        setSelectedStation(station);

        try {
            const response = await fetch(`http://64.226.120.188//api/urnikpostaje/${station.id_postaje}`);
            const data = await response.json();
            const linije = data.map(item => ({
                ime_linija: item.ime_linija,
                ura_odhoda: item.ura_odhoda,
                zacetek_voznje: item.zacetek_voznje,
                koncna_postaja: item.koncna_postaja,
                koncna_ura: item.koncna_ura,
                cena: item.cena,
                trajanje: item.cas,
            }));

            linije.sort((a, b) => {
                const timeA = parseInt(a.ura_odhoda.split(':')[0]);
                const timeB = parseInt(b.ura_odhoda.split(':')[0]);
                return timeA - timeB;
            });

            setSelectedStation(prevState => ({
                ...prevState,
                linije: linije
            }));

            refRBSheet.current.open();
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const fetchLocationAndStations = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Dostop do lokacije je bil zavrnjen');
                return;
            }

            try {
                const { coords } = await Location.getCurrentPositionAsync({});
                setLocation(coords);

                const response = await fetch('http://64.226.120.188:3000/postaje');
                const data = await response.json();
                setStations(data);
                setShowMarkers(true);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLocationAndStations();
    }, []);

    const normalizeText = text => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const handleCardPress = (index) => {
        if (expandedCardIndex === index) {
            setExpandedCardIndex(null);
        } else {
            setExpandedCardIndex(index);
        }
    };

    const handleRegionChange = useCallback((region) => {
        setShowMarkers(region.latitudeDelta < 0.04 && region.longitudeDelta < 0.04);
    }, []);

    const handleReturnToLocation = useCallback(() => {
        if (location) {
            mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
            });
        }
    }, [location]);

    const handleSearch = useCallback(async () => {
        const filteredStations = stations.filter(station =>
            normalizeText(station.ime_postaje).includes(normalizeText(searchQuery))
        );

        if (filteredStations.length > 0) {
            const selectedStation = filteredStations[0];
            const region = {
                latitude: selectedStation.Latitude / 1000000,
                longitude: selectedStation.Longitude / 1000000,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
            };

            mapRef.current.animateToRegion(region);
            setSelectedStation(selectedStation);
        }

        setShowMarkers(true);
    }, [searchQuery, stations]);

    const sortedLinije = selectedStation?.linije ? [...selectedStation.linije].sort((a, b) => {
        const timeA = parseInt(a.ura_odhoda.split(':')[0]);
        const timeB = parseInt(b.ura_odhoda.split(':')[0]);
        return timeA - timeB;
    }) : [];

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Iskanje"
                    autoCapitalize="none"
                    autoCorrect={true}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="grey" />
                </TouchableOpacity>
            </View>
            {location && (
                <MapView
                    style={styles.map}
                    ref={mapRef}
                    initialRegion={{
                        latitude: location ? location.latitude : 46.056946,
                        longitude: location ? location.longitude : 14.505751,
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.008,
                    }}
                    showsUserLocation={true}
                    onRegionChangeComplete={handleRegionChange}
                >
                    {showMarkers && stations.map(station => (
                        <Marker
                            key={station.id_postaje}
                            coordinate={{
                                latitude: station.Latitude / 1000000,
                                longitude: station.Longitude / 1000000,
                            }}
                            image={require("./busstop.png")}
                            onPress={() => handleMarkerPress(station)}
                        />
                    ))}
                </MapView>
            )}
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={450}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    },
                }}
            >
                <Text style={styles.sheetTitle}>{selectedStation?.ime_postaje}</Text>
                <Text style={styles.sheetSubtitle}>Odhodi:</Text>
                <ScrollView ref={scrollViewRef}>
                    <View style={styles.sheetContent}>
                        {sortedLinije.map((linija, index) => {
                            const isCardExpanded = expandedCardIndex === index;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => handleCardPress(index)}
                                >
                                    <View style={styles.moreButton}>
                                        <Ionicons
                                            name={isCardExpanded ? 'chevron-down-outline' : 'chevron-forward-outline'}
                                            size={20}
                                            color="black"
                                        />
                                    </View>
                                    <View style={styles.cardTextContainer}>
                                        <Text style={styles.cardTitle}>{linija.ime_linija}</Text>

                                        <Text style={styles.cardText}>{linija.ura_odhoda} - {selectedStation?.ime_postaje}</Text>
                                        <TouchableOpacity style={styles.arrowButton}>
                                            <Ionicons name="arrow-down-outline" size={20} color="grey" />
                                        </TouchableOpacity>
                                        <Text style={styles.cardText}>{linija.koncna_ura} - {linija.koncna_postaja}</Text>

                                        {isCardExpanded && (
                                            <View style={styles.addcontainer}>
                                            <Text style={styles.cardTextAdd}><Text style={styles.boldText}>Cena:</Text> {linija.cena}€</Text>
                                            <Text style={styles.cardTextAdd}><Text style={styles.boldText}>Trajanje:</Text> {linija.trajanje} min</Text>
                                            <Text style={styles.cardTextAdd}><Text style={styles.boldText}>Prevoznik:</Text> Arriva d.o.o.</Text>
                                          </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </RBSheet>
            {location && (
                <TouchableOpacity style={styles.locationButton} onPress={handleReturnToLocation}>
                    <Ionicons name="locate-outline" size={24} color="grey" />
                </TouchableOpacity>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        position: 'relative',
        backgroundColor: '#fff',
        marginBottom: 12,
        padding: 12,
        borderRadius: 6,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: 'grey',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    searchContainer: {
        position: 'absolute',
        top: 45,
        left: 10,
        right: 10,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#000',
        borderColor: "#000",
    },
    searchButton: {
        paddingHorizontal: 8,
    },
    map: {
        flex: 1,
    },
    sheetTitle: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 10,
        paddingBottom: 5,
    },
    sheetSubtitle: {
        fontSize: 15,
        marginBottom: 5,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    sheetContent: {
        paddingHorizontal: 10,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 5,
    },
    cardTextAdd: {
      fontSize: 14,
      marginBottom: 5,
      marginTop: 13,
      marginLeft:15,
    },
    addcontainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    boldText: {
      fontWeight: 'bold',
    },
    cardTitle: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    locationButton: {
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
    arrowButton: {
        left: 10,
        paddingBottom: 5,
    },
    moreButton: {
        position: 'absolute',
        bottom: 40,
        right: 15,
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
    cardTextContainer: {
        flex: 1,
    },
});

export default HomeScreen;