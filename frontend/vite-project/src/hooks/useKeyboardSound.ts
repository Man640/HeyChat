// Audio setup
const keyStrokeSounds: HTMLAudioElement[] = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

interface UseKeyboardSoundReturn {
  playRandomKeyStrokeSound: () => void;
}

function useKeyboardSound(): UseKeyboardSoundReturn {
  const playRandomKeyStrokeSound = (): void => {
    const randomSound =
      keyStrokeSounds[
        Math.floor(Math.random() * keyStrokeSounds.length)
      ];

    randomSound.currentTime = 0;

    randomSound
      .play()
      .catch((error: unknown) =>
        console.log("Audio play failed:", error)
      );
  };

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;
