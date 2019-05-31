import React from 'react';
import { StyleSheet,Text,TouchableWithoutFeedback ,Image  , View ,FlatList} from 'react-native';
import { Card } from 'react-native-elements';
import { Modal } from 'react-native-router-flux';
export default class EmployeeList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data:[],
      isModalVisible:false,
      image_uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png'
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
          <Text style={{textAlign:'center',marginTop:20,fontSize:20,fontWeight:'200',color:"white"}}>Loading ...</Text>
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
        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ backgroundColor: 'rgba(238,238,238,1)', borderRadius: 20, padding: 10, flex: 1, justifyContent: 'center' }}>
              <Image source = {{uri:this.state.image_uri}}/>
          </View>
 
        </Modal>

      </View>
    );
  }
  itemClick = (item)=>{
    this.setState({isModalVisible:true})
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