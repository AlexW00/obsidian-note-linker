use std::ops::Range;
use crate::rs::text::js_range::{JsRange, ToRsRange};

pub struct RsRange {
    pub start: usize,
    pub end: usize,
}

impl RsRange {
    pub fn new(js_range: JsRange) -> RsRange {
        RsRange {
            start: js_range.start(),
            end: js_range.end(),
            }
    }

    pub fn to_range(&self) -> Range<usize> {
        Range {
            start: self.start,
            end: self.end,
        }
    }
}