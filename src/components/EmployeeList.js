import React from 'react';
import { StyleSheet,Text,TouchableWithoutFeedback ,Image  , View ,FlatList} from 'react-native';
import { Card } from 'react-native-elements';
export default class EmployeeList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data:[
        {
          "recordId": "249048000000058742",
          "employeeLname": "Kesavan",
          "employeeFname": "Kavitha",
          "employeeId": "VBI10054",
          "employemailId": "kavithak@visualbi.com",
          "reportingTo": "249048000000917199"
        },
        {
          "recordId": "249048000004459913",
          "employeeLname": "Mohanasundaram",
          "employeeFname": "Srikkanth",
          "employeeId": "VBI10234",
          "employemailId": "srikkanthm@visualbi.com",
          "reportingTo": "249048000000917199"
        },
        {
          "recordId": "249048000005094211",
          "employeeLname": "Gudimallam",
          "employeeFname": "YogendraBabu",
          "employeeId": "VBI10241",
          "employemailId": "yogendrabg@visualbi.com",
          "reportingTo": "249048000000917199"
        },
        {
          "recordId": "249048000007354261",
          "employeeLname": "Selvaraj",
          "employeeFname": "Suganya",
          "employeeId": "VBI10267",
          "employemailId": "suganyas@visualbi.com",
          "reportingTo": "249048000000917199"
        },
        {
          "recordId": "249048000007677949",
          "employeeLname": "R V Lakshmanan",
          "employeeFname": "Dinesh",
          "employeeId": "VBI10273",
          "employemailId": "dineshrvl@visualbi.com",
          "reportingTo": "249048000000917199"
        },
        {
          "recordId": "249048000009838707",
          "employeeLname": "Durairaj",
          "employeeFname": "Mohan Raj",
          "employeeId": "VBI10294",
          "employemailId": "mohanrd@visualbi.com",
          "reportingTo": "249048000000917199"
        },
        {
          "recordId": "249048000010180581",
          "employeeLname": "Mohamed",
          "employeeFname": "Mahadeer",
          "employeeId": "VBI10303",
          "employemailId": "mahadeerm@visualbi.com",
          "reportingTo": "249048000000917199"
        }
      ]
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