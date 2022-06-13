use wasm_bindgen::prelude::*;

use crate::rs::note::note::Note;
use crate::rs::util::wasm_util::StringArray;

/// A candidate note for a matching to matching to
#[wasm_bindgen]
pub struct LinkTargetCandidate {
    title: String,
    path: String,
    aliases: StringArray,
    selected_index: usize
}

// TODO: Rename ->LinkTargetCandidate
#[wasm_bindgen]
impl LinkTargetCandidate {
    #[wasm_bindgen(getter)]
    pub fn title(&self) -> String { self.title.clone() }
    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String { self.path.clone() }
    #[wasm_bindgen(getter)]
    pub fn aliases(&self) -> StringArray { self.aliases.clone() }
    #[wasm_bindgen(getter)]
    pub fn selected_index(&self) -> usize { self.selected_index }
    #[wasm_bindgen(setter)]
    pub fn set_selected_index(mut self, new_selection: usize) { self.selected_index = new_selection; }
}

impl LinkTargetCandidate {
    pub fn new (title: String, path: String, aliases: &Vec<String>, selected_index: usize) -> Self {
        LinkTargetCandidate {
            title,
            path,
            aliases: aliases.into(),
            selected_index
        }
    }
}

impl From<&Note> for LinkTargetCandidate {
    fn from(note: &Note) -> Self {
        LinkTargetCandidate {
            title: note.title(),
            path: note.path(),
            aliases: note.aliases(),
            selected_index: 0
        }
    }
}