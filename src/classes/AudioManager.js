/**
 * AudioManager Class - OOP implementation for game audio management
 */

class AudioManager {
  constructor(audioFilePath) {
    this.audioFilePath = audioFilePath;
    this.audioElement = null;
    this.isInitialized = false;
    this.defaultPlaybackRate = 0.4;
    this.currentSafetyLevel = 'safe';
  }

  async initialize() {
    try {
      this.audioElement = new Audio(this.audioFilePath);
      this.audioElement.loop = true;
      this.audioElement.playbackRate = this.defaultPlaybackRate;
      
      // Try to play (will fail if user hasn't interacted yet)
      await this.audioElement.play();
      this.isInitialized = true;
      
      console.log("🔊 Audio initialized successfully");
    } catch (error) {
      console.warn("🔇 Audio autoplay failed (expected on first load):", error.message);
      // This is expected behavior in modern browsers
    }
  }

  updatePlaybackRate(safetyLevel, doseRate) {
    if (!this.audioElement) return;

    let newRate;
    
    switch (safetyLevel) {
      case 'danger':
        newRate = 5 + (doseRate / 100);
        break;
      case 'warning':
        newRate = 1 + (doseRate / 100);
        break;
      case 'safe':
      default:
        newRate = this.defaultPlaybackRate;
        break;
    }

    // Clamp the rate to reasonable bounds
    newRate = Math.max(0.1, Math.min(newRate, 10));
    
    this.audioElement.playbackRate = newRate;
    this.currentSafetyLevel = safetyLevel;
    
    console.log(`🎵 Audio rate updated: ${newRate.toFixed(2)} (${safetyLevel})`);
  }

  async play() {
    if (!this.audioElement) return;

    try {
      await this.audioElement.play();
      console.log("▶️ Audio playback started");
    } catch (error) {
      console.warn("🔇 Audio play failed:", error.message);
    }
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
      console.log("⏸️ Audio playback paused");
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      console.log("⏹️ Audio playback stopped");
    }
  }

  setVolume(volume) {
    if (this.audioElement) {
      // Clamp volume between 0 and 1
      this.audioElement.volume = Math.max(0, Math.min(volume, 1));
    }
  }

  dispose() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
      this.isInitialized = false;
      console.log("🗑️ Audio resources disposed");
    }
  }

  getState() {
    return {
      isInitialized: this.isInitialized,
      isPaused: this.audioElement ? this.audioElement.paused : true,
      currentTime: this.audioElement ? this.audioElement.currentTime : 0,
      volume: this.audioElement ? this.audioElement.volume : 0,
      playbackRate: this.audioElement ? this.audioElement.playbackRate : 1,
      currentSafetyLevel: this.currentSafetyLevel
    };
  }
}

export { AudioManager };