import React, { Component } from 'react';
import { StyleSheet,Text, Image, AsyncStorage, TouchableOpacity,Alert, View ,StatusBar} from 'react-native';
import { db } from '../config/db';
import QuestionList from './QuestionList';


export default class Assessment extends React.Component {

    
    render() {
      return (
        <QuestionList/>
      );
    }
} 

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#455a64',
    justifyContent: 'center',
  },
});
