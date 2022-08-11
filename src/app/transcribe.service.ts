import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranscribeService {

  /* config variable
  - sets wsurl, onresults, onpartial, onevent

  need nodes/workletprocessors and socket to be accessible here for clearing later
   */
  voskSettings = {
    url: 'ws://127.0.0.1:2700',
    onPartial: console.log,
    onResults: console.log,
    onError: console.log
  }

  workletProcessorPath = 'assets/passthrough.js'

  micStreamPromise!: Promise<any>;
  socketPromise!: Promise<any>;
  passthrough!: AudioWorkletNode;
  mic!: MediaStreamAudioSourceNode;
  ctx!: AudioContext;
  socket!: WebSocket;

  isListening;

  constructor() {
    this.isListening = false;
  }

  initVosk({ url, onPartial, onResults, onError } = this.voskSettings) {
    this.ctx = new (<any>window).AudioContext(); // does this work with just new AudioContext()?
    this.voskSettings.url = url;
    this.voskSettings.onPartial = onPartial;
    this.voskSettings.onResults = onResults;
    this.voskSettings.onError = onError;

    try {
      this.micStreamPromise = this.ctx.audioWorklet.addModule(this.workletProcessorPath);
      this.toggleWsConn();
    } catch (err) {
      console.log(err);
    }
  }

  createWsConn() {
    this.socketPromise = new Promise((resolve, reject) => { // changed from function (resolve, reject)
      this.socket = new WebSocket(this.voskSettings.url);
      this.socket.addEventListener("open", resolve);
      this.socket.addEventListener("error", reject);
      this.socket.onmessage = (e) => {
        try {
          let res = JSON.parse(e.data)
          if (res.continue) {
            // pass
          } else if (res.partial) {
            this.voskSettings.onPartial(res.partial)
          } else if (res.text) {
            this.voskSettings.onResults(res.text);
          }
        } catch (error) {
          this.voskSettings.onError(error)
        }
      }
      /*
      can i replace above with
      this.socket.onopen = () => { resolve(this.socket) }
      this.socket.onerror = (e) => { reject(e) }
       */
    })
  }

  toggleWsConn() {
    if (!this.isListening) {
      this.createWsConn();

      Promise.all([this.micStreamPromise, this.socketPromise]).then(() => {
        this.isListening = true;
        navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        }).then(micStream => {
          // checking sampleRate for my own peace of mind...
          const sampleRate = micStream.getAudioTracks()[0].getSettings().sampleRate
          this.mic = this.ctx.createMediaStreamSource(micStream)
          this.passthrough = new AudioWorkletNode(this.ctx, 'passthrough-worklet')
          this.passthrough.port.onmessage = (e) => {
            this.socket.send(e.data)
          }
          this.mic.connect(this.passthrough);
          this.passthrough.connect(this.ctx.destination)
          this.isListening = true;
        })
      })
    } else {
      this.isListening = false;
      this.mic.disconnect();
      this.passthrough.disconnect();
      this.socket.close();
    }
  }
}
