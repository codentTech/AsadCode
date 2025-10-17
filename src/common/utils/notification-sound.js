// Reusable audio context to prevent state issues
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Resume if suspended (browser autoplay policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
};

// Generate notification sound using Web Audio API
export const playNotificationSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First beep
    const oscillator1 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();

    oscillator1.connect(gainNode1);
    gainNode1.connect(ctx.destination);

    oscillator1.frequency.value = 800;
    oscillator1.type = "sine";

    gainNode1.gain.setValueAtTime(0, now);
    gainNode1.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator1.start(now);
    oscillator1.stop(now + 0.15);

    // Second beep
    const oscillator2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();

    oscillator2.connect(gainNode2);
    gainNode2.connect(ctx.destination);

    oscillator2.frequency.value = 1000;
    oscillator2.type = "sine";

    const secondBeepStart = now + 0.15;
    gainNode2.gain.setValueAtTime(0, secondBeepStart);
    gainNode2.gain.linearRampToValueAtTime(0.3, secondBeepStart + 0.01);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, secondBeepStart + 0.15);

    oscillator2.start(secondBeepStart);
    oscillator2.stop(secondBeepStart + 0.15);
  } catch (error) {
    console.log("Could not play notification sound:", error);
  }
};
