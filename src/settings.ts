export interface NoteLinkerSettings {
        /**
         * Enable limiting how many matches are surfaced for a single target note within one source note.
         */
        limitMatchesPerNote: boolean;
        /**
         * Maximum number of matches to surface for a single target note within one source note when limiting is enabled.
         */
        maxLinksPerNote: number;
        /**
         * When enabled, already linked instances of a note in the source note count towards the per-note limit.
         */
        countExistingLinksTowardLimit: boolean;
}

export const DEFAULT_SETTINGS: NoteLinkerSettings = {
        limitMatchesPerNote: false,
        maxLinksPerNote: 3,
        countExistingLinksTowardLimit: true,
};
