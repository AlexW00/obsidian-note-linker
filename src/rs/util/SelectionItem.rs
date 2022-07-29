use js_sys::Array;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use wasm_bindgen::{JsCast, JsValue};

// currently of type String, since generics aren't supported by wasm_bindgen yet
/// A selectable item
#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct SelectionItem {
    content: String,
    is_selected: bool
}

#[wasm_bindgen]
impl SelectionItem {
    #[wasm_bindgen(constructor)]
    pub fn new (content: String, is_selected: bool) -> SelectionItem {
        SelectionItem {
            content,
            is_selected
        }
    }

    #[wasm_bindgen(getter)]
    pub fn content(&self) -> String {self.content.clone()}
    #[wasm_bindgen(getter)]
    pub fn is_selected(&self) -> bool { self.is_selected }
    #[wasm_bindgen(setter)]
    pub fn set_is_selected(&mut self, is_selected: bool) {
        self.is_selected = is_selected;
    }
}

pub fn selection_item_vec_to_array(selection_item_vec: Vec<SelectionItem>) -> Array {
    let mut selection_items = Array::new();
    for selection_item in selection_item_vec {
        selection_items.push(&selection_item.into());
    }
    selection_items
}