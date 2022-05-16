use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct JsRange {
    start: usize,
    end: usize,
}

#[wasm_bindgen]
impl JsRange {
    #[wasm_bindgen(constructor)]
    pub fn new(start: usize, end: usize) -> JsRange {
        JsRange {
            start,
            end,
        }
    }
}

pub trait ToRsRange {
    fn start(&self) -> usize;
    fn end(&self) -> usize;
}

impl ToRsRange for JsRange {
    fn start(&self) -> usize {
        self.start.clone()
    }

    fn end(&self) -> usize {
        self.end.clone()
    }
}