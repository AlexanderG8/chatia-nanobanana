import { useAudioContext } from '../contexts/audio-context';

// Hook simplificado para usar el audio en componentes
export function useAudio() {
    return useAudioContext();
}
