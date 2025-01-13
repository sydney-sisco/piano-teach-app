class EventEmitter {
    constructor() {
        this.target = document.createElement('div');
    }

    on(event, listener) {
        this.target.addEventListener(event, (e) => listener(...e.detail));
    }

    off(event, listener) {
        this.target.removeEventListener(event, (e) => listener(...e.detail));
    }

    emit(event, ...args) {
        const customEvent = new CustomEvent(event, { detail: args });
        this.target.dispatchEvent(customEvent);
    }
}

const pianoEvents = new EventEmitter();
