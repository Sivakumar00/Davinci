import React from 'react';
import { StyleSheet,TouchableWithoutFeedback,AsyncStorage,BackHandler, TouchableOpacity,TextInput,Text,View ,StatusBar} from 'react-native';
import {db} from '../config/db'
import { Card } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';

export default class CreateAssessment extends React.Component {

  constructor(props){
      super(props)
      this.state = {
          title:'',
          question:'',
          data:{},
          fromdate:'',
          todate:'',
          buttontext:'Confirm',
          datepickerview:true,
          finishBtn:false,
          questioncount:0,
          questions:[],
          gettext:'',
          steptext:'Step 1: Create Assessment',
          placeholder:'Assessment Title'
      }
      this.addBtnClick = this.addBtnClick.bind(this);
      this.finishBtn = this.finishBtn.bind(this);

  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }
  
  onBackPress(){
    Actions.reset('home');
  }
  addBtnClick()
  {
    
      var btnState = this.state.buttontext;
      console.log(btnState+" "+this.state.title)
      if(this.state.questioncount >=1){
        this.setState({finishBtn:true})
      }
      if( btnState === 'Confirm'){
          if(this.state.title !== '' && this.state.fromdate !=='' && this.state.todate !== ''){
            this.setState({datepickerview:false})
            this.setState({gettext:''})
            this.setState({steptext:'Step 2: Add Questions'})
            this.setState({buttontext:'Add Question'})
            this.setState({placeholder:'Write your question..'})
          }else{
              alert('Field is empty ..!')
          }
      }else{
          // to add questions
          if(this.state.question !== ''){
            
            this.setState({questioncount:this.state.questioncount+1})
            let questions = this.state.questions;
            var singleQue = {
                question:this.state.question,
                comments:'',
                rating:''
            }
            questions.push(singleQue);
            this.setState({question:''})
            this.setState({questions:questions},()=>{console.log(this.state.questions)});
            this.setState({gettext:''})
          }else{
            alert('Field is empty ..!')
          }
          
      }
      
  }

  finishBtn(){
      if(this.state.questions !== []){
        var toBeSaved = {
            title:this.state.title,
            fromdate:this.state.fromdate,
            todate:this.state.todate,
            questions:this.state.questions
        }
        console.log(JSON.stringify(toBeSaved));
        
        //insert into db
        AsyncStorage.getItem('recordId').then((recordId)=>{
            db.ref('/Questions/'+recordId).push(toBeSaved).then((data)=>{
                console.log(data)
            })
        })
       


      }

  }

  render() {
    return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.state.steptext}</Text>
                <TextInput 
                    style={styles.inputbox}
                    underlineColorAndroid='transparent' 
                    placeholder={this.state.placeholder} 
                    onChangeText={(text)=>{
                        this.setState({gettext:text})
                        if(this.state.placeholder == 'Assessment Title'){
                            this.setState({title:text})
                        }else{
                            this.setState({question:text})
                        }
                    }}
                    value={this.state.gettext}
                    ></TextInput>
                   {this.state.datepickerview ? <DatePicker
                        style={{width: 300,alignSelf:'center'}}
                        date={this.state.fromdate} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="Date From"
                        format="DD-MM-YYYY"
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
                          }
                        }}
                        onDateChange={(date) => {this.setState({fromdate: date})}}
                      />:null}
                      {this.state.datepickerview ? <DatePicker
                        style={{ width:300,
                          marginTop:10,alignSelf:'center'}}
                        date={this.state.todate} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="Date To"
                        format="DD-MM-YYYY"
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
                          }
                        }}
                        onDateChange={(date) => {this.setState({todate: date})}}
                      />:null}
                <TouchableOpacity style={styles.button} onPress={this.addBtnClick}>
                     <Text style={styles.buttontext}>{this.state.buttontext}</Text>
                </TouchableOpacity>
                {this.state.finishBtn ?
                <TouchableOpacity style={styles.button}  onPress={this.finishBtn}>
                     <Text style={styles.buttontext}>Finish</Text>
                </TouchableOpacity> :null}

                <View style={{flex:1}}>
                <Text style={{color:'white',fontSize:15,padding:5,justifyContent:'center',backgroundColor:'#37474f',marginTop:10,textAlign:'center',alignContent:'center', borderColor:'white',width:'100%'}}>Questions Added</Text>
                <FlatList
                  style={{ height:'100%', alignSelf: 'stretch',flexDirection: 'column',}}
                  extraData={this.state}
                  data = {this.state.questions}
                  scrollEnabled={true}
                  renderItem={({item,index}) =>
                
                <TouchableWithoutFeedback 
                    onPress={()=>this.itemClick(item)}
                  >
                  <View>
                    <Card
                        containerStyle={{padding:5,borderRadius:10,backgroundColor:'white',shadowRadius:5}}
                        title={''+(index+1)}
                        titleStyle={{fontSize:18}}>
                      <Text style={styles.item}>
                          {item.question}
                      </Text>
                    </Card>
                  </View>
                </TouchableWithoutFeedback > 
                }
              
                />
              </View>
          
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
  title:{
      textAlign:'center',
      fontSize:24,
      fontWeight:'bold',
      color:'#fff',
      marginTop:100,
      
  },
  inputbox:{
    width:300,
    alignSelf:'center',
    borderRadius:25, 
    paddingLeft:20,
    paddingTop:8,
    paddingBottom:8,
    marginTop:20,
    marginBottom:10,
    color:'#ffffff',
    backgroundColor:'rgba(255,255,255,0.3)'      
  },
  buttontext:{
    fontSize:18,
    color:'white',
    fontWeight:'500',
    alignSelf:'center',
   
  },
  button:{
    borderRadius:10, 
    width:300  ,
    marginTop:10,
    alignSelf:'center',
    backgroundColor:'#37474f',
    paddingTop:8,
    paddingBottom:8
  },
  item:{
    color:'#000', 
    fontSize:20,
    padding:10,
    fontWeight:'bold',
    textAlign: 'center',
}
});