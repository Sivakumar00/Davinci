import React from 'react';
import { StyleSheet,AsyncStorage ,Text , View ,StatusBar} from 'react-native';
import { db } from '../config/db';

import Routes from '../Routes';
export default class EmployeeReview extends React.Component {
  render() {
    return (
        <Text>Employee Review </Text>
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