class PassthroughWorkletProcessor extends AudioWorkletProcessor {

    // TODO: lift sizes into default variables otherwise set through dependency injection

    constructor() {
        super();
        // buffer = new Array(94); // 250 / ( 128 / 48000 * 1000 )
        // assumes sample rate of 48000
        this.buffer = new Float32Array(12032); // 128 * 94
        this.ind = 0;
    }

    process(inputs, outputs) {
        const inputChannel = inputs[0][0];  //inputChannel Float32Array(128)
        this.buffer.set(inputChannel, this.ind * 128)
        if (this.ind === 93) {
            this.buffer = Int16Array.from(this.buffer, b => b * 32767);
            this.port.postMessage(this.buffer);
            this.ind = 0;
            this.buffer = new Float32Array(12032);
        } else {
            this.ind++;
        }

        return true;
    }
}
registerProcessor('passthrough-worklet', PassthroughWorkletProcessor);