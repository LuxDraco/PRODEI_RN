import {View, Text, Pressable, Image, FlatList, StyleSheet} from "react-native";
import React, {useEffect, useState} from "react";
import {getTrackHistory} from "../../Utils/RecordStorage";
import {Surface} from "react-native-paper";
import { useIsFocused, useNavigation } from '@react-navigation/native';


const ProfileScreen = () => {

    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Actualizar el historial cada vez que la pantalla esté enfocada
            getTrackHistory().then(setHistory);
        });

        // Limpiar el listener cuando el componente se desmonte
        return unsubscribe;
    }, [navigation]);

    const renderSingleMusic = ({item, index}) => {
        return (
            <Surface
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginBottom: 10,
                    height: 80,
                }}
            >
                <Image
                    resizeMode="cover"
                    source={{uri: item?.['album']?.['image']?.[1]?.['#text']}}
                    style={{
                        width: 80,
                        height: 80,
                        marginRight: 0,
                        borderRadius: 5,
                    }}
                />

                <View
                    style={{
                        height: '100%',
                        justifyContent: 'center',

                    }}
                >
                    <Text style={styles.musicTitle}>{item?.name}</Text>
                    <Text style={[styles.artisteTitle, {opacity: 0.7}]}>{item?.['artist']?.['name']}</Text>
                </View>
            </Surface>
        );
    };

    return (
        <View>
            {
                history.length > 0 ?
                    <FlatList
                        data={history}
                        keyExtractor={item => item?.url}
                        renderItem={renderSingleMusic}
                        style={{
                            paddingHorizontal: 10,
                        }}
                    />
                    :
                    <Text
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                            fontSize: 20,
                            opacity: 0.5,
                        }}
                    >
                        No history yet
                    </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    musicTitle: {
        fontSize: 22,
        color: '#162238',
        fontWeight: '500',
        marginTop: 1,
        marginHorizontal: 20,
        marginBottom: 1,
    },
    artisteTitle: {
        fontSize: 16,
        color: '#5c6c74',
        marginHorizontal: 20,
        marginBottom: 12,
        marginTop: 1,
    },
});

export default ProfileScreen;
