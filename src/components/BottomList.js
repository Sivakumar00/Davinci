import React from 'react';
import { View, Text ,StyleSheet} from 'react-native';
import { Constants } from 'expo';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Assessment from './Assessment';
import OrganisationalTree from './OrganisationTree';

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
        <View  tabLabel='Assessments'>
          <Assessment/>
        </View>
        <View tabLabel='Sub-Ordinates'>
          <OrganisationalTree/>
        </View>
      
      </ScrollableTabView>
    );
  }
}
const styles = StyleSheet.create({
  tab:{
    flexGrow:1,
    
    alignItems:'flex-start'
  }
})
