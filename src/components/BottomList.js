import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Assessment from './Assessment';
import OrganisationalTree from './OrganisationTree';
import MyReview from './MyReview'
import EmployeeReview from './EmployeeReview'
export default class BottomList extends React.Component {

  constructor(props){
    super(props)
    
  }

  render() {
    console.log('bottom list '+this.props.isManager)
    return (
      <ScrollableTabView style={StyleSheet.tab}
        tabBarActiveTextColor='#fff'
        tabBarUnderlineStyle={{ backgroundColor: 'white' }}
        tabBarInactiveTextColor='#90a4ae'
        tabBarPosition='top'
        initialPage={0}
        renderTabBar={() => <ScrollableTabBar />}
      >
      {this.props.isManager ?
        <View tabLabel='Assessments'>
          <Assessment />
        </View>:null}
        {this.props.isManager ?
        <View tabLabel='Sub-Ordinates'>
          <OrganisationalTree />
        </View>:null}
        {this.props.isManager ?
        <View tabLabel='My Reviews'>
          <MyReview />
        </View>:null}
        {this.props.isManager ? null:
          <View tabLabel='My Reviews'>
            <EmployeeReview />
          </View>
        }
      </ScrollableTabView>
    );
  }
}
const styles = StyleSheet.create({
  tab: {
    flexGrow: 1,
    alignItems: 'flex-start'
  }
})
