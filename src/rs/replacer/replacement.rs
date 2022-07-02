use std::cmp::Ordering;
use wasm_bindgen::prelude::*;
use crate::rs::util::range::Range;

#[wasm_bindgen]
pub struct Replacement {
    position: Range,
    substitute: String
}

#[wasm_bindgen]
impl Replacement {
    #[wasm_bindgen(constructor)]
    pub fn new(position: Range, substitute: String) -> Self {
        Replacement {
            position,
            substitute
        }
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Range {self.position.clone()}
    #[wasm_bindgen(getter)]
    pub fn substitute(&self) -> String { self.substitute.clone() }
}