use std::convert::TryFrom;
use js_sys::Array;
use wasm_bindgen::prelude::*;
use crate::rs::util::generic_of_jsval;
use wasm_bindgen::{JsCast, JsValue};

#[wasm_bindgen]
#[derive(Clone)]
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

impl From<std::ops::Range<usize>> for Range {
    fn from(range: std::ops::Range<usize>) -> Self {
        Range {
            start: range.start,
            end: range.end,
        }
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

impl Into<Vec<Range>> for RangeArray {
    fn into(self) -> Vec<Range> {
        let arr: Result<Array, RangeArray> = self.dyn_into::<Array>();
        match arr {
            Ok(arr) => {
                arr.iter()
                    .filter_map(|js_val_range: JsValue| Range::try_from(js_val_range).ok())
                    .collect()
            },
            Err(_) => vec![]
        }
    }
}