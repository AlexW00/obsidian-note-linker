use std::convert::TryFrom;
use js_sys::Object;
use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;
use crate::rs::text::js_range::JsRange;
use crate::rs::text::rs_range::RsRange;
use crate::rs::util::generic_of_jsval;

#[wasm_bindgen]
pub struct JsNote {
    title: js_sys::JsString,
    path: js_sys::JsString,
    content: js_sys::JsString,
    aliases: js_sys::Array,
    ignore: js_sys::Array,
}

#[wasm_bindgen]
impl JsNote {
    #[wasm_bindgen(constructor)]
    pub fn new(title: js_sys::JsString, path: js_sys::JsString, content: js_sys::JsString, aliases: js_sys::Array, ignore: js_sys::Array) -> JsNote {
        JsNote {
            title,
            path,
            content,
            aliases,
            ignore
        }
    }
}

impl TryFrom<JsValue> for JsNote {
    type Error = ();
    fn try_from(js: JsValue) -> Result<Self, Self::Error> {
        js_note_from_js_value(js).ok_or(())
    }
}

#[wasm_bindgen]
pub fn js_note_from_js_value(js: JsValue) -> Option<JsNote> {
    generic_of_jsval(js, "JsNote").unwrap_or(None)
}


pub trait ToRsNote {
    fn title(&self) -> String;
    fn path(&self) -> String;
    fn content(&self) -> String;
    fn aliases(&self) -> Vec<String>;
    fn ignore(&self) -> Vec<RsRange>;
}

impl ToRsNote for JsNote {
    fn title(&self) -> String {
        self.title.as_string().unwrap()
    }

    fn path(&self) -> String {
        self.path.as_string().unwrap()
    }

    fn content(&self) -> String {
        self.content.as_string().unwrap()
    }

    fn aliases(&self) -> Vec<String> {
        let mut aliases = Vec::new();
        for alias in self.aliases.iter() {
            aliases.push(alias.as_string().unwrap());
        }
        aliases
    }

    fn ignore(&self) -> Vec<RsRange> {
        let mut ignore = Vec::new();
        for range in self.ignore.iter() {
            ignore.push(RsRange::new(JsRange::new(range.as_f64().unwrap() as usize, range.as_f64().unwrap() as usize)));
        }
        ignore
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<JsNote>")]
    pub type JsNoteArray;
}