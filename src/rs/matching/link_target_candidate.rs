use js_sys::Array;
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
    pub fn new(title: String, path: String, aliases: &[String], selected_index: usize) -> Self {
        let mut _replacement_candidates: Vec<PreferrableItem> = vec![];
        let replacement_candidate_title = PreferrableItem::new(title.clone(), selected_index == 0);
        _replacement_candidates.push(replacement_candidate_title);

        aliases.iter().enumerate().for_each(|(index, alias)| {
            let replacement_candidate_alias = PreferrableItem::new(
                alias.clone(),
                // add one because the index starts with the title at 0
                index + 1 == selected_index,
            );
            _replacement_candidates.push(replacement_candidate_alias);
        });

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
