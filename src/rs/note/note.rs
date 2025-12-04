extern crate unicode_segmentation;

use std::convert::TryFrom;
use std::collections::{HashMap, HashSet};

use js_sys::Array;
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::from_value;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

use crate::rs::links::{normalize_existing_link_key, normalized_link_keys_from};
use crate::rs::text::text_util::create_string_with_n_characters;
use crate::rs::util::range::{array_to_range_vec, Range};
use crate::rs::util::wasm_util::generic_of_jsval;

/// A single note.
#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct Note {
    title: String,   // the title of the note
    path: String,    // the path of the note
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

    #[serde(skip)]
    normalized_link_keys: HashSet<String>,

    existing_link_counts: HashMap<String, usize>,
}

#[wasm_bindgen]
impl Note {
    #[wasm_bindgen(constructor)]
    pub fn new(
        title: String,
        path: String,
        content: String,
        aliases: Array,
        ignore: Array,
    ) -> Note {
        let ignore_vec = array_to_range_vec(ignore.clone());
        let aliases_vec = array_to_string_vec(aliases.clone());
        let normalized_link_keys = normalized_link_keys_from(&title, &path, &aliases_vec);
        Note {
            title: title,
            path,
            content: content.clone(),
            aliases: aliases.clone(),
            ignore,

            _aliases: aliases_vec.clone(),
            _ignore: ignore_vec.clone(),
            _sanitized_content: Note::sanitize_content(content, ignore_vec), // no need to clone anymore
            normalized_link_keys,
            existing_link_counts: HashMap::new(),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn title(&self) -> String {
        self.title.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String {
        self.path.clone()
    }
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

    #[wasm_bindgen(method, js_name = "existingLinkCounts")]
    pub fn existing_link_counts(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.existing_link_counts).unwrap_or(JsValue::NULL)
    }

    #[wasm_bindgen(method, js_name = "setExistingLinkCounts")]
    pub fn set_existing_link_counts(&mut self, counts: JsValue) {
        let parsed = parse_existing_link_counts(counts);
        self.existing_link_counts = parsed;
    }

    #[wasm_bindgen(method, js_name = "toJSON")]
    pub fn to_json_string(&self) -> String {
        serde_json::to_string(self).unwrap()
    }

    #[wasm_bindgen(method, js_name = "fromJSON")]
    pub fn from_json_string(json_string: &str) -> Self {
        let mut note: Note = serde_json::from_str(json_string).unwrap();
        note.normalized_link_keys =
            normalized_link_keys_from(&note.title, &note.path, &note._aliases);
        note
    }
}

impl Note {
    pub fn aliases_vec(&self) -> &Vec<String> {
        &self._aliases
    }
    pub fn ignore_vec(&self) -> &Vec<Range> {
        &self._ignore
    }
    pub fn existing_link_counts_map(&self) -> &HashMap<String, usize> {
        &self.existing_link_counts
    }
    pub fn normalized_link_keys(&self) -> &HashSet<String> {
        &self.normalized_link_keys
    }

    /// Cleans up the note content by:
    /// - removing all parts of the content that are in the ignore list
    fn sanitize_content(mut content: String, ignore_vec: Vec<Range>) -> String {
        let mut _offset: usize = 0;
        let mut _last_start: usize = 9999999;
        // the ignore ranges are sorted
        for ignore in ignore_vec {
            if _last_start == ignore.start() {
                // skip this range
                continue;
            } else {
                _last_start = ignore.start();
            }

            let offset = _offset;
            let range: std::ops::Range<usize> = ignore.clone().into();
            let split_content: Vec<u16> = content.encode_utf16().collect();
            let mut new_content: String = String::new();

            let before_vec_utf_16 = split_content
                .iter()
                .take(range.start + offset)
                .map(|c| c.clone())
                .collect::<Vec<u16>>();

            let before_string = String::from_utf16_lossy(before_vec_utf_16.as_slice());
            new_content.push_str(&before_string);

            let replacement_utf_16_vec = split_content
                .iter()
                .skip(range.start + offset)
                .take(range.end - range.start)
                .map(|c| c.clone())
                .collect::<Vec<u16>>();

            // for the content that should be ignored, we need to push a blank string
            // with the *same* length as the utf-8 slice of the string that should be ignored
            // if we were to simple push a string of the utf-16 length,
            // the regex matching later on would produce false positions

            // utf 16 length
            let replacement_len_utf_16 = replacement_utf_16_vec.len();
            // utf 8 length
            let replacement_len_utf_8 =
                String::from_utf16_lossy(replacement_utf_16_vec.as_slice()).len();
            // now create a string with the same length as the placeholder, but no content
            let placeholder_to_push = create_string_with_n_characters(replacement_len_utf_8, '_');
            _offset += replacement_len_utf_8 - replacement_len_utf_16;
            new_content.push_str(&placeholder_to_push);

            let after_vec_utf_16 = split_content
                .iter()
                .skip(range.end + offset)
                .map(|c| c.clone())
                .collect::<Vec<u16>>();

            let after_string = String::from_utf16_lossy(after_vec_utf_16.as_slice());
            new_content.push_str(&after_string);

            content = new_content
        }

        content
    }

    pub fn get_sanitized_content(&mut self) -> &String {
        if self._sanitized_content.is_empty() {
            self._sanitized_content =
                Note::sanitize_content(self.content.clone(), self._ignore.clone());
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
    array
        .iter()
        .filter_map(|a: JsValue| a.as_string())
        .collect()
}

fn parse_existing_link_counts(value: JsValue) -> HashMap<String, usize> {
    if value.is_undefined() || value.is_null() {
        return HashMap::new();
    }

    let counts: HashMap<String, usize> = from_value(value).unwrap_or_default();
    counts
        .into_iter()
        .filter_map(|(key, count)| {
            normalize_existing_link_key(&key).map(|normalized| (normalized, count))
        })
        .collect()
}
