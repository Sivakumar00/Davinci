import React from 'react';
import { StyleSheet,Text,TouchableWithoutFeedback ,Image  , View ,FlatList} from 'react-native';
import { Card } from 'react-native-elements';
export default class EmployeeList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data:[]
    }
  }

    componentDidMount(){
        console.log('mounted '+JSON.stringify(this.props.data))
    }
  renderFooter = () => {
    if (this.props.data.length != 0) return null;
  
  
    return (
      <View>
          <Image style = {{alignContent:'center',width:100,height:100, alignSelf:'center', marginTop:40}} 
                  source = {require('../images/visualbi_logo.png')}/>
          <Text style={{textAlign:'center',marginTop:20,fontSize:20,fontWeight:'200',color:"white"}}>You are not a Team manager</Text>
      </View>
      );
  };

  render() {
    return (
        <View style={styles.container}>
        <FlatList
          extraData={this.props}
          data = {this.props.data}
          ListFooterComponent={this.renderFooter}
          renderItem={({item}) =>
         <TouchableWithoutFeedback 
            onPress={()=>this.itemClick(item)}
          >
          <View>
             <Card
                containerStyle={{padding:5,borderRadius:10,backgroundColor:'white',shadowRadius:5}}
                title={item.employeeFname}
                titleStyle={{fontSize:18}}>
              <Text style={styles.item}>
                  {item.employeeId}
              </Text>
             </Card>
          </View>
        </TouchableWithoutFeedback > 
         }
        
         
        />
      </View>
    );
  }
  itemClick = (item)=>{
   // console.log(JSON.stringify(item))
    
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
  item:{
      color:'#000', 
      fontSize:15,
      textAlign: 'center',
  }
});