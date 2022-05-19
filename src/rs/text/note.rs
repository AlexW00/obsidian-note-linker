use std::convert::TryFrom;
use js_sys::Array;
use wasm_bindgen::prelude::*;
use crate::rs::text::range::{Range, RangeArray};
use crate::rs::util;
use wasm_bindgen::{JsCast, JsValue};
use crate::rs::text::text_util::create_string_with_n_characters;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Note {
    title: js_sys::JsString,
    path: js_sys::JsString,
    content: js_sys::JsString,
    aliases: util::StringArray,
    ignore: RangeArray,
}

#[wasm_bindgen]
impl Note {
    #[wasm_bindgen(constructor)]
    pub fn new(title: js_sys::JsString, path: js_sys::JsString, content: js_sys::JsString, aliases: util::StringArray, ignore: RangeArray) -> Note {
        Note {
            title,
            path,
            content,
            aliases,
            ignore
        }
    }

    pub fn title(&self) -> js_sys::JsString {
        self.title.clone()
    }
    pub fn path(&self) -> js_sys::JsString {
        self.path.clone()
    }
    pub fn content(&self) -> js_sys::JsString {
        self.content.clone()
    }
    pub fn aliases(&self) -> util::StringArray {
        self.aliases.clone()
    }
    pub fn ignore(&self) -> RangeArray {
        self.ignore.clone()
    }
}

impl Note {
    pub fn title_string (&self) -> String { self.title().as_string().expect("title is not a string") }
    pub fn path_string (&self) -> String {
        self.path().as_string().expect("path is not a string")
    }
    pub fn content_string (&self) -> String { self.content().as_string().expect("content is not a string") }
    pub fn aliases_vec (&self) -> Vec<String> { self.aliases().into() }
    pub fn ignore_vec (&self) -> Vec<Range> { self.ignore().into() }

    pub fn sanitized_content(&self) -> String {
        let mut sanitized_content = self.content_string();
        return sanitized_content;
        for ignore in &self.ignore_vec() {
            let range = ignore.to_range();
            let replacement = &*create_string_with_n_characters(range.len(), ' ');
            sanitized_content.replace_range(range, replacement);
        }
        sanitized_content
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
    util::generic_of_jsval(js, "Note").unwrap_or(None)
}


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<Note>")]
    pub type NoteArray;
}


impl Into<Vec<String>> for util::StringArray {
    fn into(self) -> Vec<String> {
        let arr: Result<Array, util::StringArray> = self.dyn_into::<Array>();
        match arr {
            Ok(arr) => arr.iter()
                .filter_map(|a: JsValue| a.as_string())
                .collect(),
            Err(_) => vec![],
        }
    }
}