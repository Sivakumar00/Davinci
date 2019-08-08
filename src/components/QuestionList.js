import React, { Component } from 'react';
import { StyleSheet, Text, Platform, ActivityIndicator, TouchableHighlight, RefreshControl, Image, TouchableOpacity, TouchableWithoutFeedback, Alert, AsyncStorage, View, StatusBar, FlatList } from 'react-native';
import { db } from '../config/db';
import Toast from 'react-native-root-toast';
import { Card, CheckBox, Overlay } from 'react-native-elements';
import Modal from "react-native-modal";
import { Actions } from 'react-native-router-flux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import moment from "moment";
const MMM=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
export default class QuestionList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      recordId: '',
      isAdmin: false,
      visible: false,
      isManager:false,
      mydata: [],
      month:'',
      reviewedList: [],
      modelDisplay: false,
      isRefreshing: true,
      question_id: '',
      btnDisable:false,
      review: [],
      showProgress: false,
      isModalVisible: false,
      assessmentItem: {},
      printData: [],
    }

    this.longPressItem = this.longPressItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };


  onRefresh = () => {
    this.setState({ data: [] }, function () {
      this.getData();
      console.log("data onrefresh :"+this.state.data)
    });

  }


  componentDidMount() {

    const setState = this.setState.bind(this)

    var month = new Date().getMonth();
    setState({month:month})
    // var convDate = moment(currentDate,'MMM/DD/YYYY',true).format()
   // console.log(convDate);

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
  }

  getData() {

    const setState = this.setState.bind(this)
    var tempArr = [];
    console.log("getData called..");
    AsyncStorage.getItem('subs').then((subs)=>{
      setState({mydata:JSON.parse(subs)},function(){
        console.log("data from questionslist :"+JSON.stringify(this.state.mydata))
      })
      if(this.state.mydata.length>0)
      this.setState({isManager:true})

    })

    setState({data:[]},function(){

      db.ref('Questions').on('value', function (snapshot) {
  
        snapshot.forEach(function (childSnapshot) {
          childSnapshot.forEach(function (_childSnapshot) {
            // console.log(_childSnapshot.child('createdby').val());
            tempArr.push(_childSnapshot.val())
            //  console.log("value " + JSON.stringify(_childSnapshot.val()));
          })
        })
  
      })

    })
    var json = [];
    db.ref('Review').once('value', function (snapshot) {
      if (snapshot.exists())
        Object.values(snapshot.val()).forEach(function (val) {
          Object.values(val).forEach(function (val1) {
            json.push(Object.values(val1)[0]);
          })
        })

      setState({ review: json }, function () {
      console.log(JSON.stringify(this.state.review))
      })
    })


    var reviewedList = [];
    console.log('record firebase ' + this.state.recordId)
    AsyncStorage.getItem('recordId').then((recordId) => {
      db.ref('Review').child(recordId).on('value', function (snapshot) {
        // console.log(JSON.stringify(snapshot.key))

        snapshot.forEach(function (childSnapshot) {
          childSnapshot.forEach(function (_child) {
            reviewedList.push(childSnapshot.key + " " + _child.child('question_id').val())
            setState({ reviewedList }, function () {
            console.log("review /list :" + JSON.stringify(this.state.reviewedList))
            })
          })

        })
      })

    })
    setState({ isRefreshing: false })
    setState({ data: tempArr.reverse() })
    
    console.log(this.state.data)
  }

  addBtnClick() {
    this.setState({ modelDisplay: true })
    if (this.state.data.length <= 0) {
      this.setState({ btnDisable: true })
    } else{
      this.setState({btnDisable:false})
    }
    //Actions.Question();
  }

  longPressItem(item, index) {
    //console.log(index);

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
                  this.getData
                  Toast.show('Assessment Removed ..! Swipe to refresh', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                  })
                  
                }).catch((error) => {
                  console.log("ERROR " + error)
                  Toast.show('Problem Occured :' + error)
                });
              } else {
                Toast.show("You don't have access to delete it..!", {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                })
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
    var date = item.todate;
    console.log(date)
    if(date.includes(MMM[this.state.month])|| date.includes(MMM[this.state.month-1])){
      this.setState({
        isModalVisible: true,
        assessmentItem: item
      }, function () {
        console.log("modal displayed..!")
  
      })
    }else{
      Toast.show('Assessment locked ..!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      })

    }
    
  }
  getColor = (item) => {
    var rec = item.recordId;
    var key = this.state.assessmentItem.key
    var reviewedList = this.state.reviewedList;
    var isReviewed = false;
    for (var i in reviewedList) {
      var rev = reviewedList[i];
      var user = rev.substring(0, rev.indexOf(" ")).trim();
      var _key = rev.substring(rev.indexOf(" "), rev.length).trim()
      // console.log("user and key :"+user +" "+key);
      //console.log("rev :"+rev);
      if (user === rec && _key === key) {
        isReviewed = true;
        break;
      }
    }
    if (isReviewed) {
      return 'green'
    } else {
      return 'black'
    }
  }
  ListEmpty = () => {
    return (
      //View to show when list is empty
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ alignContent: 'center', justifyContent: 'center', color: 'black', fontSize: 18, marginTop: 100 }}>Loading...</Text>
      </View>
    );
  };

  ListEmptyAssessment = () => {
    return (
      //View to show when list is empty
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#262d38'
      }}>
        <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17 }}>No Assessments.</Text>
      </View>
    );
  };


  createPDF(item, index) {
    this.setState({ showProgress: true }, function () {
      console.log("item selected :" + item.key);
      var json = [];

      for (var obj of this.state.review) {
        if (obj.question_id === item.key) {
          json.push(obj);
        }
      }
      //console.log("print data set" + JSON.stringify(json))
      if (json.length > 0) {
        var htmlText = '<html><head><style> hr{display: block;height: 1px;border: 0;border-top: 1px solid #000;margin: 1em 0;padding: 0;}table {font-family: arial, sans-serif; border-collapse: collapse;width: 100%;}td, th {border: 1px solid #dddddd;text-align: left;padding: 8px}tr:nth-child(even) {background-color: #dddddd;}</style></head><body>';
        htmlText = htmlText + '<h2 style=\"color:grey;font-family:Lucida Sans;text-align:center\">' + json[0].title + ' report</h2><h3 style=\"color:grey;font-family:Lucida Sans;text-align:center\">Date:' + json[0].startdate + ' -- ' + json[0].enddate + '</h3>'
        for (var obj of json) {
          htmlText = htmlText + '<h3 style=\"font-family:Lucida Sans;text-align:center\">' + obj.name + '</h3><h3 style=\"color:grey;font-family:Lucida Sans;text-align:center\">' + obj.email + '</h4><br>'
          htmlText = htmlText + '<table><tr><th>Question</th><th>Rating</th><th>Comments</th></tr>'
          for (var _obj of obj.response) {
            htmlText = htmlText + '<tr><td>' + _obj.question + '</td><td>' + _obj.rating + ' / 5</td><td>' + _obj.comments + '</td></tr>'
          }
          htmlText = htmlText + '</table><h3 style=\"color:green;text-align:center\">Total percent acquired:' + Math.round(obj.result) + ' %</h3><br><hr/>'

        }
        htmlText = htmlText + '</body></html>'

        console.log(htmlText);
        AsyncStorage.getItem('userEmail').then((email) => {
          fetch('https://us-central1-davinci-00-1.cloudfunctions.net/widgets/pdf',
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                html: htmlText,
                email: email,
                subject: json[0].title
              })
            }
          ).then((response) => response.json())
            .then((responseJson) => {
              this.setState({ showProgress: false })
              console.log(JSON.stringify(responseJson));
              if (responseJson.accepted.length > 0) {
                Toast.show('Report PDF sent to mail ..!', {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                })
              }
              else {
                this.setState({ showProgress: false })

                Toast.show('Something went wrong ..!', {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                })
              }
            }).catch((err) => {
              Toast.show(err, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              })
              console.error(err)
            })

        })
      } else {
        Toast.show('No reviews found ..!', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        })
        this.setState({ showProgress: false })

      }
    })
  }
  itemDate(item,index){
    var image=null;
    var date = item.fromdate;
    console.log("checking :"+date + " "+MMM[this.state.month])
    if(date.includes(MMM[this.state.month])|| date.includes(MMM[this.state.month-1])){
      image=require("../images/new.png")
    }else{
      image=require("../images/lock.png")
    }

    return (
      <View style={{flex:1,flexDirection:'row'}}>
                    <Text style={styles.item}>
                      {item.fromdate} - {item.todate}
                    </Text>
                    <Image style={{padding:5,width:'10%',height:30}} source={image} />
      </View>

    )
  }
 

  render() {

    console.log('render triggred########')
    //console.log(this.state.data)

    return (
      <View style={styles.container}>
        <FlatList
          style={{ height: '100%', marginBottom: 10, alignSelf: 'stretch', flexDirection: 'column', }}
          extraData={this.state}
          data={this.state.data.reduce((unique, o) => {
            if(!unique.some(obj => obj.key === o.key)) {
              unique.push(o);
            }
            var temp = unique.sort(function(a,b){
              return new Date(a.fromdate) - new Date(b.fromdate)
            });
            return temp.reverse();
        },[])}
          ListEmptyComponent={this.ListEmptyAssessment}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          renderItem={({ item, index }) =>
            <TouchableWithoutFeedback
              onPress={() => this.itemClick(item)}
            >
              <View>
                <Card
                  title={item.title}
                  titleStyle={{fontSize:18}}
                  containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                  >
                  {this.itemDate(item,index)}
                  <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-around' }}>
                    {this.state.isManager ? <TouchableOpacity onPress={() => this.longPressItem(item, index)} style={{ width: 30, height: 30, alignItems: 'flex-start' }}>
                      <Image style={{ width: 25, height: 22, }} source={require('../images/delete.png')} />
                    </TouchableOpacity> : null}
                    <TouchableOpacity onPress={() => this.createPDF(item, index)} style={{ width: 30, height: 30, alignItems: 'flex-end' }}>
                      <Image style={{ width: 25, height: 25, }} source={require('../images/mail-attachment.png')} />
                    </TouchableOpacity>
                  </View>
                </Card>
              </View>
            </TouchableWithoutFeedback >
          }
        />
        <ProgressDialog
          title="Please wait"
          activityIndicatorColor='blue'
          activityIndicatorSize="large"
          animationType="slide"
          message="loading"
          visible={this.state.showProgress}
        />
        {this.state.modelDisplay ?
          <Overlay
            justifyContent='center'
            isVisible={this.state.modelDisplay}
            windowBackgroundColor="rgba(255, 255, 255, .7)"
            overlayBackgroundColor="#c9d3e2"
            width={300}
            height="auto"
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#455a64', fontSize: 21, fontWeight: 'bold' }}>Select Option </Text>
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                }}
              />

              <TouchableOpacity disabled={this.state.btnDisable} onPress={() => {
                this.setState({ modelDisplay: false })
                Actions.importQues();
              }}
              activeOpacity = { .5 } 
              >
                <Text style={{ color:this.state.btnDisable ? 'grey':'black', textAlign: 'center', marginBottom: 10, fontSize: 19, marginTop: 20 }}>Question Template</Text>
              </TouchableOpacity >
              <View
                style={{
                  width: '80%',
                  borderBottomColor: 'grey',
                  borderBottomWidth: 1,
                }}
              />
              <TouchableOpacity onPress={() => {
                this.setState({ modelDisplay: false })
                Actions.Question();
              }}>
                <Text style={{ color: 'black', fontSize: 19, textAlign: 'center', marginTop: 10 }}>Create new Questions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#455a64', width: 250, height: 40 }}
                onPress={() => this.setState({ modelDisplay: false })}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Cancel</Text>
              </TouchableOpacity>


            </View>
          </Overlay> : null}

        {this.state.isManager ?
          <TouchableOpacity onPress={() => this.addBtnClick()} style={styles.fab}>
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity> : null}
        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ backgroundColor: 'rgba(238,238,238,1)', borderRadius: 20, padding: 10, flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: '#1e88e5', fontSize: 18, marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }}>Select the Sub-Ordinate</Text>
            <FlatList
              style={{ height: '100%', marginBottom: 10, alignSelf: 'stretch', flexDirection: 'column', }}
              extraData={this.state}
              data={this.state.mydata}
              ListEmptyComponent={this.ListEmpty}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.getData.bind(this)}
                />
              }
              renderItem={({ item, index }) =>
                <TouchableWithoutFeedback
                  onPress={() => {
                    console.log(JSON.stringify(item))
                    this.setState({ isModalVisible: false }, function () {
                      Actions.review({ item: item, assessmentItem: this.state.assessmentItem })
                    });
                  }}>
                  <View>
                    <Card
                      containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                      title={item.employeeFname + " " + item.employeeLname}
                      titleStyle={[styles.titleText, { color: this.getColor(item) }]}>
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
  containerMenu: {
    flex: 1,
    paddingTop: 20,

  },

  item: {
    width:'90%',
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
  },
  titleText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  }
});
