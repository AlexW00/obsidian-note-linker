export class Range <T> {
    start: T;
    end: T;

    constructor(start: T, end: T) {
        this.start = start;
        this.end = end;
    }
    contains(value: T): boolean {
        return value >= this.start && value <= this.end;
    }
}