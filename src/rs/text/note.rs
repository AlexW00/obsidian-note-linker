use std::convert::TryFrom;
use wasm_bindgen::prelude::*;
use crate::rs::text::range::{RangeArray};
use crate::rs::util;

#[wasm_bindgen]
pub struct Note {
    title: js_sys::JsString,
    path: js_sys::JsString,
    content: js_sys::JsString,
    aliases: StringArray,
    ignore: RangeArray,
}

#[wasm_bindgen]
impl Note {
    #[wasm_bindgen(constructor)]
    pub fn new(title: js_sys::JsString, path: js_sys::JsString, content: js_sys::JsString, aliases: StringArray, ignore: RangeArray) -> Note {
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

    pub fn aliases(&self) -> StringArray {
        self.aliases.clone()
    }

    pub fn ignore(&self) -> RangeArray {
        self.ignore.clone()
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

    #[wasm_bindgen(typescript_type = "Array<string>")]
    #[derive(Clone, Debug)]
    pub type StringArray;
}
