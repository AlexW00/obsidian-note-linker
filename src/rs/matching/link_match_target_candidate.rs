use wasm_bindgen::prelude::*;

use crate::rs::note::note::Note;
use crate::rs::util::wasm_util::StringArray;

/// A candidate note for a matching to matching to
#[wasm_bindgen]
pub struct LinkMatchTargetCandidate {
    title: String,
    path: String,
    aliases: StringArray
}

#[wasm_bindgen]
impl LinkMatchTargetCandidate {
    #[wasm_bindgen(getter)]
    pub fn title(&self) -> String { self.title.clone() }
    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String { self.path.clone() }
    #[wasm_bindgen(getter)]
    pub fn aliases(&self) -> StringArray { self.aliases.clone() }
}

impl LinkMatchTargetCandidate {
    pub fn new (title: String, path: String, aliases: Vec<String>) -> Self {
        LinkMatchTargetCandidate {
            title,
            path,
            aliases: aliases.into()
        }
    }
}

impl From<&Note> for LinkMatchTargetCandidate {
    fn from(note: &Note) -> Self {
        LinkMatchTargetCandidate {
            title: note.title(),
            path: note.path(),
            aliases: note.aliases()
        }
    }
}