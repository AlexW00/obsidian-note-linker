use std::convert::TryFrom;

use js_sys::Array;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;

use crate::rs::text::text_util::{create_string_with_n_characters, get_nearest_char_boundary};
use crate::rs::util::range::{Range, RangeArray};
use crate::rs::util::wasm_util::{generic_of_jsval, StringArray};

#[wasm_bindgen]
#[derive(Clone)]
pub struct Note {
    title: js_sys::JsString,
    path: js_sys::JsString,
    content: js_sys::JsString,
    aliases: StringArray,
    ignore: RangeArray,

    _title: String,
    _path: String,
    _content: String,
    _aliases: Vec<String>,
    _ignore: Vec<Range>,
}

#[wasm_bindgen]
impl Note {
    #[wasm_bindgen(constructor)]
    pub fn new(title: js_sys::JsString, path: js_sys::JsString, content: js_sys::JsString, aliases: StringArray, ignore: RangeArray) -> Note {
        Note {
            title: title.clone(),
            path: path.clone(),
            content: content.clone(),
            aliases: aliases.clone(),
            ignore: ignore.clone(),

            _title: title.as_string().expect("title is not a string"),
            _path: path.as_string().expect("path is not a string"),
            _content: content.as_string().expect("content is not a string"),
            _aliases: aliases.into(),
            _ignore: Vec::from(ignore),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn title(&self) -> js_sys::JsString {
        self.title.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn path(&self) -> js_sys::JsString {
        self.path.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn content(&self) -> js_sys::JsString {
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
    pub fn title_string(&self) -> &String {
        &self._title
    }
    pub fn path_string(&self) -> &String {
        &self._path
    }
    pub fn content_string(&self) -> &String {
        &self._content
    }
    pub fn aliases_vec(&self) -> &Vec<String> {
        &self._aliases
    }
    pub fn ignore_vec (&self) -> &Vec<Range> {
        &self._ignore
    }

    pub fn sanitized_content(&self) -> String {
        let mut content = self.content_string().clone();
        for ignore in self.ignore_vec() {
            let start = ignore.start_usize();
            let end = ignore.end_usize();
            let from = get_nearest_char_boundary(&content, start, true);
            let to = get_nearest_char_boundary(&content, end, false);
            content = content.replace(&content[from..to], &create_string_with_n_characters(end - start, ' '));
        }
        content
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