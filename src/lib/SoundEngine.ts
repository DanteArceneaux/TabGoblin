/**
 * Procedural chiptune sound engine using Web Audio API
 * Generates retro game sounds without external audio files
 */

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor(enabled: boolean = false) {
    this.enabled = enabled;
    if (enabled) {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled) {
      this.initAudioContext();
    }
  }

  /**
   * Play "munch" sound when goblin eats a tab
   */
  playMunch() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Play "chirp" sound when goblin levels up
   */
  playChirp() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554, 659]; // A4, C#5, E5 (major chord)

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);

      gainNode.gain.setValueAtTime(0.2, now + index * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.15);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.15);
    });
  }

  /**
   * Play "glitch" sound when goblin corrupts
   */
  playGlitch() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100 + Math.random() * 200, now);
    osc.frequency.linearRampToValueAtTime(50 + Math.random() * 100, now + 0.2);

    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Play "whimper" sound when goblin is sick
   */
  playWhimper() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.5);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }
}

// Export singleton instance
export const soundEngine = new SoundEngine();

