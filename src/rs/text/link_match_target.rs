use wasm_bindgen::prelude::*;
use crate::Note;
use crate::rs::util::{generic_of_jsval, StringArray};
use wasm_bindgen::{JsCast, JsValue};

#[wasm_bindgen]
pub struct LinkTarget {
    title: js_sys::JsString,
    path: js_sys::JsString,
    aliases: StringArray,
}

#[wasm_bindgen]
impl LinkTarget {
    #[wasm_bindgen(constructor)]
    pub fn new(title: js_sys::JsString, path: js_sys::JsString, aliases: StringArray) -> LinkTarget {
        LinkTarget {
            title,
            path,
            aliases,
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
    pub fn aliases(&self) -> StringArray {
        self.aliases.clone()
    }
}

impl LinkTarget {
    pub fn new_from_note(note: &Note) -> LinkTarget {
        LinkTarget {
            title: note.title(),
            path: note.path(),
            aliases: note.aliases(),
        }
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<LinkTarget>")]
    #[derive(Clone)]
    pub type LinkTargetArray;

    // push function
    #[wasm_bindgen(method, js_name = "push")]
    pub fn push(this: &LinkTargetArray, value: LinkTarget);

}

impl LinkTargetArray {
    pub fn new() -> Self {
        LinkTargetArray::from(vec![])
    }
    pub fn concat(&mut self, other: LinkTargetArray) {
        let array : js_sys::Array = other.into();
        for item in array.iter() {
            let link_target = generic_of_jsval(item, "LinkTarget").unwrap();
            self.push(link_target);
        }
    }
}


impl From<LinkTargetArray> for js_sys::Array {
    fn from(note_match_array: LinkTargetArray) -> Self {
        match note_match_array.dyn_into::<js_sys::Array>() {
            Ok(array) => array,
            Err(_) => js_sys::Array::new(),
        }
    }
}

impl From<Vec<LinkTarget>> for LinkTargetArray {
    fn from(note_match_array: Vec<LinkTarget>) -> Self {
        let mut array = LinkTargetArray::new();
        for item in note_match_array {
            LinkTargetArray::push(&array, item);
        }
        array
    }
}