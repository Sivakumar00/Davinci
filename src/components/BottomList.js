import React from 'react';
import { Text ,StyleSheet} from 'react-native';
import { Constants } from 'expo';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Assessment from './Assessment';

export default class BottomList extends React.Component {
  render() {
    return (
      <ScrollableTabView style={StyleSheet.tab}
      tabBarActiveTextColor='#fff'
        tabBarUnderlineStyle={{backgroundColor:'white'}}
        tabBarInactiveTextColor='#90a4ae'
        initialPage={0}
        renderTabBar={() => <ScrollableTabBar />}
      >
        <Text  tabLabel='Assessments'>
          <Assessment/>
        </Text>
        <Text style={{color:'white'}} tabLabel='Organisational Tree'>I am IRON MAN</Text>
      
      </ScrollableTabView>
    );
  }
}
const styles = StyleSheet.create({
  tab:{
    flexGrow:1,
    height:'80%',
    alignItems:'flex-start'
  }
})
