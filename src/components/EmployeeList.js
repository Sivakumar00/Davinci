import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback,ActivityIndicator, TouchableOpacity,AsyncStorage, Image, View, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import Modal from "react-native-modal";
export default class EmployeeList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      employeename:'',
      isModalVisible: false,
      employeeposition:'',
      employeeemail:'',
      employeeid:'',
      department:'',
      mobile:'',
      activity_loading:true,
      image_uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png'
    }
  }

  componentDidMount() {
    console.log('mounted ' + JSON.stringify(this.props.data))
  }
  renderFooter = () => {
    if (this.props.data.length != 0) return null;


    return (
      <View>
        <Image style={{ alignContent: 'center', width: 100, height: 100, alignSelf: 'center', marginTop: 40 }}
          source={require('../images/visualbi_logo.png')} />
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 20, fontWeight: '200', color: "white" }}>Loading ...</Text>
      </View>
    );
  };

  itemClick(item){
    const setState = this.setState.bind(this);
    setState({ isModalVisible: true }, console.log("modal called" + this.state.isModalVisible))
      fetch('https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken=6e13da6b433aecfb0236a5ba09632032&searchColumn=EMPLOYEEMAILALIAS&searchValue=' + item.employemailId)
        .then((response) => response.json())
        .then((responseJson)=>{
          var json=responseJson[0];
          if (json.Photo.includes('api')) {
            this.setState({
                image_uri: json.Photo + '&authtoken=6e13da6b433aecfb0236a5ba09632032',
                
            })
        } else {
            this.setState(
                {
                    image_uri: json.Photo,
                   
                })
        }
          this.setState({
            employeename:json['First Name']+" "+json['Last Name'],
            employeeposition:json.Title,
            employeeemail:item.employemailId,
            employeeid:item.employeeId,
            department:json.Department,
            activity_loading:false,
          })
        })

    

  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          extraData={this.props}
          data={this.props.data}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item }) =>
            <TouchableWithoutFeedback
              onPress={() => {this.itemClick(item)}}
            >
              <View>
                <Card
                  containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                  title={item.employeeFname}
                  titleStyle={{ fontSize: 18 }}>
                  <Text style={styles.item}>
                    {item.employeeId}
                  </Text>
                </Card>
              </View>
            </TouchableWithoutFeedback >
          }
        />
        <Modal style = {{height:500,width:350,flex:1,alignSelf:'center'}} isVisible={this.state.isModalVisible}>
          <View style={{ alignSelf:'center',backgroundColor: 'rgba(238,238,238,1)', borderRadius: 20, padding: 10, flex: 1, justifyContent: 'center' }}>
            <Image 
              style={{height:300,width:300,borderRadius:20,alignSelf:'center'}}
              source={{ uri: this.state.image_uri }} />
            <ActivityIndicator animating={this.state.activity_loading} size="large" color="#0000ff" />

            <Text style={styles.item} >
              {this.state.employeename}
            </Text>
            <Text style={styles.itemtext}>{this.state.employeeposition}</Text>
            <Text style={styles.itemtext}>Employee ID : {this.state.employeeid}</Text>
            <Text style={styles.itemtext}>Department : {this.state.department}</Text>
            <Text style={styles.itemtext}>Email : {this.state.employeeemail}</Text>



            <TouchableOpacity style={{width:300,marginTop:75, backgroundColor: '#1e88e5', paddingLeft: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 30, marginBottom: 10 }} 
                onPress={() => { 
                  this.setState({ 
                    isModalVisible: false ,
                    employeename:'',
                    employeeposition:'',
                    employeeemail:'',
                    employeeid:'',
                    department:'',
                    image_uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png'
                 
                }) }} >
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
    backgroundColor: '#455a64',
    justifyContent: 'center',
  },

  MainContainer: {

    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    textAlign: 'center',

  },
  item: {
    color: 'grey',
    fontSize: 18,
    fontWeight:'bold',
    marginBottom:10,
    textAlign: 'center',
  },
  itemtext:{
    color: 'grey',
    fontSize: 15,
    marginBottom:5,
    textAlign: 'center',
  }
});