import React, { Component } from 'react';
import { StyleSheet,Text,ActivityIndicator, Image,TouchableOpacity, TouchableWithoutFeedback,Alert,AsyncStorage, View ,StatusBar} from 'react-native';
import { db } from '../config/db';
import { Card } from 'react-native-elements';

import { FlatList } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';

export default class QuestionList extends React.Component {

    constructor(props){
        super(props)
       this.state = {
        data: [{ title: 'Assessment - 1', questions: 18 }, 
       ],
          recordId:'',
          isAdmin:false,
         visible:false
       }
    }
   componentWillMount(){
  
   }
     
   componentDidMount(){
    const setState = this.setState.bind(this)
     
    AsyncStorage.getItem('recordId').then((recordId)=>{
      db.ref('Users/').once('value',function(snapshot){
        var getValue = snapshot.child(recordId).child('isAdmin').val();
        console.log("DB value: "+recordId+"  ===> " +getValue);
        if(getValue){
          setState({isAdmin:true})  
        }else{ 
          setState({isAdmin:false})  
        }
        
    })
    })
        // AsyncStorage.getItem('isAdmin')
        //   .then((value)=>{
        //     setState({isAdmin:value})  
        //   })
        //   .catch(e => console.log("=======", e))
        // console.log('did mount :'+this.state.isAdmin);
      
    }
  
   
    addBtnClick(){
      Actions.Question();
    }
    render() {
      console.log('render triggred', this.state.isAdmin)
      return (
       <View style={styles.container}>
        
        <FlatList
          style={{ height:'100%', alignSelf: 'stretch',flexDirection: 'column',}}
          extraData={this.state}
          data = {this.state.data}
          renderItem={({item}) =>
         
         <TouchableWithoutFeedback 
            onPress={()=>this.itemClick(item)}
          >
          <View>
             <Card
                containerStyle={{padding:5,borderRadius:10,backgroundColor:'white',shadowRadius:5}}
                title={item.title}
                titleStyle={{fontSize:18}}>
              <Text style={styles.item}>
                  {item.questions}
              </Text>
             </Card>
          </View>
          
        </TouchableWithoutFeedback > 
         }
       
        />
       
       {this.state.isAdmin ?
           <TouchableOpacity  onPress={() => this.addBtnClick()} style={styles.fab}>
                    <Text style={styles.fabIcon}>+</Text>
           </TouchableOpacity> : null}
       </View>
        
 
      );
    }


} 



const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#455a64',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  
  item:{
    color:'#000', 
    fontSize:15,
    textAlign: 'center',
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
  fab: { 
    position: 'absolute', 
    width: 56, 
    height: 56, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: '#03A9F4', 
    borderRadius: 30, 
    elevation: 8 
    }, 
    fabIcon: { 
      fontSize: 40, 
      color: 'white' 
    }
});
