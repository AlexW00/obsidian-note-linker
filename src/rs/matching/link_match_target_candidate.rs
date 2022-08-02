use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::{JsCast, JsValue};
use serde::{Serialize, Deserialize};

use crate::rs::util::SelectionItem::{selection_item_vec_to_array, SelectionItem};
use crate::rs::util::wasm_util::{generic_of_jsval};

/// A candidate note for a matching to matching to
#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct LinkTargetCandidate {
    title: String,
    path: String,

    #[serde(rename = "replacement_selection_items")]
    _replacement_selection_items: Vec<SelectionItem>
}

// TODO: Rename ->LinkTargetCandidate
#[wasm_bindgen]
impl LinkTargetCandidate {
    #[wasm_bindgen(getter)]
    pub fn title(&self) -> String { self.title.clone() }
    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String { self.path.clone() }
    #[wasm_bindgen(getter)]
    pub fn replacement_selection_items(&self) -> Array {
        selection_item_vec_to_array(self._replacement_selection_items.clone())
    }
    #[wasm_bindgen]
    pub fn de_select_all(&mut self) {
        for selection_item in &mut self._replacement_selection_items {
            selection_item.set_is_selected(false);
        }
    }
}

impl LinkTargetCandidate {
    //TODO: Change parameters -> &Note ?
    pub fn new (title: String, path: String, aliases: &Vec<String>, selected_index: usize) -> Self {
        let mut _replacement_selection_items: Vec<SelectionItem> = vec![];

        let selection_title = SelectionItem::new(title.clone(), selected_index == 0);
        _replacement_selection_items.push(selection_title);

        aliases.into_iter().enumerate().for_each(|(index, alias)|{
            let selection_alias = SelectionItem::new(
                alias.clone(),
                // add one because the index starts with the title at 0
                index + 1 == selected_index
            );
            _replacement_selection_items.push(selection_alias);
        });
        LinkTargetCandidate {
            title,
            path,
            _replacement_selection_items
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
