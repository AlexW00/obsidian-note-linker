extern crate console_error_panic_hook;

use std::panic;

use js_sys::Array;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::convert::FromWasmAbi;
use wasm_bindgen::prelude::*;

/// Creates an generic of a JsValue
/// Code from: https://github.com/rustwasm/wasm-bindgen/issues/2231
pub fn generic_of_jsval<T: FromWasmAbi<Abi=u32>>(js: JsValue, classname: &str) -> Result<T, JsValue> {
    use js_sys::{Object, Reflect};
    let ctor_name = Object::get_prototype_of(&js).constructor().name();
    if ctor_name == classname {
        let ptr = Reflect::get(&js, &JsValue::from_str("ptr"))?;
        let ptr_u32: u32 = ptr.as_f64().ok_or(JsValue::NULL)? as u32;
        let foo = unsafe { T::from_abi(ptr_u32) };
        Ok(foo)
    } else {
        Err(JsValue::NULL)
    }
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
extern "C" {
    // import console log
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}