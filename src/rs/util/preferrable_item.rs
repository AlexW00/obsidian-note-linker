use js_sys::Array;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

/// An item that has a preferred state.
#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct PreferrableItem {
    pub(crate) content: String,
    pub(crate) is_preferred: bool,
}

#[wasm_bindgen]
impl PreferrableItem {
    #[wasm_bindgen(constructor)]
    pub fn new(content: String, is_preferred: bool) -> PreferrableItem {
        PreferrableItem {
            content,
            is_preferred,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn content(&self) -> String { self.content.clone() }
    #[wasm_bindgen(getter, js_name = "isPreferred")]
    pub fn is_preferred(&self) -> bool { self.is_preferred }
}

pub fn preferrable_item_vec_to_array(preferrable_items_vec: Vec<PreferrableItem>) -> Array {
    let preferrable_items_array = Array::new();
    for preferrable_item in preferrable_items_vec {
        preferrable_items_array.push(&preferrable_item.into());
    }
    preferrable_items_array
}