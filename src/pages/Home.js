import React from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity,BackHandler,Platform,Alert } from 'react-native';
import Header from '../components/Header' 
import Assessment from '../components/Assessment';
import RNExitApp from 'react-native-exit-app';
import BottomList from '../components/BottomList';


export default class Home extends React.Component {
  constructor(props){
    super(props)
    this.handleBackButton= this.handleBackButton.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
         
            <Header/>
            <BottomList/>
      </View>
    );
  }
  
  componentDidMount(){
    if(Platform.OS=='android'){
      BackHandler.addEventListener('hardwareBackPress',this.handleBackButton);
    }
  }

  handleBackButton = () =>{
    
    BackHandler.exitApp();
    RNExitApp.exitApp();
    
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackButton);
  }

}
const styles = StyleSheet.create({
  container:{
    backgroundColor:'#455a64',
    flexGrow:1,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  profilecontainer:{
    width:500,
    height:200,
    backgroundColor:'#263238',
    flexGrow:1,
    justifyContent:'flex-end',
    alignItems:'center'   
  },
  profileImgContainer: {
    marginLeft: 8,
    marginTop:10,
    marginBottom:8,
    height: 100,
    width: 100,
    borderRadius: 40,
    alignItems:'center',
    justifyContent:'flex-start'
  },
  employeename:{
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
    color:'white',
    marginBottom:8
  },
  employeeposition:{
    textAlign:'center',
    fontSize:16,
    marginBottom:8,
    color:'white'
  }
});

