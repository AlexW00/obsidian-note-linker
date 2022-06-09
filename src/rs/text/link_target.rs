use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use crate::rs::util::StringArray;
use js_sys::Array;
use crate::Note;

#[wasm_bindgen]
pub struct LinkTarget {
    title: String,
    path: String,
    aliases: StringArray
}

#[wasm_bindgen]
impl LinkTarget {
    #[wasm_bindgen(getter)]
    pub fn title(&self) -> String { self.title.clone() }
    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String { self.path.clone() }
    #[wasm_bindgen(getter)]
    pub fn aliases(&self) -> StringArray { self.aliases.clone() }
}

impl LinkTarget {
    pub fn new (title: String, path: String, aliases: Vec<String>) -> Self {
        LinkTarget {
            title,
            path,
            aliases: aliases.into()
        }
    }
}

impl From<&Note> for LinkTarget {
    fn from(note: &Note) -> Self {
        LinkTarget {
            title: note.title_string().clone(),
            path: note.path_string().clone(),
            aliases: note.aliases()
        }
    }
}