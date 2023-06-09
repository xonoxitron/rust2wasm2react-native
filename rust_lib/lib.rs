extern "C" {
    fn console_log(ptr: *const u8, len: usize);
}

#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[no_mangle]
pub fn initialize() {
    unsafe {
        console_log(b"Rust Wasm module initialized.\0".as_ptr(), 27);
    }
}
