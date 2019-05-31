import React from 'react';
import { StyleSheet,Text, ScrollView, Image, FlatList, View, AsyncStorage} from 'react-native';
import EmployeeList from './EmployeeList';

export default class OrganisationalTree extends React.Component {

  _renderRow = (rowItem, rowId, sectionId) => <Text>{rowItem.employeeFname}</Text>;
  _renderSection = (section, sectionId)  => <Text>{section.employeeFname}</Text>;

    constructor(props){
        super(props)
        this.state={
            userId:'',
            recordId:'',
            userEmail:'',
            userName:'',
            isLoading:true,
            data:[],
            mydata:[],
            sample:[]
    }
  }

    componentDidMount(){
      this.getRecordId(); 
      this._loadInitialState().done(); 
     // console.log(this.treeView.getRawData())
    //   db.ref('/items').push({
    //     name: 'siva'
    // });
    }

    _loadInitialState= async()=>{
        var resultJson ={};
        fetch('https://people.zoho.com/people/api/getSubOrdinates?authtoken=6e13da6b433aecfb0236a5ba09632032')
        .then(response => response.text())
        .then((response) => {
            var str =response;
            str=str.replace(/\d{18}/g,function(x){
              return '"'+x+'"';
            })
            return JSON.parse(str);
          })
          .then((responseJson) =>{
                  var json = responseJson.response.result;
                  var temp = {
                    "recordId": "249048000000917199",
                    "employeeLname": "NS",
                    "employeeFname": "Devaraj",
                    "employeeId": "VBI10117",
                    "employemailId": "devarajns@visualbi.com",
                    "reportingTo":""
                  }
                  json.push(temp);     

                  //to get immediate team
                  var myData =[];
                    for(var i=0;i<json.length;i++){
                        var temp1= json[i];

                        if(temp1.reportingTo === this.state.recordId){
                          myData.push(temp1)
                        }
                    }
                  this.setState({mydata:myData});
                  console.log(JSON.stringify(this.state.mydata))       
                  // var tree = unflatten(json);
                  // this.setState({data:tree});
          })
    }
    
    getRecordId= async() =>{
      var temp1 = await AsyncStorage.getItem('recordId');
      console.log('rer'+temp1);
      this.setState({recordId:temp1});
      //
      return temp1;
    }
    render() {
      return (
       <View>
         <EmployeeList data = {this.state.mydata}/>
       </View>

      );
    }
} 
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    height:100,
    backgroundColor: '#455a64',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
  }
});

function unflatten(arr) {
  var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.recordId] = arrElem;
    mappedArr[arrElem.recordId]['children'] = [];
  }


  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
    
      if (mappedElem.reportingTo) {
      
       try{
        mappedArr[mappedElem['reportingTo']]['children'].push(mappedElem);
       }
       catch(e){
         console.error(e);
       }
      }
      
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}


