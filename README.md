# rust2wasm2react-native

This project aims to bridge Rust, WebAssembly (WASM) and React Native together. It allows you to compile Rust code into WASM and then integrate it into a React Native application.

## Prerequisites

Before getting started, make sure you have the following installed:

- Node.js (>=18.0.0)
- Yarn
- Rust (>=1.50.0) with `wasm32-unknown-unknown` target installed
- React Native CLI

## Installation

1. Clone the project repository:

   ```bash
   git clone https://github.com/your-username/rust2wasm2react-native.git
   ```

2. Navigate to the project directory:

   ```bash
   cd rust2wasm2react-native
   ```

3. Install project dependencies using Yarn:

   ```bash
   yarn install
   ```

4. Build the Rust code and copy the generated WASM file:

   ```bash
   sh build.sh
   ```

### Or alternatively, if you want to bootstrap your own one

1. Create a new React Native project using the following command:

   ```shell
   npx react-native init <YourProjectName>
   ```

2. Navigate to the project directory:

   ```shell
   cd <YourProjectName>
   ```

3. Install the required dependencies using Yarn:

   ```shell
   yarn add axios react-native-fs react-native-webassembly base-64 @types/base-64
   ```

## Rust library configuration

1. If you want to go full manual, inside the project directory, you can add new directory <YourRustLibDirectory>

2. Create a new file `lib.rs` inside the <YourRustLibDirectory> and add your Rust code to it.

3. Add a `Cargo.toml` file like the following:

   ```shell
    [package]
    description = "rust2wasm2react-native bridge among Rust, WebAssembly and React-Native"
    edition = "2021"
    license = "MIT"
    name = "rust2wasm2react-native"
    repository = "<https://github.com/xonoxitron/rust2wasm2react-native>"
    version = "0.1.0"

    [lib]
    crate-type = ["cdylib"]

   ```

## Build the Rust **Code**

1. You can use the embedded `build.sh` located the project root directory

2. Make the `build.sh` script executable by running the following command:

   ```shell
   chmod +x build.sh
   ```

3. Build the Rust code and copy the Wasm file to the React Native project by executing the `build.sh` script:

   ```shell
   ./build.sh

This script cleans the `wasm` directory, compiles the Rust code to Wasm using the `rustc` command, and copies the resulting Wasm file to the React Native project's `assets` directory.

## Metro Resolver Configuration

To ensure that Metro, the JavaScript bundler used by React Native, recognizes the Wasm file as an asset, you need to extend the `metro.config.js` file. Follow these steps:

1. Open the `metro.config.js` file in the root directory of your project.

2. Locate the `getDefaultConfig` import at the top of the file:

   ```javascript
   const { getDefaultConfig } = require('metro-config');
   ```

3. Add the following code inside the `module.exports` function:

   ```javascript
   resolver: {
     assetExts: [...assetExts, 'wasm'], // Extend assetExts with 'wasm'
   },
   ```

   The `assetExts` property contains an array of file extensions that Metro considers as assets. By adding `'wasm'` to this array, Metro will recognize Wasm files as assets.

## App Usage

The main entry point of your React Native application is the `App.tsx` file. In this file, you can use the `react-native-webassembly` and `react-native-fs` libraries to load and interact with the Wasm module.

1. Open the `App.tsx` file located in the `ReactNativeWasmBridgeApp` directory.

2. Import the required modules and libraries at the top of the file:

   ```tsx
   import axios from 'axios';
   import RNFS from 'react-native-fs';
   import { decode as atob } from 'base-64';

   import * as WebAssembly from 'react-native-webassembly';
   ```

3. Update the `App` component to include the following code:

```tsx
    const App: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        // Utility function to convert base64 string to ArrayBuffer
        const base64ToArrayBuffer = (base64: string) => {
        const binaryString = atob(base64);
        const length = binaryString.length;
        const arrayBuffer = new ArrayBuffer(length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < length; i++) {
            uintArray[i] = binaryString.charCodeAt(i);
        }

        return arrayBuffer;
        };

        // Load the WebAssembly module remotely from a URL
        const loadWasmRemotely = async () => {
        const { data: bufferSource } = await axios({
            url:
            'https://github.com/torch2424/wasm-by-example/raw/master/examples/hello-world/demo/assemblyscript/hello-world.wasm',
            method: 'get',
            responseType: 'arraybuffer',
        });

        const module = await WebAssembly.instantiate<{
            add: (a: number, b: number) => number;
        }>(bufferSource);

        console.log(module.instance.exports.add(1, 2));
        };

        loadWasmRemotely();

        // Load the WebAssembly module locally from the bundled file
        const loadWasmLocally = async () => {
        try {
            const filePath = `${RNFS.MainBundlePath}/rust_lib.wasm`;

            const fileExists = await RNFS.exists(filePath);
            if (!fileExists) {
            console.log('File does not exist');
            return;
            }

            const content = await RNFS.readFile(filePath, 'base64');
            const bufferSource = base64ToArrayBuffer(content);

            const module = await WebAssembly.instantiate<{
            add: (a: number, b: number) => number;
            }>(bufferSource);

            console.log(module.instance.exports.add(3, 4));
        } catch (error) {
            console.log('Error:', error);
        }
        };

        loadWasmLocally();
    }, []);
```

1. Customize the UI sections inside the `return` statement according to your application's requirements. You can add, remove, or modify the sections as needed.

2. Save the file.

## Usage

To run the React Native application and test the integration with the Rust Wasm module, follow these steps:

1. Make sure you have a device or emulator connected to your development machine.

2. In the project directory, run the following command to start the Metro bundler:

   ```bash
   npx react-native start
   ```

3. Open a new terminal window and run the following command to launch the application on your device or emulator:

   ```bash
   npx react-native run-android   # For Android
   npx react-native run-ios       # For iOS
   ```

   This will build the React Native application and deploy it to the connected device or emulator.

4. Once the application is running, you should see the screen with the sections you defined in the `App.tsx` file.

5. Check the console logs for the output of the Wasm module's functions. You should see the results of calling the `add` function from both the remotely loaded and locally loaded Wasm modules.

   ```bash
   Remote Wasm Result: 3
   Local Wasm Result: 7
   ```

   This confirms that the Rust Wasm module has been successfully integrated into your React Native application.

## Conclusion

Congratulations! You have successfully set up and integrated the Rust Wasm module into your React Native application using `rust2wasm2react-native`. You can now leverage the power of Rust and WebAssembly to enhance the functionality of your mobile application.

Feel free to explore and expand upon this project to suit your specific needs. Happy coding!

---

Please note that this documentation assumes you have basic knowledge of Rust, WebAssembly, and React Native development. If you are new to any of these technologies, it is recommended to familiarize yourself with them before proceeding with this project.

If you encounter any issues or have further questions, please refer to the project repository for additional documentation and support.

Happy coding!
