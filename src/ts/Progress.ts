export default class Progress {

    current: number = 0;
    max: number;

    constructor(max: number) {
        this.max = max;
    }

    public increment() : boolean {
        if (this.isComplete()) return false
        this.current++
        return true;
    }

    public isComplete() : boolean {
        return this.current >= this.max
    }
}