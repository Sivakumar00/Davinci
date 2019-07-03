import React from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { ProgressDialog } from "react-native-simple-dialogs";
import { Actions } from "react-native-router-flux";
import { db } from "../config/db";
import Toast from "react-native-root-toast";

export default class Logo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      userId: "",
      lockBtn: true,
      showProgress: true,
      recordId:''
    };
  }

  openProgress = () => {
    this.setState({ showProgress: true });
  };
  hideProgress = () => {
    this.setState({ showProgress: false });
  };
  componentDidMount() { 
    var endpoint = 'https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken=6e13da6b433aecfb0236a5ba09632032&searchColumn=EMPLOYEEMAILALIAS&searchValue=' + this.state.username
    console.log("endpoint :" + endpoint)
    fetch(endpoint)
        .then((response) => response.json())
        .then((responseJson)=>{
           var json = responseJson[0];
           this.setState({recordId:json.recordId})
        }).catch((err)=>{
          console.error(err)
        })

    
    fetch(
      "https://people.zoho.com/people/api/getSubOrdinates?authtoken=6e13da6b433aecfb0236a5ba09632032"
    )
      .then(response => response.text())
      .then(response => {
        var str = response;
        str = str.replace(/\d{18}/g, function(x) {
          return '"' + x + '"';
        });
        return JSON.parse(str);
      })
      .then(responseJson => {
        var json = responseJson.response.result;
        var temp = {
          recordId: "249048000000917199",
          employeeLname: "NS",
          employeeFname: "Devaraj",
          employeeId: "VBI10117",
          employemailId: "devarajns@visualbi.com",
          reportingTo: ""
        };
        json.push(temp);

        //to get immediate team
        var myData = [];
        for (var i = 0; i < json.length; i++) {
          var temp1 = json[i];
          if (temp1.reportingTo === this.state.recordId) {
            myData.push(temp1);
          }
        }
        
        this.setState({ mydata: myData });
        console.log(JSON.stringify(this.state.mydata));
        AsyncStorage.setItem('subs',JSON.stringify(this.state.mydata)).then((data)=>
        {
          console.log("subs saved");
        })
        // var tree = unflatten(json);
        // this.setState({data:tree});
      });

    this._loadInitialState().done();
  }

  _loadInitialState = async () => {
    var value = await AsyncStorage.getItem("user");
    if (value !== null) {
      Actions.home();
    }
    this.hideProgress();
  };

  saveUserID = async userId => {
    try {
      AsyncStorage.setItem("user", userId).then(data => {
        console.log("user id saved");
      });
      AsyncStorage.setItem("userEmail", this.state.username).then(data => {
        console.log("user email saved");
      });
      //console.log("user id: " + AsyncStorage.getItem('user'))
      Actions.home();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <TextInput
          style={styles.inputbox}
          underlineColorAndroid="transparent"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={username =>
            this.setState({ username: username.toLowerCase() })
          }
          onSubmitEditing={() => this.password.focus()}
        />

        <TextInput
          style={styles.inputbox}
          underlineColorAndroid="transparent"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          secureTextEntry={true}
          ref={input => (this.password = input)}
        />
        {this.state.lockBtn ? (
          <TouchableOpacity style={styles.button} onPress={this.buttonClick}>
            <Text style={styles.buttontext}>{this.props.type}</Text>
          </TouchableOpacity>
        ) : null}
        <ProgressDialog
          title="Please wait"
          activityIndicatorColor="blue"
          activityIndicatorSize="large"
          animationType="slide"
          message="loading"
          visible={this.state.showProgress}
        />
      </KeyboardAvoidingView>
    );
  }

  //login endpoint https://accounts.zoho.com/apiauthtoken/create?SCOPE=zohopeople/peopleapi
  buttonClick = () => {
    if (this.state.username !== "" && this.state.password !== "") {
      this.openProgress();

      fetch(
        "https://accounts.zoho.com/apiauthtoken/nb/create?SCOPE=Zohopeople/peopleapi&EMAIL_ID=" +
          this.state.username +
          "&PASSWORD=" +
          this.state.password +
          "&DISPLAY_NAME=davinci",
        {
          method: "POST"
        }
      )
        .then(response => response.text())
        .then(data => {
          var result = data
            .substring(data.lastIndexOf("=") + 1, data.length)
            .trim();
          var authToken;
          if (result === "TRUE") {
            console.log(data);
            authToken = data
              .substring(data.indexOf("=") + 1, data.lastIndexOf("RE"))
              .trim();
            console.log("Auth token " + authToken);
            this.setState({ userId: authToken });
            this.saveUserID(this.state.userId);
            Toast.show("Logged In successfully ", {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0
            });
          } else {
            console.log("Failed:" + data);
            Toast.show("Failed: " + data, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0
            });
          }
          this.hideProgress();
        })
        .catch(error => {
          this.hideProgress();
          alert(error);
        });
    } else {
      console.log("Empty fields");
      alert("Empty fields..");
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  inputbox: {
    width: 300,
    alignSelf: "center",
    borderRadius: 25,
    paddingLeft: 20,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 10,
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.3)"
  },
  buttontext: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    alignSelf: "center"
  },
  button: {
    borderRadius: 10,
    width: 300,
    backgroundColor: "#37474f",
    paddingTop: 8,
    paddingBottom: 8
  }
});
