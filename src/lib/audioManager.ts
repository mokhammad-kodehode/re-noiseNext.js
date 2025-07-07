// lib/audioManager.ts
type TrackName = string;

class AudioManager {
  private ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  private tracks: Record<TrackName, {
    buffer?: AudioBuffer;
    gain?: GainNode;
    source?: AudioBufferSourceNode;
    isPlaying: boolean;
  }> = {};

  async load(name: TrackName, url: string) {
    if (this.tracks[name]) return;                         // already loaded
    const res   = await fetch(url);
    const buf   = await res.arrayBuffer();
    const audio = await this.ctx.decodeAudioData(buf);
    this.tracks[name] = { buffer: audio, isPlaying: false };
  }

  toggle(name: TrackName, volume = 1) {
    const t = this.tracks[name];
    if (!t?.buffer) return;

    if (t.isPlaying) {                       // ➜ stop
      t.source?.stop();
      t.isPlaying = false;
      return;
    }

    const src  = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    src.buffer = t.buffer;
    src.loop   = true;
    gain.gain.value = volume;

    src.connect(gain).connect(this.ctx.destination);
    src.start(0);

    t.source    = src;
    t.gain      = gain;
    t.isPlaying = true;

    // MediaSession makes iOS treat us like a real player
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: name,
        artist: 'Relax-App',
        artwork: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }]
      });
    }
  }

  setVolume(name: TrackName, v: number) { this.tracks[name]?.gain?.gain.setValueAtTime(v, this.ctx.currentTime); }
  setVolumeAll(v: number)                { Object.values(this.tracks).forEach(t => t.gain?.gain.setValueAtTime(v, this.ctx.currentTime)); }
  stopAll()                              { Object.keys(this.tracks).forEach(n => this.tracks[n].source?.stop()); }
}

export const audioManager = new AudioManager();
