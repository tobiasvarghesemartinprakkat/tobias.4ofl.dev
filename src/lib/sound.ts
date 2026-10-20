let clickAudio: HTMLAudioElement | null = null;

export function playClickSound() {
  try {
    if (typeof window === "undefined") return;

    if (!clickAudio) {
      clickAudio = new Audio("/mouse-click-sound.mp3");
      clickAudio.preload = "auto";
      clickAudio.volume = 0.65;
    }

    if (!clickAudio.paused) {
      const clone = clickAudio.cloneNode() as HTMLAudioElement;
      clone.volume = 0.65;
      clone.play().catch(() => {});
    } else {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
    }
  } catch {
    // Gracefully handle any browser audio playback restrictions
  }
}
