import React from 'react';
import { StyleSheet,AsyncStorage  , View ,StatusBar} from 'react-native';
import { db } from './src/config/db';

import Routes from './src/Routes';
export default class App extends React.Component {
  render() {
    return (
              <Routes />    
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#455a64',
    justifyContent: 'center',
  }
});