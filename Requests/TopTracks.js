import axios from 'axios';

export const getTopTracks = async (token, userName = 'leifermendez') => {
    try {
        return await axios.get(`https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=mexico&user=${userName}&api_key=${token}&format=json`);
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getTrackInfo = async (token, track, artist, userName = 'leifermendez') => {
    try {
        return await axios.get(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&user=${userName}&api_key=${token}&artist=${artist}&track=${track}&format=json`);
    } catch (error) {
        // console.log(error);
        return null;
    }
}
