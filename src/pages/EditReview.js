import React from 'react';
import { StyleSheet,TouchableOpacity,BackHandler,NetInfo ,FlatList,Text,TextInput , View ,StatusBar} from 'react-native';
import { db } from '../config/db';
import Toast from 'react-native-root-toast';
import { Actions } from 'react-native-router-flux';
import { Card, AirbnbRating } from 'react-native-elements';

export default class EditReview extends React.Component {
    
    constructor(props){
      super(props);
      this.state={
        questions:this.props.item.response,
        data:this.props.item,
        isRefreshing:true,
        btnState:true,

      }
    }

    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    //Back button handler
    handleBackButton = () => {
      if (Actions.state.index === 0) {
          return false
      }
      Actions.pop()
      return true
    }

    //checks the internet connectivity
    handleConnectivityChange = isConnected => {
      if (isConnected) {
          this.setState({ isConnected });
      } else {
          this.setState({ isConnected });
      }
    }

    //when list data is empty
    ListEmpty = () => {
      return (
        //View to show when list is empty
          <View style={{
              flex: 1, 
              alignItems: 'center',
              justifyContent: 'center', 
              backgroundColor: '#262d38'
          }}>
            <Text style={{width:'100%',alignItems:'center',justifyContent:'center',color:'white', fontSize:17}}>No Reviews..!.</Text> 
          </View>
         
      );
    };
    editReviewHeader=()=>{
      return(
        <View style ={{height:125, backgroundColor: '#262d38', justifyContent: 'center',}}>
          <Text style={[styles.itemTitle,{marginTop:10}]}>{this.props.item.name}</Text>
          <Text style={styles.item}>{this.props.item.title}</Text>
          <Text style={styles.item}>{this.props.item.startdate+" - "+this.props.item.enddate}</Text>
        </View>
      )
    }
    renderList =({item,index})=>{
      console.log('render :'+JSON.stringify(this.state.questions))
      return(
      <View>
        <Card
          title={
            <View style={{ backgroundColor: '#262d38', padding: 6,borderRadius:10 }}>
              <Text style={{color:'white',fontSize:18,textAlign:'center'}}>{item.question+" ("+item.weightage+")"}</Text>
            </View>
            }
          containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5,marginBottom:4 }}
          titleStyle={{ fontSize: 18 }}>
            <Text style={styles.item}>Star rating</Text>
            <AirbnbRating
              defaultRating={item.rating}
              reviews={["1/5", "2/5", "3/5", "4/5", "5/5"]}
              onFinishRating={(rating) => {
                  var response = this.state.questions;
                  response[index].rating = rating;
                  this.setState({
                      questions: response
                  })
              }}
            />
            <TextInput
              underlineColorAndroid='transparent'
              placeholder='Comments (Optional)'
              placeholderTextColor={'#888888'}
              multiline={true}
              pointerEvents='none'
              numberOfLines={4}
              value={item.comments}
              onContentSizeChange={(event) =>
                  this.setState({ height: event.nativeEvent.contentSize.height })
              }
              style={[styles.inputbox, {
                  height: 100
              }]}
              onChangeText={(text) => {
                  var response = this.state.questions;
                  response[index].comments = text;
                  this.setState({
                      questions:response
                  })

              }}
          />

        </Card>
      </View>
      )
    }
    editReviewList=()=>{
      return(
        <View style={styles.containerList}>
          <FlatList
            extraData={this.props}
            contentContainerStyle={{paddingBottom:20}}
            ListEmptyComponent={this.ListEmpty}
            data={this.props.item.response}
            renderItem={this.renderList}
          />
        </View>
      )
    }
    finishBtn=()=>{
      return(
        <TouchableOpacity disabled={this.state.btnState} style={{ backgroundColor: '#1e88e5', paddingTop: 8, paddingBottom: 8}}
          onPress={this.onClickFinish.bind(this)}>
          <Text style={{ fontSize:18, color: '#fff', textAlign: 'center' }}>Finish Editing</Text>
        </TouchableOpacity>
      )
    }
    onClickFinish(){
      this.setState({btnState:false})
    //  console.log(JSON.stringify(this.state.questions))
      var response = this.state.questions;
   //   console.log("response edit respsne "+JSON.stringify(response))
      //to calculate review results
      var totalResult = 0;
      for(var i in response){
        var weightage = response[i].weightage;
        var rating = response[i].rating;
        //single star value
        var singleStar = weightage / 5;
        var result = singleStar * rating;
        totalResult=totalResult+result;
        //console.log("total result :"+totalResult)
      }
      var total =  this.state.data.total;
      var percent = (totalResult/total)*100;
    //  console.log("percent :"+percent)
      var final_json = this.props.item;
      final_json.response = response;
      final_json.result = percent;

      var reviewer_id = final_json.reviewer;
      var record_id = final_json.recordId;
      var question_id = final_json.question_id
     // console.log("final json :"+JSON.stringify(final_json))
      db.ref('Review').child(reviewer_id).child(record_id).child(question_id).set(final_json)
        .then((data)=>{
          Toast.show("Assessment review saved ..! Swipe to refresh ", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
            Actions.pop();
        })
        .catch((err)=>Toast.show(err, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0}
            ))
    }

    render() {
    return (
      <View style={{flex:1}}>
          {this.editReviewHeader()}
          {this.editReviewList()}
          {this.finishBtn()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#262d38',
    justifyContent: 'center',
  },
  containerList:{
    flex: 1,
    backgroundColor: '#455a64',
    justifyContent: 'center',
  },
  itemmark:{
    textAlign:'center',fontWeight:'bold',fontSize:20,marginBottom:10,paddingTop:5
  },
  itemTitle:{
    color:'white', 
    fontSize:20,
    fontWeight:'bold',
    textAlign: 'center',
  },
  item:{
    color:'grey', 
    fontSize:16,
    fontWeight:'bold',
    textAlign: 'center',
    marginBottom:5,
    marginTop:5,
  },

  inputbox: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 12,
    paddingLeft: 20,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 20,
    marginLeft: 30,
    textAlignVertical: 'top',
    marginRight: 30,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#cfd8dc'
  },
});