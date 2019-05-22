import React, { Component } from 'react';
import { StyleSheet, Text, ActivityIndicator, RefreshControl, Image, TouchableOpacity, TouchableWithoutFeedback, Alert, AsyncStorage, View, StatusBar } from 'react-native';
import { db } from '../config/db';
import Toast from 'react-native-simple-toast';
import { Card } from 'react-native-elements';
import Modal from "react-native-modal";
import { FlatList } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';

export default class QuestionList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      recordId: '',
      isAdmin: false,
      visible: false,
      mydata: [],
      isRefreshing: true,
      isModalVisible: false,
      assessmentItem:{},
    }

    this.longPressItem = this.longPressItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {

  }

  _loadInitialState = async () => {
    var resultJson = {};
    console.log("_load called")
    fetch('https://people.zoho.com/people/api/getSubOrdinates?authtoken=6e13da6b433aecfb0236a5ba09632032')
      .then(response => response.text())
      .then((response) => {
        var str = response;
        str = str.replace(/\d{18}/g, function (x) {
          return '"' + x + '"';
        })
        return JSON.parse(str);
      })
      .then((responseJson) => {
        var json = responseJson.response.result;
        var temp = {
          "recordId": "249048000000917199",
          "employeeLname": "NS",
          "employeeFname": "Devaraj",
          "employeeId": "VBI10117",
          "employemailId": "devarajns@visualbi.com",
          "reportingTo": ""
        }
        json.push(temp);

        //to get immediate team
        var myData = [];
        for (var i = 0; i < json.length; i++) {
          var temp1 = json[i];
          if (temp1.reportingTo === this.state.recordId) {
            myData.push(temp1)
          }
        }
        this.setState({ mydata: myData });
        console.log(JSON.stringify(this.state.mydata))
        // var tree = unflatten(json);
        // this.setState({data:tree});
      })
      if(this.state.isRefreshing){
        this.setState({isRefreshing:false})
      }
  }
  onRefresh = () => {
    this.setState({ data: [] }, function () {
      this.getData();
    });

  }

  componentDidMount() {

    const setState = this.setState.bind(this)
    AsyncStorage.getItem('recordId').then((recordId) => {
      setState({ recordId: recordId })
      db.ref('Users/').once('value', function (snapshot) {
        var getValue = snapshot.child(recordId).child('isAdmin').val();
        console.log("DB value: " + recordId + "  ===> " + getValue);
        if (getValue) {
          setState({ isAdmin: true })
        } else {
          setState({ isAdmin: false })
        }

      })
    })
    //getting the created assessments
    this.getData()
    this._loadInitialState()
  }

  getData() {

    const setState = this.setState.bind(this)
    var tempArr = this.state.data;

    db.ref('Questions').on('value', function (snapshot) {

      snapshot.forEach(function (childSnapshot) {
        childSnapshot.forEach(function (_childSnapshot) {
          console.log(_childSnapshot.child('createdby').val());
          console.log("value " + JSON.stringify(_childSnapshot.val()));
          tempArr.push(_childSnapshot.val())
        })
      })

    })
    setState({ isRefreshing: false })
    setState({ data: tempArr })
    console.log(this.state.data)
  }

  addBtnClick() {
    Actions.Question();
  }

  longPressItem(item, index) {
    const setState = this.setState.bind(this)
    console.log(index);
    Alert.alert(
      'Deleting the Assessment',
      //body
      'Are you sure ?',
      [
        {
          text: 'Yes', onPress: () => {
            AsyncStorage.getItem('recordId').then((recordId) => {
              var key = item.key;
              var rec_id = item.createdby;
              console.log("difference " + recordId.toString() + " " + rec_id)
              if (recordId.toString() === rec_id) {
                db.ref('/Questions/' + rec_id + '/' + key).remove().then(function () {
                  Toast.show('Assessment Removed ..! Swipe to refresh', Toast.LONG)
                  //setState({isRefreshing:true})
                }).catch((error) => {
                  console.log("ERROR " + error)
                  Toast.show('Problem Occured :' + error)
                });
              } else {
                Toast.show("You don't have access to delete it..!")
              }

            })
          }
        },
        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
    );
  }

  //assessment onClickListener
  itemClick(item) {
    //getting the sub-ordinates 
    this.setState({isModalVisible:true,
              assessmentItem:item},function(){
      console.log("modal displayed..!")
      
    })
  }


  render() {

    //console.log('render triggred', JSON.stringify(this.state.data))
    return (
      <View style={styles.container}>

        <FlatList
          style={{ height: '100%', marginBottom: 10, alignSelf: 'stretch', flexDirection: 'column', }}
          extraData={this.state}
          data={this.state.data}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          renderItem={({ item, index }) =>

            <TouchableWithoutFeedback
              onPress={() => this.itemClick(item)}
              onLongPress={() => this.longPressItem(item, index)}
            >
              <View>
                <Card
                  containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                  title={item.title}
                  titleStyle={{ fontSize: 18 }}>
                  <Text style={styles.item}>
                    {item.fromdate} - {item.todate}
                  </Text>
                </Card>
              </View>

            </TouchableWithoutFeedback >
          }

        />

        {this.state.isAdmin ?
          <TouchableOpacity onPress={() => this.addBtnClick()} style={styles.fab}>
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity> : null}

        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ backgroundColor: 'rgba(238,238,238,1)', borderRadius: 20, padding: 10, flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: '#1e88e5', fontSize: 18,marginBottom:10, fontWeight: 'bold', textAlign: 'center' }}>Select the Sub-Ordinate</Text>
            <FlatList
              style={{ height: '100%', marginBottom: 10, alignSelf: 'stretch', flexDirection: 'column', }}
              extraData={this.state}
              data={this.state.mydata}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._loadInitialState.bind(this)}
                />
              }
              renderItem={({ item, index }) =>

                <TouchableWithoutFeedback
                  onPress={() => {
                    console.log(JSON.stringify(item))
                    this.setState({isModalVisible:false},function(){
                      Actions.review({item:item,assessmentItem:this.state.assessmentItem})
                    });

                  }}>
                  <View>
                    <Card
                      containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                      title={item.employeeFname +" "+item.employeeLname}
                      titleStyle={{ fontSize: 18 }}>
                      <Text style={styles.item}>
                        {item.employeeId}
                      </Text>
                    </Card>
                  </View>

                </TouchableWithoutFeedback >
              }
            />
            <TouchableOpacity style={{ backgroundColor: '#1e88e5', paddingLeft: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 30, marginBottom: 10 }} onPress={() => { this.setState({ isModalVisible: false }) }} >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>


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

  item: {
    color: '#000',
    fontSize: 15,
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
