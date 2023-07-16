import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const App = () => {
    const [imePostaje1, setImePostaje1] = useState('');
    const [imePostaje2, setImePostaje2] = useState('');
    const [urnikPostaje, setUrnikPostaje] = useState([]);
    const [showScreen, setShowScreen] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [postajeVLiniji, setPostajeVLiniji] = useState([]);


    const handleSearch = () => {
        const postaja1 = imePostaje1 || '';
        const postaja2 = imePostaje2 || '';

        fetch(`http://64.226.120.188:3000/api/urniklinije/${imePostaje1}/${imePostaje2}`)
            .then(response => response.json())
            .then(data => {
                setUrnikPostaje(data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleShowPostaje = (linijaId) => {
        fetch(`http://64.226.120.188:3000/linija/${linijaId}/postaje`)
            .then(response => response.json())
            .then(data => {
                setPostajeVLiniji(data); // Set the retrieved postaje data
                setShowScreen(true);
            })
            .catch(error => {
                console.error(error);
            });
    };
    

    urnikPostaje.sort((a, b) => a.zacetek_voznje.localeCompare(b.zacetek_voznje));

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Vstopna postaja"
                    value={imePostaje1}
                    onChangeText={text => setImePostaje1(text)}
                    style={styles.input}
                    autoCorrect={true}
                />
                <TextInput
                    placeholder="Izstopna postaja"
                    value={imePostaje2}
                    onChangeText={text => setImePostaje2(text)}
                    style={styles.input}
                    autoCorrect={true}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="grey" />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {urnikPostaje.map((urnik, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>{urnik.ime_linija}</Text>
                        <View style={styles.contentContainer}>
                            <View style={styles.leftContent}>
                                <Text style={styles.cardText}><Text style={styles.boldText}>{urnik.vstopna_postaja}</Text></Text>
                                <Text style={styles.cardText}>{urnik.zacetek_voznje}</Text>
                            </View>
                            <View style={styles.middleContent}>
                                <TouchableOpacity style={styles.arrowIcon} onPress={() => {
                                    setSelectedCardIndex(index);
                                    setShowScreen(true);
                                }}>
                                    <Ionicons name="arrow-forward-outline" size={30} color="grey" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.rightContent}>
                                <Text style={styles.cardText}><Text style={styles.boldText}>{urnik.izstopna_postaja}</Text></Text>
                                <Text style={styles.cardText}>{urnik.konec_voznje}</Text>
                            </View>
                        </View>

                        <View style={styles.addcontainer}>
                            <Text style={styles.cardTextAdd}><Text style={styles.boldText}>Cena:</Text> {urnik.cena}€  </Text>
                            <Text style={styles.cardTextAdd}><Text style={styles.boldText}>Trajanje:</Text> {urnik.cas} min  </Text>
                            <Text style={styles.cardTextAdd}><Text style={styles.boldText}>Prevoznik:</Text> Arriva d.o.o.  </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {showScreen && selectedCardIndex !== null && (
    <View style={styles.screenContainer}>
        {selectedCardIndex !== null && (
            <Text style={styles.screenSubTitle}>{urnikPostaje[selectedCardIndex]?.ime_linija}</Text>
        )}
        <Text style={styles.screenTitle}>{imePostaje1} - {imePostaje2}</Text>
        {selectedCardIndex !== null && (
            <Text style={styles.screenTime}>{urnikPostaje[selectedCardIndex]?.zacetek_voznje}  -  {urnikPostaje[selectedCardIndex]?.konec_voznje}</Text>
        )}

        <Text style={styles.screenText}>Vmesne postaje:</Text>
        {selectedCardIndex !== null && postajeVLiniji?.map((postaja, index) => (
            <Text key={index} style={styles.screenText2}>{postaja?.ime_postaje} - {postaja?.cas_voznje}</Text>
        ))}
        <TouchableOpacity style={styles.closeButton} onPress={() => setShowScreen(false)}>
            <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
    </View>
)}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContent: {
        flex: 1,
        marginRight: 5,
        paddingLeft: 25,
    },
    middleContent: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    rightContent: {
        flex: 1,
        marginLeft: 5,
        paddingLeft: 25,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        marginBottom: 4,
    },
    addcontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
    },
    boldText: {
        fontWeight: 'bold',
    },
    arrowIcon: {
        left: 10,
        paddingBottom: 5,
    },
    arrowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginRight: 8,
    },
    screenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255, 1)',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        paddingTop: 15,
    },
    screenSubTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        paddingTop: 5,
    },
    screenTime: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        paddingBottom: 10,
    },
    screenText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        paddingLeft: 15,
        paddingVertical: 15,
    },
    screenText2: {
        fontSize: 16,
        color: 'black',
        paddingLeft: 30,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default App;