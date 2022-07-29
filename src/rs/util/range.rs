use std::convert::TryFrom;

use js_sys::{Array};
use thiserror::Error;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

use crate::rs::util::wasm_util::generic_of_jsval;

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct Range {
    start: usize,
    end: usize,
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

    #[wasm_bindgen(getter)]
    pub fn start(&self) -> usize { self.start }

    #[wasm_bindgen(getter)]
    pub fn end(&self) -> usize { self.end }

    #[wasm_bindgen]

    pub fn to_json (&self) -> String {
        serde_json::to_string(&self).unwrap()
    }

    pub fn is_equal_to(&self, range: &Range) -> bool {
        self.start == range.start && self.end == range.end
    }

    pub fn does_overlap(&self, range: &Range) -> bool {
        self.start <= range.end && range.start <= self.end
    }
}

impl Into<std::ops::Range<usize>> for Range {
    fn into(self) -> std::ops::Range<usize> {
        std::ops::Range {
            start: self.start,
            end: self.end,
        }
    }
}

#[derive(Debug, Error)]
pub enum RangeError {
    #[error("Range is faulty")]
    Faulty,
    #[error("Range cast failed")]
    Cast,
}

impl TryFrom<JsValue> for Range {
    type Error = RangeError;
    fn try_from(value: JsValue) -> Result<Self, RangeError> {
        range_from_js_value(value.clone()).ok_or(RangeError::Cast)
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
    let result = generic_of_jsval(js, "Range");
    if let Ok(range) = result {
        Some(range)
    } else {
        None
    }
}

pub fn array_to_range_vec (range_array: Array) -> Vec<Range> {
    range_array.iter()
        .filter_map(|js_val_range: JsValue|
            generic_of_jsval(js_val_range, "Range").ok())
        .collect()
}