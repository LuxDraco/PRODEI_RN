import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {LinearGradient} from 'expo-linear-gradient';
import {calculateProgressPercentage, secsToTimestamp} from '../../Utils/TimeFormat';
import {IconButton, Surface} from "react-native-paper";
import Icon from 'react-native-paper/src/components/Icon';
import Modal from 'react-native-modal';


function PlayerScreen({
                          isVisible,
                          onCloseModal,
                          selectedMusic,
                          isPlaying,
                          playOrPause,
                          onSeekTrack,
                          timestamp,
                          onPressNext,
                          onPressPrev,
                          playbackMode,
                          onClickShuffle,
                          onClickLoop,
                      }) {

    return (
        <Modal
            isVisible={isVisible}
            onSwipeComplete={onCloseModal}
            swipeDirection={['down']}
            propagateSwipe
            animationIn={"slideInUp"}
            animationInTiming={500}
            animationOut={"slideOutDown"}
            animationOutTiming={500}
            avoidKeyboard
            coverScreen
            onBackButtonPress={onCloseModal}
            backdropColor={'#00000000'}
            style={{
                marginHorizontal: 0,
                marginBottom: 0,
                marginTop: 25,
                borderTopRightRadius: 40,
                position: 'relative',
            }}
        >
            <LinearGradient
                colors={['#fff', '#eee']}
                style={[styles.container, {
                    position: 'relative',
                    borderTopRightRadius: 40,
                    borderTopLeftRadius: 40,
                    overflow: 'hidden',
                }]}
            >
                <View
                    style={{
                        width: `${calculateProgressPercentage(selectedMusic, timestamp)}%`,
                        backgroundColor: '#d2dce2',
                        position: 'absolute',
                        opacity: 0.5,
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 1,
                    }}
                />

                <IconButton
                    icon={'arrow-expand'}
                    size={20}
                    iconColor={'#2b4c5b'}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 3,
                    }}
                    onPress={onCloseModal}
                />

                <View
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={styles.mainText}>
                            Playing from
                        </Text>
                        <Text style={[styles.mainText, {fontWeight: 'bold'}]}>
                            {selectedMusic?.album?.title}
                        </Text>
                    </View>
                </View>

                <Surface
                    elevation={3}
                    style={{
                        width: '100%',
                        flex: 1,
                        resizeMode: 'cover',
                        borderRadius: 10,
                        margin: 20,
                        overflow: 'hidden',
                        zIndex: 2,
                    }}
                >
                    <Image
                        style={{
                            width: '100%',
                            flex: 1,
                            resizeMode: 'cover',
                        }}
                        source={{uri: selectedMusic?.['album']?.['image']?.[3]?.['#text']}}
                    />
                </Surface>

                <View
                    style={{
                        justifyContent: 'center',
                        width: '100%',
                        marginBottom: 20,
                        alignItems: 'center',
                        zIndex: 2,
                    }}
                >
                    <Text style={styles.boldMainText}>{selectedMusic?.['name']}</Text>
                    <Text
                        style={[styles.mainText, {
                            opacity: 0.5,
                        }]}
                    >
                        {selectedMusic?.['artist']['name']}
                    </Text>
                </View>

                <Slider
                    tapToSeek={false}
                    minimumTrackTintColor="#333"
                    onValueChange={e => {
                        const newTimestamp = Math.floor(e * (selectedMusic?.duration / 1000));
                        onSeekTrack(newTimestamp);
                    }}
                    style={{width: '100%', paddingHorizontal: 0, zIndex: 2,}}
                    value={timestamp / (selectedMusic?.duration / 1000)}
                />

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        zIndex: 2,
                    }}>
                    <Text style={styles.mainText}>{secsToTimestamp(timestamp, true)}</Text>
                    <Text style={styles.mainText}>
                        {secsToTimestamp(selectedMusic?.duration - timestamp)}
                    </Text>
                </View>

                <View
                    style={[styles.timeStampHolder, {
                        zIndex: 2,
                    }]}
                >
                    <View/>
                    <Pressable onPress={onPressPrev}>
                        <Icon size={30} source={'skip-previous-outline'} color={'#274251'}/>
                    </Pressable>
                    <Pressable onPress={playOrPause} style={styles.playButtonHolder}>
                        <Icon
                            style={[styles.iconWidth, {tintColor: '#274251'}]}
                            source={isPlaying ? 'pause' : 'play'}
                            size={30}
                        />
                    </Pressable>
                    <Pressable onPress={onPressNext}>
                        <Icon size={30} source={'skip-next-outline'} color={'#274251'}/>
                    </Pressable>
                    <View/>
                </View>

                <View style={[styles.timeStampHolder, {
                    zIndex: 2,
                }]}>
                    <View/>
                    <IconButton
                        iconColor={playbackMode === 'loop' ? '#1DB954' : '#274251'}
                        size={20}
                        icon={'backup-restore'}
                        onPress={() => onClickLoop()}
                    />
                    <View/>
                </View>
            </LinearGradient>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191414',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 40,
        paddingBottom: 20,
    },
    boldMainText: {
        fontSize: 22,
        color: '#274251',
        fontWeight: '700',
        marginTop: 12,
        marginHorizontal: 20,
        marginBottom: 1,
    },
    mainText: {
        fontSize: 16,
        color: '#274251',
        opacity: 0.8,
        marginHorizontal: 20,
        // marginBottom: 12,
        // marginTop: 1,
    },
    linearGradient: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWidth: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    timeStampHolder: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    playButtonHolder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#cfd0d5',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PlayerScreen;

