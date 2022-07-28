use std::convert::TryFrom;

use js_sys::Array;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use crate::log;
use serde::{Serialize, Deserialize};

use crate::rs::text::text_util::{create_string_with_n_characters, get_nearest_char_boundary};
use crate::rs::util::range::{Range, RangeArray};
use crate::rs::util::wasm_util::{generic_of_jsval, StringArray};

extern crate unicode_segmentation;

use unicode_segmentation::{Graphemes, UnicodeSegmentation};

#[wasm_bindgen]
#[derive(Clone)]
pub struct Note {
    title: String,
    path: String,
    content: String,
    aliases: StringArray,
    ignore: RangeArray,

    _aliases: Vec<String>,
    _ignore: Vec<Range>,
    _sanitized_content: String
}

#[wasm_bindgen]
impl Note {
    #[wasm_bindgen(constructor)]
    pub fn new(title: String, path: String, content: String, aliases: StringArray, ignore: RangeArray) -> Note {
        let ignore_vec = Vec::from(ignore.clone());
        let note = Note {
            title: title.clone(),
            path: path.clone(),
            content: content.clone(),
            aliases: aliases.clone(),
            ignore: ignore.clone(),

            _aliases: aliases.into(),
            _ignore: ignore_vec.clone(),
            _sanitized_content: Note::sanitize_content(content, ignore_vec) // no need to clone anymore
        };
        note
    }

    #[wasm_bindgen(getter)]
    pub fn title(&self) -> String { self.title.clone() }
    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String { self.path.clone() }
    #[wasm_bindgen(getter)]
    pub fn content(&self) -> String {
        self.content.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn aliases(&self) -> StringArray {
        self.aliases.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn ignore(&self) -> RangeArray {
        self.ignore.clone()
    }
}

impl Note {
    pub fn aliases_vec(&self) -> &Vec<String> {
        &self._aliases
    }
    pub fn ignore_vec (&self) -> &Vec<Range> {
        &self._ignore
    }

    fn sanitize_content(mut content: String, ignore_vec: Vec<Range>) -> String {
        for ignore in ignore_vec {
            let range: std::ops::Range<usize> = ignore.clone().into();
            let split_content: Graphemes = UnicodeSegmentation::graphemes(content.as_str(), true);
            let mut new_content: String = String::new();
            // necessary to split graphemes, since characters such as emojis
            // only increase the character offset by 1 (offset is provided by obsidian api),
            // however in rust strings, they have a length of 2-4
            split_content.enumerate().for_each(
                |(index, grapheme)| {
                    if &range.start <= &index && &range.end >= &index { new_content.push_str(&*create_string_with_n_characters(&grapheme.len(), '_')) }
                    else { new_content.push_str(grapheme) }
                }
            );
            content = new_content
        }
        content
    }

    pub fn get_sanitized_content (&self) -> &String {
        &self._sanitized_content
    }

}

impl TryFrom<JsValue> for Note {
    type Error = ();
    fn try_from(js: JsValue) -> Result<Self, Self::Error> {
        note_from_js_value(js).ok_or(())
    }
}

#[wasm_bindgen]
pub fn note_from_js_value(js: JsValue) -> Option<Note> {
    generic_of_jsval(js, "Note").unwrap_or(None)
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<Note>")]
    pub type NoteArray;
}

impl Into<Vec<String>> for StringArray {
    fn into(self) -> Vec<String> {
        let arr: Result<Array, StringArray> = self.dyn_into::<Array>();
        match arr {
            Ok(arr) => arr.iter()
                .filter_map(|a: JsValue| a.as_string())
                .collect(),
            Err(_) => vec![],
        }
    }
}