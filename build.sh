rm -r ./wasm/*.wasm
echo "Compiling Rust to WASM 🦀 <-> 🕸️"
rustc --target wasm32-unknown-unknown --crate-type cdylib ./rust_lib/lib.rs -o ./wasm/rust_lib.wasm
cp ./wasm/rust_lib.wasm ./ReactNativeWasmBridgeApp/assets/rust_lib.wasm
