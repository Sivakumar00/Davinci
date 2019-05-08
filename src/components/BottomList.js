import React from 'react';
import { StyleSheet, Text, View ,Dimensions,Image,ImageBackground,AsyncStorage,ActivityIndicator} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';


const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
  );
const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
  );

export default class BottomList extends React.Component {

   state = {
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ],
  };
  
  render() {
    return (
        <TabView
            navigationState={this.state}
            renderScene={SceneMap({
                first: FirstRoute,
                second: SecondRoute,
            })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    ); 
  }
}
 
const styles=StyleSheet.create({

    scene: {
        flexGrow: 1,
      },
  
}); 