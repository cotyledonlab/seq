export class AudioContextManager {
    private static instance: AudioContext | null = null;

    static async initialize() {
        if (!this.instance) {
            this.instance = new AudioContext();
        }
        
        if (this.instance.state === 'suspended') {
            await this.instance.resume();
        }
        
        return this.instance;
    }

    static getInstance() {
        return this.instance;
    }
}
