import React from 'react';
import { StyleSheet,Text  , View ,StatusBar} from 'react-native';
import Carousel from 'react-native-snap-carousel';
export default class OrganisationalTree extends React.Component {

    constructor(props){
        super(props)
        this.state={
            userId:'',
            userEmail:'',
            userName:'',
            
        }
    }

  render() {
    return (
       <Text></Text>
    );
  }
} 

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    height:100,
    backgroundColor: '#455a64',
    justifyContent: 'center',
  }
});