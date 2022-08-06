export class AsciiArtLoadingAnimation {
    private currentFrame = 0;
    private readonly maxFrames: number;
    private readonly asciiArt: string[];


    constructor(asciiArt: string) {
        this.asciiArt = asciiArt.split("\n");
        this.maxFrames = asciiArt.length;
    }

    next(): AsciiArtLoadingAnimation {
        this.currentFrame++;
        if (this.currentFrame >= this.maxFrames) this.currentFrame = 0;
        return this;
    }

    private render(frameIndex: number): string {
        let fullFrame = "";
        if (frameIndex >= 0 && frameIndex < this.asciiArt.length)
            for (let i = 0; i < this.asciiArt[frameIndex].length; i++)
                fullFrame += this.asciiArt[frameIndex][i] + "\n";
        return fullFrame;
    }

    getCurrentFrame(): string {
        return this.render(this.currentFrame);
    }

}