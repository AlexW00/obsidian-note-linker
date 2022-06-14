use wasm_bindgen::prelude::*;

// currently of type String, since generics aren't supported by wasm_bindgen yet
/// A selectable item
#[wasm_bindgen]
pub struct SelectionItem {
    content: String,
    is_selected: bool
}

#[wasm_bindgen]
impl SelectionItem {
    #[wasm_bindgen(constructor)]
    pub fn new (content: String, is_selected: bool) -> SelectionItem {
        SelectionItem {
            content,
            is_selected
        }
    }

    #[wasm_bindgen(getter)]
    pub fn content(&self) -> String {self.content.clone()}
    #[wasm_bindgen(getter)]
    pub fn is_selected(&self) -> bool { self.is_selected }
    #[wasm_bindgen(setter)]
    pub fn set_is_selected(&mut self, is_selected: bool) {
        self.is_selected = is_selected;
    }
}
