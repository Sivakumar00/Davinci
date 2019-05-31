import React from 'react';
import { StyleSheet,AsyncStorage ,FlatList , View ,StatusBar} from 'react-native';
import { db } from './src/config/db';

export default class EditReview extends React.Component {
    
    constructor(props){
      super(props);
      this.state={

      }
    }
    
    render() {
    return (
      <View style={styles.container}>
          <FlatList
            data={this.props.item}
            refreshControl={
              
            }
          />
      </View>
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