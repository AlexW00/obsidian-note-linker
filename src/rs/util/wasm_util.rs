use js_sys::Array;
use wasm_bindgen::convert::FromWasmAbi;
use wasm_bindgen::prelude::*;
use wasm_bindgen::{JsCast, JsValue};

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
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<string>")]
    #[derive(Clone, Debug)]
    pub type StringArray;
}

impl From<StringArray> for Array {
    fn from(string_array: StringArray) -> Self {
        match string_array.dyn_into::<Array>() {
            Ok(array) => array,
            Err(_) => js_sys::Array::new(),
        }
    }
}

impl From<Vec<String>> for StringArray {
    fn from(string_vec: Vec<String>) -> Self {
        let arr: Array = js_sys::Array::new();
        string_vec.iter().for_each(
            |string| {
                let js: JsValue = JsValue::from_str(string.as_str());
                arr.push(&js);
            }
        );
        arr.unchecked_into::<StringArray>()
    }
}

#[wasm_bindgen]
extern "C" {
    // import console log
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}