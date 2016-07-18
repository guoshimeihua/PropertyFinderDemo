/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
} from 'react-native';
import SearchPage from './SearchPage';

class PropertyFinder extends Component {
  render() {
    return(
      <NavigatorIOS
        initialRoute={{
          title: 'My Initial Scene',
          component: SearchPage,
        }}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('PropertyFinder', () => PropertyFinder);
