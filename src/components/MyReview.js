import React from 'react';
import { StyleSheet,AsyncStorage,RefreshControl,FlatList,Text, View ,StatusBar} from 'react-native';
import { db } from '../config/db';
import { Card } from 'react-native-elements';


export default class MyReview extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data:[],
            isRefreshing:true,

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
                var response = Object.values(snapshot.val())
                setState({data:response},function(){
                    console.log('my review '+JSON.stringify(this.state.data));
                })
            })
        })
        setState({isRefreshing:false})
    }

  render() {
    return (

        //To-do --> card with data
        <View style={styles.container}>
            <FlatList
                data={this.state.data}
                extraData={this.state}
                refreshControl={ 
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh.bind(this)}
                  />
                }
                renderItem={({item,index})=>
                <Card
                    containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                    title={item.title}
                    titleStyle={{ fontSize: 18 }}>
                        <Text style={styles.item}>
                            {item.startdate} - {item.enddate}
                        </Text>
                </Card>          
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
  }
});