import {secondsToMinutes} from 'date-fns';
export const secsToTimestamp = (seconds, isCounting = false) => {
    console.log(seconds);
    seconds = seconds / (isCounting ? 1 : 1000);
    const minutes = secondsToMinutes(seconds);
    let secs = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
    // Redondear los segundos a enteros con dos dígitos
    secs = Math.floor(secs);
    // Agregar un cero a la izquierda si los segundos son menores a 10
    secs = secs < 10 ? `0${secs}` : secs;
    return `${minutes}:${secs}`;
};

export const calculateProgressPercentage = (selectedMusic, timestamp) => {
    if (!selectedMusic?.duration) return 0; // Retorna 0 si no hay duración definida.
    return (timestamp / (selectedMusic.duration / 1000)) * 100;
};
