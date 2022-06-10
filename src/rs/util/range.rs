use std::convert::TryFrom;

use js_sys::{Array};
use thiserror::Error;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;

use crate::rs::util::wasm_util::generic_of_jsval;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Range {
    start: js_sys::Number,
    end: js_sys::Number,

    _start: usize,
    _end: usize,
}

#[wasm_bindgen]
impl Range {
    #[wasm_bindgen(constructor)]
    pub fn new(start: js_sys::Number, end: js_sys::Number) -> Range {
        Range {
            start: start.clone(),
            end: end.clone(),
            _start: start.as_f64().unwrap() as usize,
            _end: end.as_f64().unwrap() as usize,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn start(&self) -> js_sys::Number {
        self.start.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn end(&self) -> js_sys::Number {
        self.end.clone()
    }

}

impl Range {
    pub fn new_with_usize(start: usize, end: usize) -> Range {
        Range {
            start: usize_to_number(start),
            end: usize_to_number(end),
            _start: start,
            _end: end,
        }
    }

    pub fn start_usize(&self) -> usize {
        self._start
    }

    pub fn end_usize(&self) -> usize {
        self._end
    }

    pub fn to_range(&self) -> std::ops::Range<usize> {
        self._start..self._end
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
            start: usize_to_number(range.start),
            end: usize_to_number(range.end),
            _start: range.start,
            _end: range.end,
        }
    }
}

pub fn usize_to_number (value: usize) -> js_sys::Number {
    js_sys::Number::from(value as f64)
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

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<Range>")]
    #[derive(Clone, Debug)]
    pub type RangeArray;
}


impl From<RangeArray> for Vec<Range> {
    fn from(range_array: RangeArray) -> Self {
        let arr: Result<Array, RangeArray> = range_array.dyn_into::<Array>();
        arr.map_or(vec![], |array: Array| {
            array.iter()
                .filter_map(|js_val_range: JsValue|
                    generic_of_jsval(js_val_range, "Range").ok())
                .collect()
        })
    }
}