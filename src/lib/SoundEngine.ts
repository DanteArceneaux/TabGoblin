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

  /**
   * Resume audio context after a user gesture (Chrome autoplay policy)
   */
  resume() {
    this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled) {
      this.initAudioContext();
    }
  }

  /**
   * Randomize pitch slightly for variety (0.9x to 1.1x)
   */
  private randomPitch(baseFreq: number): number {
    const variance = 0.1;
    const multiplier = 1 - variance + Math.random() * variance * 2;
    return baseFreq * multiplier;
  }

  /**
   * Play "power on" sound - click followed by rising hum
   */
  playPowerOn() {
    // Respect user sound toggle
    if (!this.enabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Click sound (short noise burst)
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(100, now);
    clickGain.gain.setValueAtTime(0.3, now);
    clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.02);

    // Rising hum (frequency sweep)
    const humOsc = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    humOsc.type = 'sine';
    humOsc.frequency.setValueAtTime(80, now + 0.03);
    humOsc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    humGain.gain.setValueAtTime(0, now + 0.03);
    humGain.gain.linearRampToValueAtTime(0.15, now + 0.08);
    humGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    humOsc.connect(humGain);
    humGain.connect(this.ctx.destination);
    humOsc.start(now + 0.03);
    humOsc.stop(now + 0.2);
  }

  /**
   * Play "munch" sound when goblin eats a tab
   * Pitch is slightly randomized for variety
   */
  playMunch() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(this.randomPitch(200), now);
    osc.frequency.exponentialRampToValueAtTime(this.randomPitch(100), now + 0.1);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Play "chirp" sound for small positive events
   * Pitch is slightly randomized
   */
  playChirp() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const baseNotes = [440, 554, 659]; // A4, C#5, E5
    const notes = baseNotes.map(n => this.randomPitch(n));

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
   * Play "evolution" jingle - triumphant ascending arpeggio
   */
  playEvolution() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    // C major arpeggio going up: C4, E4, G4, C5
    const notes = [262, 330, 392, 523];

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'square';
      const delay = index * 0.12;
      osc.frequency.setValueAtTime(freq, now + delay);

      gainNode.gain.setValueAtTime(0.25, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.2);
    });

    // Final triumphant chord
    setTimeout(() => {
      if (!this.ctx) return;
      const chordTime = this.ctx.currentTime;
      const chordNotes = [523, 659, 784]; // C5, E5, G5

      chordNotes.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gainNode = this.ctx!.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, chordTime);

        gainNode.gain.setValueAtTime(0.15, chordTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, chordTime + 0.4);

        osc.connect(gainNode);
        gainNode.connect(this.ctx!.destination);

        osc.start(chordTime);
        osc.stop(chordTime + 0.4);
      });
    }, 500);
  }

  /**
   * Play "death" sound - sad descending tone
   */
  playDeath() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    // Descending minor: E4, D4, C4
    const notes = [330, 294, 262];

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'triangle';
      const delay = index * 0.3;
      osc.frequency.setValueAtTime(freq, now + delay);

      gainNode.gain.setValueAtTime(0.2, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.4);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.4);
    });
  }

  /**
   * Play "revive" sound - hopeful ascending tone
   */
  playRevive() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    // Ascending: C4, E4, G4
    const notes = [262, 330, 392];

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sine';
      const delay = index * 0.15;
      osc.frequency.setValueAtTime(freq, now + delay);

      gainNode.gain.setValueAtTime(0.25, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.1, now + delay + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.3);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
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
    osc.frequency.setValueAtTime(this.randomPitch(300), now);
    osc.frequency.exponentialRampToValueAtTime(this.randomPitch(150), now + 0.5);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Play level up sound (shorter than evolution)
   */
  playLevelUp() {
    if (!this.enabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523, 659]; // C5, E5

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gainNode.gain.setValueAtTime(0.2, now + index * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.15);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.15);
    });
  }
}

// Export singleton instance
export const soundEngine = new SoundEngine();
