use js_sys::Array;
use std::collections::HashSet;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::rs::util::preferrable_item::{preferrable_item_vec_to_array, PreferrableItem};

/// A candidate (note) for a Link Match to link to.
#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct LinkTargetCandidate {
    title: String, // the title of the note
    path: String, // the path of the note

    #[serde(rename = "replacement_candidates")]
    _replacement_candidates: Vec<PreferrableItem>, // the possible replacements for the matched text
}

#[wasm_bindgen]
impl LinkTargetCandidate {
    #[wasm_bindgen(getter)]
    pub fn title(&self) -> String { self.title.clone() }

    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String { self.path.clone() }

    #[wasm_bindgen(getter, js_name = "replacementCandidates")]
    pub fn replacement_candidates(&self) -> Array {
        preferrable_item_vec_to_array(self._replacement_candidates.clone())
    }

    #[wasm_bindgen(method, js_name = "deSelectAll")]
    pub fn un_prefer_all(&mut self) {
        for replacement_candidate in &mut self._replacement_candidates {
            replacement_candidate.is_preferred = false;
        }
    }
}

impl LinkTargetCandidate {
    pub fn new(title: String, path: String, aliases: &[String], matched_text: &str) -> Self {
        let mut seen_candidates: HashSet<String> = HashSet::new();
        let mut _replacement_candidates: Vec<PreferrableItem> = vec![];

        let mut case_sensitive_match_index: Option<usize> = None;
        let mut case_insensitive_match_index: Option<usize> = None;

        seen_candidates.insert(title.clone());
        _replacement_candidates.push(PreferrableItem::new(title.clone(), false));
        if title == matched_text {
            case_sensitive_match_index = Some(0);
        } else if title.eq_ignore_ascii_case(matched_text) {
            case_insensitive_match_index = Some(0);
        }

        aliases.iter().for_each(|alias| {
            if seen_candidates.contains(alias) {
                return;
            }

            let candidate_index = _replacement_candidates.len();

            if alias == matched_text && case_sensitive_match_index.is_none() {
                case_sensitive_match_index = Some(candidate_index);
            } else if alias.eq_ignore_ascii_case(matched_text)
                && case_insensitive_match_index.is_none()
            {
                case_insensitive_match_index = Some(candidate_index);
            }

            seen_candidates.insert(alias.clone());
            let replacement_candidate_alias = PreferrableItem::new(alias.clone(), false);
            _replacement_candidates.push(replacement_candidate_alias);
        });

        let preferred_index = case_sensitive_match_index
            .or(case_insensitive_match_index)
            .unwrap_or(0);

        if let Some(preferred_candidate) = _replacement_candidates.get_mut(preferred_index) {
            preferred_candidate.is_preferred = true;
        }

        LinkTargetCandidate {
            title,
            path,
            _replacement_candidates,
        }
    }
}

pub fn link_target_candidate_vec_into_array(link_target_candidates: Vec<LinkTargetCandidate>) -> Array {
    let link_target_candidates_array = Array::new();
    for link_target_candidate in link_target_candidates {
        link_target_candidates_array.push(&link_target_candidate.into());
    }
    link_target_candidates_array
}