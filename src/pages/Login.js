import React from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native';
import Logo from '../components/Logo'
import LoginForm from '../components/LoginForm'
import { Actions } from 'react-native-router-flux'; 

export default class Login extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Logo/>
        <LoginForm type="Login"/>
      </View>
    );

  }
  
}
const styles = StyleSheet.create({
  container:{
    backgroundColor:'#455a64',
    flexGrow:1,
    alignItems:'center',
    justifyContent:'center'
  },
  text:{
    color:'#e0e0e0',
    fontSize:20
    
  },
  signuptext:{
    alignItems:'center',
    justifyContent:'flex-start',
    color:'white',
    marginBottom:10,
    flexDirection:'row'
  },
  signup:{
    color:'white',
    fontWeight:'bold',
    fontSize:16
  }
});

