use js_sys::Array;
use wasm_bindgen::convert::FromWasmAbi;
use wasm_bindgen::prelude::*;
use wasm_bindgen::{JsCast, JsValue};
use serde::{Serialize, Deserialize};
extern crate console_error_panic_hook;
use std::panic;

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
pub fn init_panic_hook () {
    console_error_panic_hook::set_once();
}

pub fn string_vec_to_array (string_vec: &Vec<String>) -> Array {
    let arr: Array = js_sys::Array::new();
    string_vec.iter().for_each(
        |string| {
            let js: JsValue = JsValue::from_str(string.as_str());
            arr.push(&js);
        }
    );
    arr.unchecked_into::<Array>()
}

#[wasm_bindgen]
extern "C" {
    // import console log
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

pub trait JsonSerializable {
    fn to_json_string(&self) -> String;
}