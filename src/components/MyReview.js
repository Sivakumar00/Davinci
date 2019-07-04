import React from 'react';
import { StyleSheet,AsyncStorage,RefreshControl,TouchableWithoutFeedback,TouchableOpacity,Image,FlatList,Text, View ,SectionList,StatusBar} from 'react-native';
import { db } from '../config/db';
import { Card } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';


export default class MyReview extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data:[],
            isRefreshing:true,
            sectionList:[],

        }
    this.onRefresh = this.onRefresh.bind(this);

    }

    componentDidMount(){
        this.getData();
    }
    onRefresh = () => {
        this.setState({ data: [] }, function () {
          this.getData();
        });
    }
    getData(){
        const setState =  this.setState.bind(this);
        AsyncStorage.getItem('recordId').then((recordId)=>{
            db.ref('Review').child(recordId).once('value',function(snapshot){
              var response=[];
              if(snapshot.exists()){
                snapshot.forEach(function(_childSnapshot){
                  //console.log("snapshot ::: "+JSON.stringify(_childSnapshot.val()));
                  _childSnapshot.forEach(function(child){
                    if(_childSnapshot.val() !== null ){
                      var key = child.key;
                      console.log("key :"+key);
                      response.push(_childSnapshot.child(key).val())
                      console.log("response object val() :"+JSON.stringify(response))
                    }else{
                      response =[];
                    }
                 })
                })
              }
              setState({data:response},function(){
                  //  console.log('my review '+JSON.stringify(this.state.data));
                  var data = this.state.data;
                  var result = [];
                  var title =[];
                  var result = [];

                  for( var i in data){
                    if(title.indexOf(data[i].title)=== -1){
                    title.push(data[i].title)
                    }
                  }
                  //console.log(JSON.stringify(title))
                  title.forEach(function(i){
                  var temp1=[];
                  for(var j of data){
                    if(j.title ===i){
                      temp1.push(j);
                    }
                  }
                  var temp={
                    title:i,
                    data:temp1
                  }
                  //console.log("temp :"+JSON.stringify(temp)+"\n\n")
                  result.push(temp);
                  })
                 // console.log("section list :"+ JSON.stringify(result))
                  setState({isRefreshing:false,sectionList:result.reverse()},function(){
                  //  console.log(JSON.stringify(this.state.sectionList))
                  })
                })
            })
        })        
    }

    getColor(item){
      var percent =  item.result
      console.log(percent+'%')
      if(percent<40){
        return 'red'
      }else if(percent>=40 && percent <60){
        return 'orange'
      }else if(percent>=60){
        return 'green'
      }
    }
    ListEmpty = () => {
      return (
        //View to show when list is empty
        <View style={{flexGrow:1,alignItems:'center',justifyContent:'center'}}>
          <View style={{
              flex: 1, 
              alignItems: 'center',
              justifyContent: 'center', 
              backgroundColor: '#262d38'
          }}>
            <Text style={{width:'100%',alignItems:'center',justifyContent:'center',color:'white', fontSize:17}}>No Reviews..!.</Text> 
          </View>
          <TouchableOpacity onPress={this.onRefresh}>
            <Image style={{width:40,height:40, marginTop:100}} source={require('../images/refresh.png')} />
          </TouchableOpacity>

        </View>
      );
    };
    myReviewClick(item){
      console.log("my review"+JSON.stringify(item))
      if(item!==null)
        Actions.editReview({item,view:true})
    }

  render() {
    return (

        <View style={styles.container}>
            <SectionList
                extraData={this.state}
                ListEmptyComponent={this.ListEmpty}
                refreshing={this.state.isRefreshing}
                refreshControl={ 
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh.bind(this)}
                  />
                }
                sections={this.state.sectionList.sort(function(a,b){
                  return a.result - b.result;
                })}
                renderSectionHeader={({section})=>(
                  <Text style={styles.SectionHeaderStyle}>{section.title}</Text>
                )}
                renderItem={({item,index})=>
                <TouchableWithoutFeedback onPress={()=>{this.myReviewClick(item)} }>
                <Card
                    containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5,marginBottom:4 }}
                    title={item.name}
                    titleStyle={{ fontSize: 18 }}>
                        <Text style={styles.item}>
                            {item.startdate} - {item.enddate}
                        </Text>
                        <Text style={[styles.itemmark,{color:this.getColor(item)}]}>
                          {Math.round(item.result)+' %'}
                        </Text>

                </Card>   
                </TouchableWithoutFeedback>       
               }
            />
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
  itemmark:{
    textAlign:'center',fontWeight:'bold',fontSize:20,marginBottom:10,paddingTop:5
  },
  item:{
    color:'grey', 
    fontSize:16,
    fontWeight:'bold',
    textAlign: 'center',
  },
  SectionHeaderStyle: {
    backgroundColor: '#262d38',
    fontSize: 16,
    padding: 4,
    textAlign:'center',
    color: '#fff',
  },
});