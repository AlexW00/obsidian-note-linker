use std::convert::TryFrom;
use wasm_bindgen::prelude::*;
use crate::rs::util::generic_of_jsval;

#[wasm_bindgen]
pub struct Range {
    pub start: usize,
    pub end: usize,
}

#[wasm_bindgen]
impl Range {
    #[wasm_bindgen(constructor)]
    pub fn new(start: usize, end: usize) -> Range {
        Range {
            start,
            end,
        }
    }
}

impl Range {
    pub fn to_range(&self) -> std::ops::Range<usize> {
        self.start..self.end
    }
}

impl TryFrom<JsValue> for Range {
    type Error = ();
    fn try_from(value: JsValue) -> Result<Self, Self::Error> {
        range_from_js_value(value).ok_or(())
    }
}

#[wasm_bindgen]
pub fn range_from_js_value (js: JsValue) -> Option<Range> {
    generic_of_jsval(js, "Range").unwrap_or(None)
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<Range>")]
    #[derive(Clone, Debug)]
    pub type RangeArray;
}