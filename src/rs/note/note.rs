extern crate unicode_segmentation;

use std::convert::TryFrom;

use js_sys::Array;
use serde::{Deserialize, Serialize};
use unicode_segmentation::{Graphemes, UnicodeSegmentation};
use wasm_bindgen::{JsValue};
use wasm_bindgen::prelude::*;

use crate::rs::text::text_util::create_string_with_n_characters;
use crate::rs::util::range::{array_to_range_vec, Range};
use crate::rs::util::wasm_util::{generic_of_jsval};

/// A single note.
#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct Note {
    title: String, // the title of the note
    path: String, // the path of the note
    content: String, // the content of the note
    #[serde(skip)]
    aliases: Array, // possible aliases for the note
    #[serde(skip)]
    ignore: Array, // text ranges that should be ignored by the Link Finder

    // private fields for JSON serialization
    #[serde(rename = "aliases")]
    _aliases: Vec<String>,
    #[serde(rename = "ignore")]
    _ignore: Vec<Range>,
    #[serde(skip)]
    _sanitized_content: String,
}

#[wasm_bindgen]
impl Note {
    #[wasm_bindgen(constructor)]
    pub fn new(title: String, path: String, content: String, aliases: Array, ignore: Array) -> Note {
        let ignore_vec = array_to_range_vec(ignore.clone());
        Note {
            title,
            path,
            content: content.clone(),
            aliases: aliases.clone(),
            ignore,

            _aliases: array_to_string_vec(aliases.clone()),
            _ignore: ignore_vec.clone(),
            _sanitized_content: Note::sanitize_content(content, ignore_vec), // no need to clone anymore
        }
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
    pub fn aliases(&self) -> Array {
        self.aliases.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn ignore(&self) -> Array {
        self.ignore.clone()
    }

    #[wasm_bindgen(method, js_name = "toJSON")]
    pub fn to_json_string(&self) -> String {
        serde_json::to_string(self).unwrap()
    }

    #[wasm_bindgen(method, js_name = "fromJSON")]
    pub fn from_json_string(json_string: &str) -> Self {
        serde_json::from_str(json_string).unwrap()
    }
}

impl Note {
    pub fn aliases_vec(&self) -> &Vec<String> {
        &self._aliases
    }
    pub fn ignore_vec(&self) -> &Vec<Range> {
        &self._ignore
    }

    /// Cleans up the note content by:
    /// - removing all parts of the content that are in the ignore list
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
                    if range.start <= index && range.end >= index { new_content.push_str(&*create_string_with_n_characters(&grapheme.len(), '_')) } else { new_content.push_str(grapheme) }
                }
            );
            content = new_content
        }
        content
    }

    pub fn get_sanitized_content(&mut self) -> &String {
        if self._sanitized_content.is_empty() {
            self._sanitized_content = Note::sanitize_content(self.content.clone(), self._ignore.clone());
        }
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

pub fn array_to_string_vec(array: Array) -> Vec<String> {
    array.iter()
        .filter_map(|a: JsValue| a.as_string())
        .collect()
}