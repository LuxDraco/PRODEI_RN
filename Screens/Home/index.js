import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View,} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import PlayerScreen from "../Player/PlayerScreen";
import Icon from 'react-native-paper/src/components/Icon'
import {Divider, IconButton, ProgressBar} from "react-native-paper";
import {getTopTracks, getTrackInfo} from "../../Requests/TopTracks";
import {API_KEY} from '@env';
import {calculateProgressPercentage} from "../../Utils/TimeFormat";
import {saveTrackToHistory} from "../../Utils/RecordStorage";


export default function HomeScreen() {
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [selectedMusicIndex, setSelectedMusicIndex] = useState(null);
    const [isPlayerModalVisible, setisPlayerModalVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timestamp, setTimestamp] = useState(0);
    const [mode, setMode] = useState('loop');
    const [topTracks, setTopTracks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTopTracks([]);
        setSelectedMusic(null);

        getTopTracks(API_KEY)
            .then((response) => {
                const tracks = response?.data?.['tracks'].track;
                const promises = tracks.map((track) => updateInfo(track));

                return Promise.all(promises); // Devuelve la promesa resultante de Promise.all para encadenarla
            })
            .then((updatedTracks) => {
                setTopTracks(updatedTracks);
                setLoading(false); // Finalizas el estado de carga una vez que todas las pistas estén actualizadas
            })
            .catch((error) => {
                console.error('Error while fetching top tracks: ' + error);
                setTopTracks([]);
                setLoading(false); // Finalizas el estado de carga incluso en caso de error
            });
    }, []);

    const updateInfo = (track) => {
        return getTrackInfo(API_KEY, track?.name, track?.artist?.name)
            .then((response) => {
                return {
                    ...track,
                    ...response?.data?.track,
                };
            })
            .catch((error) => {
                console.log('Error while fetching track info: ' + error);
                return track; // En caso de error, devuelve el track original
            });
    }

    const PlaylistImageView = () => (
        <>
            <LinearGradient
                colors={['#162238', 'transparent']}
                style={[styles.linearGradient, {
                    flexDirection: selectedMusic ? 'column' : 'row',
                }]}>
                {
                    !isPlayerModalVisible ?
                        <>
                            <Text
                                style={{
                                    color: '#fff',
                                    opacity: selectedMusic ? 0.3 : 1,
                                }}
                            >
                                {
                                    selectedMusic ?
                                        'Playing from'
                                        :
                                        'My Playlist'
                                }
                            </Text>

                            <Text
                                style={{
                                    color: '#fff',
                                }}
                            >
                                {
                                    selectedMusic ?
                                        selectedMusic?.album?.title
                                        : ''
                                }
                            </Text>
                        </>
                        :
                        <Text
                            style={{
                                color: '#fff',
                                marginVertical: 'auto',
                                fontWeight: 'bold',
                                letterSpacing: 1,
                            }}
                        >
                            My Music
                        </Text>
                }
            </LinearGradient>

            <Divider style={{marginBottom: 30}}/>
        </>
    );

    const onSelectTrack = async (selectedTrack, index) => {
        setSelectedMusic(selectedTrack);
        setTimestamp(0);
        setSelectedMusicIndex(index);
        await updateInfo(selectedTrack);
        setIsPlaying(true);
    };

    const timestampRef = useRef(timestamp);

    useEffect(() => {
        timestampRef.current = timestamp; // Actualiza la referencia con el valor más reciente
    }, [timestamp]);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                if (timestampRef.current >= (selectedMusic?.duration / 1000)) { // asegúrate de que estés comparando segundos con segundos
                    onPressNext();
                } else {
                    console.log(timestamp + ' ' + selectedMusic?.duration / 1000 + ' ');
                    setTimestamp(prevTimestamp => prevTimestamp + 1);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isPlaying, selectedMusic, timestamp]);

    useEffect(() => {
        if (selectedMusic) {
            saveTrackToHistory(selectedMusic).then(() => {});
        }
    }, [selectedMusic]);

    const playOrPause = async () => {
        setIsPlaying(!isPlaying);
    };

    const onSeekTrack = newTimeStamp => {
        setTimestamp(newTimeStamp);
    };

    const onPressNext = () => {
        setTimestamp(0);
        setSelectedMusic(
            topTracks[(selectedMusicIndex + 1) % topTracks.length],
        );
        setSelectedMusicIndex(selectedMusicIndex + 1);
    };

    const onPressPrev = () => {
        if (selectedMusicIndex === 0) {
            return;
        }
        setTimestamp(0);
        setSelectedMusic(
            topTracks[(selectedMusicIndex - 1) % topTracks.length],
        );
        setSelectedMusicIndex(selectedMusicIndex - 1);
    };

    const renderSingleMusic = ({item, index}) => {
        return (
            <>
                {
                    (index === 0) ?
                        <PlaylistImageView/>
                        : null
                }

                <Pressable
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginBottom: 20,
                    }}
                    onPress={() => onSelectTrack(item, index)}
                >
                    <View>
                        <Image
                            resizeMode="cover"
                            source={{uri: item?.['album']?.['image']?.[1]?.['#text']}}
                            style={{
                                width: 55,
                                height: 55,
                                marginTop: 3,
                                marginRight: 10,
                                borderRadius: 5,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            height: 55,
                            justifyContent: 'center',

                        }}
                    >
                        <Text style={styles.musicTitle}>{item?.name}</Text>
                        <Text style={[styles.artisteTitle, {opacity: 0.7}]}>{item?.['artist']?.['name']}</Text>
                    </View>
                </Pressable>
            </>
        );
    };

    return (
        <View
            style={styles.container}
        >
            {
                selectedMusic ?
                    <PlayerScreen
                        onCloseModal={() => setisPlayerModalVisible(false)}
                        isVisible={isPlayerModalVisible}
                        isPlaying={isPlaying}
                        playOrPause={playOrPause}
                        selectedMusic={selectedMusic}
                        onSeekTrack={onSeekTrack}
                        timestamp={timestamp}
                        onPressNext={onPressNext}
                        onPressPrev={onPressPrev}
                        playbackMode={mode}
                        onClickLoop={() => {
                            mode === "loop" ? setMode("off") : setMode("loop")
                        }}
                    />
                    : null
            }

            {
                topTracks?.length > 0?
                    <FlatList
                        data={topTracks}
                        keyExtractor={item => item?.url}
                        renderItem={renderSingleMusic}
                        style={{
                            paddingHorizontal: 10,
                        }}
                    />
                    : loading ?
                    <ProgressBar
                        indeterminate={true}
                        color={'#1DB954'}
                        style={{
                            width: '100%',
                            height: 4,
                            position: 'absolute',
                            top: 70,
                        }}
                    />
                    : null
            }

            {
                selectedMusic ?
                    <Pressable
                        onPress={() => setisPlayerModalVisible(true)}
                    >
                        <View
                            style={[styles.widgetContainer, {
                                backgroundColor: '#fff',
                                borderTopRightRadius: 20,
                                borderTopLeftRadius: 20,
                                overflow: 'hidden',
                                position: 'relative',
                            }]}
                        >
                            <View
                                style={{
                                    height: '100%',
                                    width: `${calculateProgressPercentage(selectedMusic, timestamp)}%`,
                                    backgroundColor: '#d2dce2',
                                    position: 'absolute',
                                }}
                            />

                            <View
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    paddingVertical: 20,
                                }}
                            >
                                <View
                                    style={{
                                        width: '100%',
                                        paddingHorizontal: 10,
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Image
                                        resizeMode="cover"
                                        source={{uri: selectedMusic?.['album']?.['image'][1]['#text']}}
                                        style={styles.widgetImageStyle}
                                    />

                                    <View
                                        style={{
                                            height: 60,
                                            justifyContent: 'center',
                                            flexGrow: 1,
                                        }}
                                    >
                                        <Text style={styles.widgetMusicTitle}>
                                            {selectedMusic?.name}
                                        </Text>
                                        <Text style={styles.widgetArtisteTitle}>
                                            {selectedMusic?.artist?.name}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <IconButton
                                            icon={'skip-previous-outline'}
                                            size={20}
                                            iconColor={'#16223877'}
                                            onPress={onPressPrev}
                                        />
                                        <Pressable
                                            onPress={playOrPause}
                                        >
                                            <View
                                                style={{
                                                    borderRadius: 50,
                                                    height: 40,
                                                    width: 40,
                                                    backgroundColor: '#16223833',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Icon
                                                    source={isPlaying ? 'pause' : 'play'}
                                                    size={30}
                                                    color={'#16223877'}
                                                />
                                            </View>
                                        </Pressable>
                                        <IconButton
                                            icon={'skip-next-outline'}
                                            size={20}
                                            iconColor={'#16223877'}
                                            onPress={onPressNext}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                    : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#162238',
        position: 'relative',
    },
    musicTitle: {
        fontSize: 22,
        color: '#fff',
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
    widgetContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: '100%',
        backgroundColor: '#000',
    },
    widgetMusicTitle: {
        fontSize: 18,
        color: '#162238',
        fontWeight: '500',
        marginTop: 1,
        marginHorizontal: 10,
        marginBottom: 1,
    },
    widgetArtisteTitle: {
        fontSize: 14,
        color: '#162238',
        opacity: 0.8,
        marginHorizontal: 10,
        marginBottom: 1,
        marginTop: 1,
    },
    widgetImageStyle: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    linearGradient: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 50,
        marginBottom: 4,
    },
    shuffleButton: {
        color: '#162238',
        fontSize: 24,
        fontWeight: 'bold',
    },
    shuffleButtonContainer: {
        paddingVertical: 15,
        paddingHorizontal: 35,
        borderRadius: 40,
        alignSelf: 'center',
        backgroundColor: '#1DB954',
    },
});
