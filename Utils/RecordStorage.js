import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveTrackToHistory = async (track) => {
    try {
        // Obtener el historial actual de canciones
        const historyJSON = await AsyncStorage.getItem('trackHistory');
        const history = historyJSON ? JSON.parse(historyJSON) : [];

        // Agregar la nueva canción al inicio
        history.unshift(track);

        // Limitar a 10 canciones
        if (history.length > 10) {
            history.pop();
        }

        // Guardar el historial actualizado
        await AsyncStorage.setItem('trackHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving track to history:', error);
    }
};

export const getTrackHistory = async () => {
    try {
        const historyJSON = await AsyncStorage.getItem('trackHistory');
        return historyJSON ? JSON.parse(historyJSON) : [];
    } catch (error) {
        console.error('Error getting track history:', error);
        return [];
    }
};
