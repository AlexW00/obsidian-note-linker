use js_sys::{Array};
use wasm_bindgen::prelude::*;
use crate::{log, Note};
use crate::rs::replacer::replacement::Replacement;
use crate::rs::util::range::Range;
use crate::rs::util::wasm_util::generic_of_jsval;

#[wasm_bindgen]
pub struct NoteChangeOperation {
    path: String,
    content: String,
    replacements: Array
}

#[wasm_bindgen]
impl NoteChangeOperation {
    #[wasm_bindgen(constructor)]
    pub fn new(path: String, content: String, replacements: Array) -> Self {
        NoteChangeOperation {
            path,
            content,
            replacements
        }
    }

    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String {self.path.clone()}
    #[wasm_bindgen(getter)]
    pub fn content(&self) -> String {self.content.clone()}
    #[wasm_bindgen(getter)]
    pub fn replacements(&self) -> Array { self.replacements.clone() }
    #[wasm_bindgen(setter)]
    pub fn set_replacements(&mut self, replacements: Array) { self.replacements = replacements }

    #[wasm_bindgen(method, js_name = "applyReplacements")]
    pub fn apply_replacements (&mut self) {
        let mut new_content = self.content.clone();
        // we need to calculate the offset here, because replacements can be
        // shorter/longer than the original text, therefore distorting the position of the replacement
        let mut offset: i16 = 0;

        self.get_unique_replacements().iter().for_each (|replacement: &Replacement| {
            let substitute: &String = &replacement.substitute();
            let mut range: std::ops::Range<usize> = replacement.position().into();

            let offset_range_start = range.start as i16 + offset;
            let offset_range_end = range.end as i16 + offset;
            range.start = if offset_range_start >= 0 { offset_range_start as usize } else { 0 };
            range.end = if offset_range_end >= 0 { offset_range_end as usize } else { 0 };

            let number_of_characters_replaced = range.len() as i16;
            let replacement_length = substitute.len() as i16;

            new_content.replace_range(range, substitute);

            offset += (replacement_length - number_of_characters_replaced);
        });
        self.content = new_content;
    }
}

impl NoteChangeOperation {
    // returns only replacements that do not overlap each other, sorted
    // TODO: Show in the UI, that the filtered out replacements are not applied
    pub fn get_unique_replacements(&self) -> Vec<Replacement> {
        let mut unique_replacements: Vec<Replacement> = Vec::new();
        self.replacements.iter().for_each(|js_replacement: JsValue| {
            let replacement_to_check: Replacement = generic_of_jsval(js_replacement, "Replacement").unwrap();

            if !unique_replacements.iter().any(
                |replacement: &Replacement| {
                    replacement.position().does_overlap(&replacement_to_check.position())
                }
            ) { unique_replacements.push(replacement_to_check) }
        });
        unique_replacements.sort_by(
            |replacement_1: &Replacement, replacement_2: &Replacement| {
                replacement_1.position().start().cmp(&replacement_2.position().start())
            }
        );
        unique_replacements
    }
}