import React from 'react';
import { StyleSheet,NetInfo,Dimensions, Text, View,AsyncStorage,TouchableOpacity,BackHandler,Platform,Alert } from 'react-native';
import Header from '../components/Header' 
import Assessment from '../components/Assessment';
import RNExitApp from 'react-native-exit-app';
import BottomList from '../components/BottomList';
import { Actions } from 'react-native-router-flux';
const { width } = Dimensions.get('window');


export default class Home extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isConnected:true,
      isManager:true
    }
    this.handleBackButton= this.handleBackButton.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
         
            <Header/>
            {!this.state.isConnected?
                <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>No Internet Connection</Text>
              </View>:null}
            <BottomList isManager={this.state.isManager}/>
      </View>
    );
  }
  
  componentWillMount(){
    AsyncStorage.getItem('user').then((auth)=>{
      fetch('https://people.zoho.com/people/api/getSubOrdinates?authtoken='+auth)
        .then((response)=>response.json())
        .then((responseJson)=>{
          if(responseJson.response.result.length === 0){
            this.setState({isManager:false},function(){
              console.log("isManager :"+this.state.isManager)
              AsyncStorage.setItem('isManager',"false")
            })
          }else{
            AsyncStorage.setItem('isManager',"true" )
          }
        })

    })
  }

  componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress',this.handleBackButton);
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleBackButton = () =>{
    
    if (Actions.state.index === 0) {
      return false
    }
    if(Platform.OS==="android")
      BackHandler.exitApp();
    
    return true
  }

  
  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.handleBackButton);
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);

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
  },
  
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 30
  },
  offlineText: { color: '#fff' }
});

