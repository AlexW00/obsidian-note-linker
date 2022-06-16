use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::{JsCast, JsValue};

use crate::rs::note::note::Note;
use crate::rs::util::SelectionItem::SelectionItem;
use crate::rs::util::wasm_util::{generic_of_jsval, StringArray};

/// A candidate note for a matching to matching to
#[wasm_bindgen]
pub struct LinkTargetCandidate {
    title: String,
    path: String,
    replacement_selection_items: Array,
}

// TODO: Rename ->LinkTargetCandidate
#[wasm_bindgen]
impl LinkTargetCandidate {
    #[wasm_bindgen(getter)]
    pub fn title(&self) -> String { self.title.clone() }
    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String { self.path.clone() }
    #[wasm_bindgen(getter)]
    pub fn replacement_selection_items(&self) -> Array { self.replacement_selection_items.clone() }
    #[wasm_bindgen]
    pub fn de_select_all(&mut self) {
        let new_arr : Array = Array::new();
        self.replacement_selection_items.iter().for_each(|js: JsValue| {
            let mut selection: SelectionItem = generic_of_jsval(js, "SelectionItem").unwrap();
            selection.set_is_selected(false);
            let js_selection: JsValue = selection.into();
            new_arr.push(&js_selection);
        });
        self.replacement_selection_items = new_arr;
    }
}

impl LinkTargetCandidate {
    //TODO: Change parameters -> &Note ?
    pub fn new (title: String, path: String, aliases: &Vec<String>, selected_index: usize) -> Self {
        let mut replacement_selection_items = Array::new();
        let selection_title = SelectionItem::new(title.clone(), selected_index == 0);
        replacement_selection_items.push(&selection_title.into());
        aliases.into_iter().enumerate().for_each(|(index, alias)|{
            let selection_alias = SelectionItem::new(
                alias.clone(),
                // add one because the index starts with the title at 0
                index + 1 == selected_index
            );
            replacement_selection_items.push(
                &selection_alias.into()
            );
        });
        LinkTargetCandidate {
            title,
            path,
            replacement_selection_items
        }
    }
}
