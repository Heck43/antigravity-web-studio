// Procedural Web Audio Engine for Cozy Focus (:3)
// 100% offline, zero external audio asset dependencies!

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.tracks = {};
    this.ambientNodes = {};
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft, beautiful meditation bell chime
  playChime(type = 'complete') {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const frequencies = type === 'break' 
        ? [440, 659.25, 880] // A4, E5, A5 (warm rest chord)
        : [528, 792, 1056]; // 528Hz 'Miracle' tone + harmonics (uplifting)

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle envelope: fast soft attack, natural exponential release
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.2 / (idx + 1), now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4 + idx * 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.0);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Play soft tactile click
  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Generate a looping white/pink noise buffer
  createNoiseBuffer(seconds = 4) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      // Pink noise approximation
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.15;
    }
    return buffer;
  }

  // Generate crackle buffer for campfire
  createCrackleBuffer(seconds = 3) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Occasional sharp pop / crackle
      if (Math.random() < 0.0015) {
        data[i] = (Math.random() * 2 - 1) * 0.7;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.015;
      }
    }
    return buffer;
  }

  setAmbient(soundName, isPlaying, volume = 0.5) {
    try {
      this.init();
      if (!this.ctx) return;

      if (!isPlaying) {
        if (this.ambientNodes[soundName]) {
          const { gain, source } = this.ambientNodes[soundName];
          const now = this.ctx.currentTime;
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
          setTimeout(() => {
            try {
              source.stop();
              source.disconnect();
            } catch {}
          }, 350);
          delete this.ambientNodes[soundName];
        }
        return;
      }

      // If already playing, just update volume
      if (this.ambientNodes[soundName]) {
        const { gain } = this.ambientNodes[soundName];
        gain.gain.linearRampToValueAtTime(volume * 0.4, this.ctx.currentTime + 0.1);
        return;
      }

      // Start new ambient sound
      const source = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.4, this.ctx.currentTime + 0.3);

      if (soundName === 'rain') {
        source.buffer = this.createNoiseBuffer(5);
        source.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 950;
        source.connect(filter);
        filter.connect(gain);
      } else if (soundName === 'campfire') {
        source.buffer = this.createCrackleBuffer(4);
        source.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1400;
        filter.Q.value = 1.2;
        source.connect(filter);
        filter.connect(gain);
      } else if (soundName === 'breeze') {
        source.buffer = this.createNoiseBuffer(6);
        source.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 450;

        // Subtle LFO for wind gusting
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.25;
        lfoGain.gain.value = 180;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        source.connect(filter);
        filter.connect(gain);
      } else if (soundName === 'cafe') {
        source.buffer = this.createNoiseBuffer(5);
        source.loop = true;
        const filter1 = this.ctx.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.value = 600;
        filter1.Q.value = 2.0;

        const filter2 = this.ctx.createBiquadFilter();
        filter2.type = 'lowpass';
        filter2.frequency.value = 1200;

        source.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gain);
      }

      gain.connect(this.ctx.destination);
      source.start();

      this.ambientNodes[soundName] = { source, gain };
    } catch (e) {
      console.warn('Ambient sound error:', e);
    }
  }

  stopAllAmbient() {
    Object.keys(this.ambientNodes).forEach(key => {
      this.setAmbient(key, false);
    });
  }
}

export const soundManager = new AudioEngine();
