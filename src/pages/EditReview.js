import React from 'react';
import { StyleSheet,AsyncStorage ,FlatList,Text , View ,StatusBar} from 'react-native';
import { db } from '../config/db';

export default class EditReview extends React.Component {
    
    constructor(props){
      super(props);
      this.state={
        questions:this.props.item.questions,
        data:this.props.item
      }
    }
    
    editReviewHeader=()=>{
      return(
        <View style ={styles.container}>
          <Text style={styles.itemTitle}>{this.props.item.name}</Text>
          <Text style={styles.item}>{this.props.item.title}</Text>
          <Text style={styles.item}>{this.props.item.startdate+" - "+this.props.item.enddate}</Text>
        </View>
      )
    }
    editReviewList=()=>{
      return(
        <View style={styles.container}>

        </View>
      )
    }

    render() {
    return (
      <View style={styles.container}>
          {this.editReviewHeader()}
          {this.editReviewList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#262d38',
    justifyContent: 'center',
  },
  itemmark:{
    textAlign:'center',fontWeight:'bold',fontSize:20,marginBottom:10,paddingTop:5
  },
  itemTitle:{
    color:'black', 
    fontSize:20,
    fontWeight:'bold',
    textAlign: 'center',
  },
  item:{
    color:'grey', 
    fontSize:16,
    fontWeight:'bold',
    textAlign: 'center',
  },


});