use fancy_regex::Match;
use crate::rs::text::link_target::LinkTarget;
use crate::rs::text::range::Range;
use crate::rs::text::text_context::TextContext;
use wasm_bindgen::{JsCast, JsValue};
use js_sys::{Array, JsString};
use wasm_bindgen::prelude::*;
use crate::link_matcher::RegexMatch;
use crate::Note;

#[wasm_bindgen]
pub struct TextLinkMatch {
    position: Range,
    matched_text: String,
    context: TextContext,
    link_target_candidates: Array
}

#[wasm_bindgen]
impl TextLinkMatch {
    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Range { self.position.clone() }
    #[wasm_bindgen(getter)]
    pub fn matched_text(&self) -> String { self.matched_text.clone() }
    #[wasm_bindgen(getter)]
    pub fn context(&self) -> TextContext { self.context.clone() }
    #[wasm_bindgen(getter)]
    pub fn link_target_candidates(&self) -> Array { self.link_target_candidates.clone() }
}

impl TextLinkMatch {
    pub fn new(position: Range, matched_text: String, context: TextContext, link_target_candidates_vec: Vec<LinkTarget>) -> Self {
        let link_target_candidates: Array = js_sys::Array::new();
        for link_target in link_target_candidates_vec {
                link_target_candidates.push(&link_target.into());
        }
        TextLinkMatch {
            position,
            matched_text,
            context,
            link_target_candidates
        }
    }

    pub fn new_from_match(regex_match: &RegexMatch, note: &Note, target_note: &Note) -> Self {
        let link_target_candidates: Vec<LinkTarget> = vec![target_note.into()];
        Self::new(
            regex_match.position.clone(),
            regex_match.matched_text.clone(),
            TextContext::new(note, regex_match.position.clone(), JsString::from(regex_match.matched_text.clone())),
            link_target_candidates
        )
    }
}