/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import axios from 'axios';
import RNFS from 'react-native-fs';
import {decode as atob} from 'base-64';

import * as WebAssembly from 'react-native-webassembly';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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

  const loadWasmRemotely = async () => {
    const {data: bufferSource} = await axios({
      url: 'https://github.com/torch2424/wasm-by-example/raw/master/examples/hello-world/demo/assemblyscript/hello-world.wasm',
      method: 'get',
      responseType: 'arraybuffer',
    });

    const module = await WebAssembly.instantiate<{
      add: (a: number, b: number) => number;
    }>(bufferSource);

    console.log(module.instance.exports.add(1, 2));
  };

  loadWasmRemotely();

  const loadWasmLocally = async () => {
    try {
      const filePath = RNFS.MainBundlePath + '/rust_lib.wasm';

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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
