import React from 'react';
import { StyleSheet, Text, View ,Image,ImageBackground,AsyncStorage,ActivityIndicator} from 'react-native';
import { db } from '../config/db';


export default class Header extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            username:'',
            userEmail:'',
            position:'',
            userId:'',
            showProgress:true,
            isLoading:true,
            image:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png',
            
        } 
    }
    openProgress=()=>{
        this.setState({showProgress:true});
    }
    hideProgress=()=>{   
        this.setState({showProgress:false});
    } 
    componentDidMount(){
        this._loadInitialState().done(); 
    }
    _loadInitialState= async()=>{

        // to fetch employee details https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken=9c69640f94ebb37f50ca148734b2c5e4&searchColumn=EMPLOYEEMAILALIAS&searchValue=charless@zykler.com


        var value = await AsyncStorage.getItem('user');
        var userEmail = await AsyncStorage.getItem('userEmail');
        
        if(value !== null){
            console.log("user id :"+value);
            this.setState({userId:value});
            this.setState({userEmail:userEmail});
            console.log(this.state.userEmail);

            fetch( 'https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken='+value+'&searchColumn=EMPLOYEEMAILALIAS&searchValue='+this.state.userEmail)
                .then((response) => response.json())
                .then((responseJson)=>{
                    var json=responseJson[0];
                    console.log(json.Photo);
                    this.saveUserID(json.recordId);
                    this.setState({
                            isLoading:false,
                            image:responseJson[0].Photo,
                            username:json['First Name'],
                            position:responseJson[0].Title      
                        }) 

                    var storeData = {
                        userEmail:this.state.userEmail,
                        userName:this.state.username,
                        userPosition:this.state.position,
                        userPhoto:json.Photo,
                    }

                    AsyncStorage.setItem('recordId',json.recordId);

                    db.ref('/Users/'+json.recordId).once('value',function(snapshot){
                        if(!snapshot.exists()){
                            db.ref('/Users/'+json.recordId).set(storeData)
                            .then((data)=>{
                                console.log("Data inserted ..!")
                            }).catch((error)=>{
                                console.error(error)
                            })
                        }
                    })

                })
            
        }
        this.hideProgress();
    }
    saveUserID = async userId =>{
        try{
          await AsyncStorage.setItem('recordId',userId);
          console.log(await AsyncStorage.getItem('recordId'))

        }catch(error){
            console.error(error);
  
        }
      }
  render() {
    return (
     <ImageBackground style={styles.headerbackground} source={require('../images/visualbi_logo.png')}>
        <View style={styles.header}>
            <View style={styles.profilePicWrap}>
                <Image style={styles.profilepic} source={{uri: this.state.image}}></Image>
            </View>

            <Text style={styles.name}>{this.state.username}</Text>
            <Text style={styles.position}>{this.state.position}</Text>
            <ActivityIndicator animating={this.state.isLoading}/>
        </View>
     </ImageBackground>
    ); 
  }
}
 
const styles=StyleSheet.create({

    headerbackground:{
        flex:1,
        width:null,
        maxHeight:200,
        alignSelf:'stretch'
    },
    header:{
        alignItems:'center',
        padding:20,
        maxHeight:200,
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    profilePicWrap:{
        width:100,
        height:100,
        marginTop:10,
        borderRadius:100,
        borderColor:'rgba(0,0,0,0.4)',
        borderWidth:16,
    },
    profilepic:{
        flex:1,
        width:null,
        alignSelf:'stretch',
        borderRadius:100,
        borderColor:'#fff',
        borderWidth:4,
    },
    name:{
        marginTop:10,
        fontSize:19,
        color:'#fff',
        fontWeight:'bold'
    },
    position:{
        fontSize:14,
        color:'#fff',
        fontWeight:'300',
        fontStyle:'italic'
    }

}); 