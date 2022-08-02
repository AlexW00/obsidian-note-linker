use std::cmp::Ordering;
use wasm_bindgen::prelude::*;
use crate::rs::util::range::Range;

#[wasm_bindgen]
pub struct Replacement {
    position: Range,
    substitute: String,

    originalSubstitute: String,
    targetNotePath: String,
}

#[wasm_bindgen]
impl Replacement {
    #[wasm_bindgen(constructor)]
    pub fn new(position: Range, substitute: String, originalSubstitute: String, targetNotePath: String) -> Self {
        Replacement {
            position,
            substitute,
            originalSubstitute,
            targetNotePath
        }
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Range {self.position.clone()}
    #[wasm_bindgen(getter)]
    pub fn substitute(&self) -> String { self.substitute.clone() }
    #[wasm_bindgen(getter)]
    pub fn originalSubstitute(&self) -> String { self.originalSubstitute.clone() }
    #[wasm_bindgen(getter)]
    pub fn targetNotePath(&self) -> String { self.targetNotePath.clone() }
}