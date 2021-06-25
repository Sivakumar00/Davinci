 import React from 'react';
import { StyleSheet, Button, NetInfo, Image, Dimensions, TouchableWithoutFeedback, AsyncStorage, BackHandler, TouchableOpacity, TextInput, Text, View, StatusBar } from 'react-native';
import { db } from '../config/db'
import { Card } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
import Modal from "react-native-modal";
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
const { width } = Dimensions.get('window');
import { ProgressDialog } from 'react-native-simple-dialogs';


export default class CreateAssessment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      question: '',
      data: {},
      isConnected: true,
      fromdate: '',
      todate: '',
      buttontext: 'Confirm',
      datepickerview: true,
      finishBtn: false,
      questioncount: 0,
      isModalVisible: false,
      importQues:false,
      questions: [],
      gettext: '',
      getEditQuestion: '',
      getEditWeight: '',
      editItem: {},
      editIndex: -1,
      total: 0,
      weightage: '',
      weightagevisible: false,
      showProgress: false,
      steptext: 'Step 1: Create Assessment',
      placeholder: 'Assessment Title'
    }
    this.addBtnClick = this.addBtnClick.bind(this);
    this.finishBtn = this.finishBtn.bind(this);
    this.editClick = this.editClick.bind(this);
    this.reSubmitQues = this.reSubmitQues.bind(this);
    this.deleteClick = this.deleteClick.bind(this);

  }
  openProgress = () => {
    this.setState({ showProgress: true });
  }
  hideProgress = () => {
    this.setState({ showProgress: false });
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  }

  handleBackButton = () => {

    if (Actions.state.index === 0) {
      return false
    }
    Actions.pop()
    return true
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);

  }
  addBtnClick() {
    var btnState = this.state.buttontext;
    if (this.state.questioncount >= 1) {
      this.setState({ finishBtn: true })
    }
    if (btnState === 'Confirm') {
      if (this.state.title !== '' && this.state.fromdate !== '' && this.state.todate !== '') {
        this.setState({ 
          datepickerview: false,
          gettext: '',
          steptext: 'Step 2: Add Questions',
          buttontext: 'Add Question',
          placeholder: 'Write your question..',
          importQues:true,
          weightagevisible: true})
      } else {
        alert('Field is empty ..!')
      }
    } else {
      // to add questions
      if (this.state.question !== '' && this.state.weightage !== '') {
        this.setState({ total: this.state.total + parseInt(this.state.weightage) })
        this.setState({ questioncount: this.state.questioncount + 1 })
        let questions = this.state.questions;
        var singleQue = {
          question: this.state.question,
          comments: '',
          rating: '',
          weightage: this.state.weightage
        }
        questions.push(singleQue);
        this.setState({
          question: '',
          questions: questions,
          gettext: '',
          weightage: '',
        }, console.log("question " + this.state.question))
      } else {
        alert('Field is empty ..!')
      }

    }

  }

  finishBtn() {
    this.openProgress()
    if (this.state.questions !== []) {

      //insert into db
      AsyncStorage.getItem('recordId').then((recordId) => {
        var key = db.ref('/Questions/' + recordId).push().key;
        console.log(key);
        var toBeSaved = {
          title: this.state.title,
          fromdate: this.state.fromdate,
          todate: this.state.todate,
          questions: this.state.questions,
          total: this.state.total,
          key: key,
          createdby: recordId + '',
        }
        db.ref('/Questions/' + recordId + '/' + key).set(toBeSaved).then((data) => {
          this.hideProgress();
          Toast.show('Assessment created ..!', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          })
          Actions.pop();
        }).catch((error) => { Toast.show('Problem Occured :' + error, 200) });
      })
    } else {
      this.hideProgress();
      Toast.show('Problem occured ..!', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      })
    }
  }

  editClick(item, index) {

    this.setState(
      {
        editItem: item, 
        editIndex: index,
        getEditQuestion: item.question,
        getEditWeight: item.weightage,
        isModalVisible: true
      }, function () {
        console.log(this.state.editIndex)
      });
  }

  importQuestions(){
    Actions.importQues()
  }
  reSubmitQues() {
    if (this.state.getEditQuestion !== '' && this.state.getEditWeight !== '') {
      var index = this.state.editIndex;

      var resObj = {
        question: this.state.getEditQuestion,
        comments: '',
        rating: '',
        weightage: this.state.getEditWeight
      }
      let updateQuestions = JSON.parse(JSON.stringify(this.state.questions));
      updateQuestions[index] = resObj;
      this.setState({ questions: updateQuestions })
      this.setState({ isModalVisible: false })
    }
    else {
      alert('Problem occured ..!')
    }
  }
  deleteClick(item, index) {
    let updateQuestions = this.state.questions;
    updateQuestions.splice(index);
    this.setState({ questions: updateQuestions })
  }
  render() {
    return (
      <View style={styles.container}>
        <ProgressDialog
          title="Please wait"
          activityIndicatorColor='blue'
          activityIndicatorSize="large"
          animationType="slide"
          message="Saving the assessment"
          visible={this.state.showProgress}
        />

        {!this.state.isConnected ?
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
          </View> : null}
        <Text style={styles.title}>{this.state.steptext}</Text>
        <TextInput
          style={styles.inputbox}
          underlineColorAndroid='transparent'
          placeholder={this.state.placeholder}
          onChangeText={(text) => {
            this.setState({ gettext: text })
            if (this.state.placeholder == 'Assessment Title') {
              this.setState({ title: text })
            } else {
              this.setState({ question: text })
            }
          }}
          value={this.state.gettext}
        ></TextInput>

        {this.state.weightagevisible ? <TextInput
          style={styles.inputbox}
          underlineColorAndroid='transparent'
          placeholder='Weightage (out of 100)'
          keyboardType='numeric'
          onChangeText={(text) => { this.setState({ weightage: text }) }}
          value={this.state.weightage}
        ></TextInput> : null}
        {this.state.datepickerview ? <DatePicker
          style={{ width: 300, alignSelf: 'center' }}
          date={this.state.fromdate} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="Date From"
          format="DD-MMM-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36,
            },
            dateText: {
              color: 'white'
            }
          }}
          onDateChange={(date) => {
            console.log(date.toUpperCase())
            this.setState({ fromdate: date.toUpperCase() })
          }}
        /> : null}
        {this.state.datepickerview ? <DatePicker
          style={{
            width: 300,
            marginTop: 10, alignSelf: 'center'
          }}
          date={this.state.todate} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="Date To"
          format="DD-MMM-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36,
            },
            dateText: {
              color: 'white'
            }
          }}
          onDateChange={(date) => { this.setState({ todate: date.toUpperCase() }) }}
        /> : null}

        <TouchableOpacity style={styles.button} onPress={this.addBtnClick}>
          <Text style={styles.buttontext}>{this.state.buttontext}</Text>
        </TouchableOpacity>
        {this.state.finishBtn ?
          <TouchableOpacity style={styles.button} onPress={this.finishBtn}>
            <Text style={styles.buttontext}>Finish</Text>
          </TouchableOpacity> : null}

        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 15, padding: 5, justifyContent: 'center', backgroundColor: '#37474f', marginTop: 10, textAlign: 'center', alignContent: 'center', borderColor: 'white', width: '100%' }}>Questions Added</Text>
          <FlatList
            style={{ height: '100%', alignSelf: 'stretch', flexDirection: 'column', }}
            extraData={this.state}
            data={this.state.questions}
            scrollEnabled={true}
            renderItem={({ item, index }) =>

              <TouchableWithoutFeedback>
                <View >
                  <Card
                    containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                    title={item.question + " (" + item.weightage + ")"}
                    titleStyle={{ fontSize: 18 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.editClick(item, index)
                        }}
                      >
                        <Image style={{ width: 35, height: 35, marginRight: 20, padding: 5 }} source={require('../images/portfolio.png')} />
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback
                        onPress={() => { this.deleteClick(item, index) }}>
                        <Image style={{ width: 35, height: 35, marginLeft: 20, padding: 5 }} source={require('../images/remove.png')} />
                      </TouchableWithoutFeedback>
                    </View>

                  </Card>
                </View>
              </TouchableWithoutFeedback >
            }

          />
          <Modal isVisible={this.state.isModalVisible}>
            <View style={{ backgroundColor: 'rgba(238,238,238,1)', borderRadius: 20, padding: 10, flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: '#1e88e5', fontSize: 23, fontWeight: 'bold', textAlign: 'center' }}>Update Question</Text>

              <TextInput
                style={styles.editinputbox}
                underlineColorAndroid='transparent'
                onChangeText={(text) => {

                  this.setState({ getEditQuestion: text }, function () {
                  })
                }}
                value={this.state.getEditQuestion}
              ></TextInput>
              <TextInput
                style={styles.editinputbox}
                underlineColorAndroid='transparent'
                onChangeText={(text) => {

                  this.setState({ getEditWeight: text })

                }}
                value={this.state.getEditWeight}
              ></TextInput>
              <TouchableOpacity style={{ backgroundColor: '#1e88e5', paddingLeft: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 30, marginBottom: 10, marginTop: 30 }} onPress={this.reSubmitQues} >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#1e88e5', paddingLeft: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 30, marginBottom: 10 }} onPress={() => { this.setState({ isModalVisible: false }) }} >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>

        </View>

      </View>
    );
  }


}
function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#455a64',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 50,

  },
  inputbox: {
    width: 300,
    alignSelf: 'center',
    borderRadius: 25,
    paddingLeft: 20,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 20,
    marginBottom: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  editinputbox: {
    width: 300,
    alignSelf: 'center',
    borderRadius: 25,
    paddingLeft: 20,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#b0bec5'
  }
  ,
  buttontext: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
    alignSelf: 'center',

  },
  button: {
    borderRadius: 10,
    width: 300,
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#37474f',
    paddingTop: 8,
    paddingBottom: 8
  },
  item: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 30
  },
  offlineText: { color: '#fff' }
});