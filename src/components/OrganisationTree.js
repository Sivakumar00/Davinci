import React from 'react';
import { StyleSheet,Text,ScrollView,Image  , View } from 'react-native';

const authToken = "6e13da6b433aecfb0236a5ba09632032";
import { db } from '../config/db';
const RIGHT_ARROW = require('../images/right-arrow.png');
const DOWN_ARROW = require('../images/down-arrow.png');
import ExpanableList from 'react-native-expandable-section-list';

export default class OrganisationalTree extends React.Component {

  _renderRow = (rowItem, rowId, sectionId) => <Text>{rowItem.employeeFname}</Text>;
  _renderSection = (section, sectionId)  => <Text>{section.employeeFname}</Text>;

    constructor(props){
        super(props)
        this.state={
            userId:'',
            userEmail:'',
            userName:'',
            isLoading:true,
            data:[
              {
                "recordId": "249048000000917199",
                "employeeLname": "NS",
                "employeeFname": "Devaraj",
                "employeeId": "VBI10117",
                "employemailId": "devarajns@visualbi.com",
                "reportingTo": "",
                "children": [
                  {
                    "recordId": "249048000000058742",
                    "employeeLname": "Kesavan",
                    "employeeFname": "Kavitha",
                    "employeeId": "VBI10054",
                    "employemailId": "kavithak@visualbi.com",
                    "reportingTo": "249048000000917199",
                    "children": [
                      {
                        "recordId": "249048000000775037",
                        "employeeLname": "Gopalakrishnan",
                        "employeeFname": "Vignesh",
                        "employeeId": "VBI10108",
                        "employemailId": "vigneshg@visualbi.com",
                        "reportingTo": "249048000000058742",
                        "children": []
                      },
                      {
                        "recordId": "249048000001256205",
                        "employeeLname": "Rajendran",
                        "employeeFname": "Iswarya",
                        "employeeId": "VBI10137",
                        "employemailId": "iswaryar@visualbi.com",
                        "reportingTo": "249048000000058742",
                        "children": [
                          {
                            "recordId": "249048000000647153",
                            "employeeLname": "Ravichandran",
                            "employeeFname": "Naveen",
                            "employeeId": "VBI10104",
                            "employemailId": "naveenr@visualbi.com",
                            "reportingTo": "249048000001256205",
                            "children": []
                          },
                          {
                            "recordId": "249048000007942491",
                            "employeeLname": "Balaiah",
                            "employeeFname": "Deivendran",
                            "employeeId": "VBI10274",
                            "employemailId": "deivendranb@visualbi.com",
                            "reportingTo": "249048000001256205",
                            "children": []
                          },
                          {
                            "recordId": "249048000009976349",
                            "employeeLname": "Danabal",
                            "employeeFname": "Rajesh",
                            "employeeId": "VBI10298",
                            "employemailId": "rajeshd@visualbi.com",
                            "reportingTo": "249048000001256205",
                            "children": []
                          },
                          {
                            "recordId": "249048000010117142",
                            "employeeLname": "Palanisamy",
                            "employeeFname": "Ramakrishnan",
                            "employeeId": "VBI10300",
                            "employemailId": "ramakrishnanp@visualbi.com",
                            "reportingTo": "249048000001256205",
                            "children": []
                          }
                        ]
                      },
                      {
                        "recordId": "249048000002680229",
                        "employeeLname": "Muthukrishnan",
                        "employeeFname": "Manonmani",
                        "employeeId": "VBI10203",
                        "employemailId": "manonmanim@visualbi.com",
                        "reportingTo": "249048000000058742",
                        "children": []
                      },
                      {
                        "recordId": "249048000004352279",
                        "employeeLname": "Gali Srinivasan",
                        "employeeFname": "Murali",
                        "employeeId": "VBI10229",
                        "employemailId": "muraligs@visualbi.com",
                        "reportingTo": "249048000000058742",
                        "children": []
                      },
                      {
                        "recordId": "249048000007303587",
                        "employeeLname": "Geethamoorthy",
                        "employeeFname": "Nithya Vani",
                        "employeeId": "VBI10265",
                        "employemailId": "nithyavani@visualbi.com",
                        "reportingTo": "249048000000058742",
                        "children": []
                      }
                    ]
                  },
                  {
                    "recordId": "249048000004459913",
                    "employeeLname": "Mohanasundaram",
                    "employeeFname": "Srikkanth",
                    "employeeId": "VBI10234",
                    "employemailId": "srikkanthm@visualbi.com",
                    "reportingTo": "249048000000917199",
                    "children": [
                      {
                        "recordId": "249048000000857007",
                        "employeeLname": "Srinivasan",
                        "employeeFname": "Vivekanandan",
                        "employeeId": "VBI10110",
                        "employemailId": "vivekanandans@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      },
                      {
                        "recordId": "249048000000958007",
                        "employeeLname": "Venu",
                        "employeeFname": "Nithyanandam",
                        "employeeId": "VBI10119",
                        "employemailId": "nithyanandamv@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      },
                      {
                        "recordId": "249048000001307555",
                        "employeeLname": "Sambasivam",
                        "employeeFname": "Arulkumar",
                        "employeeId": "VBI10138",
                        "employemailId": "arulkumars@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      },
                      {
                        "recordId": "249048000001906563",
                        "employeeLname": "Natesan",
                        "employeeFname": "Praveen",
                        "employeeId": "VBI10194",
                        "employemailId": "praveenn@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      },
                      {
                        "recordId": "249048000003878337",
                        "employeeLname": "Kannan",
                        "employeeFname": "Aishwarya",
                        "employeeId": "VBI10225",
                        "employemailId": "aishwaryak@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      },
                      {
                        "recordId": "249048000005174279",
                        "employeeLname": "Rengarajan",
                        "employeeFname": "Giridharan",
                        "employeeId": "VBI10242",
                        "employemailId": "giridharanr@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      },
                      {
                        "recordId": "249048000005559251",
                        "employeeLname": "Bashyam",
                        "employeeFname": "Lakshmi",
                        "employeeId": "VBI10253",
                        "employemailId": "lakshmib@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      },
                      {
                        "recordId": "249048000010180784",
                        "employeeLname": "Sangaralingam",
                        "employeeFname": "Mithunraj",
                        "employeeId": "VBI10304",
                        "employemailId": "mithunrajs@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      },
                      {
                        "recordId": "249048000010253489",
                        "employeeLname": "Sathya Narayanan",
                        "employeeFname": "Ramakrishnan",
                        "employeeId": "VBI10305",
                        "employemailId": "ramakrishnansn@visualbi.com",
                        "reportingTo": "249048000004459913",
                        "children": []
                      }
                    ]
                  },
                  {
                    "recordId": "249048000005094211",
                    "employeeLname": "Gudimallam",
                    "employeeFname": "YogendraBabu",
                    "employeeId": "VBI10241",
                    "employemailId": "yogendrabg@visualbi.com",
                    "reportingTo": "249048000000917199",
                    "children": [
                      {
                        "recordId": "249048000000058754",
                        "employeeLname": "Perumal",
                        "employeeFname": "Veera Manikandan",
                        "employeeId": "VBI10055",
                        "employemailId": "veeramp@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000001414431",
                        "employeeLname": "Pugalendhi",
                        "employeeFname": "Yadhava Gowri",
                        "employeeId": "VBI10143",
                        "employemailId": "yadhavagowrip@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000003042214",
                        "employeeLname": "Sritharaboopathy",
                        "employeeFname": "Dhakshayani",
                        "employeeId": "VBI10181",
                        "employemailId": "dhakshayanis@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000003042268",
                        "employeeLname": "Rajendran",
                        "employeeFname": "Nandhini",
                        "employeeId": "VBI10182",
                        "employemailId": "nandhinir@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": [
                          {
                            "recordId": "249048000005435675",
                            "employeeLname": "Batmanaban",
                            "employeeFname": "Yogavardhani",
                            "employeeId": "VBI10247",
                            "employemailId": "yogavb@visualbi.com",
                            "reportingTo": "249048000003042268",
                            "children": []
                          },
                          {
                            "recordId": "249048000005559065",
                            "employeeLname": "Subramanian",
                            "employeeFname": "Sai Vidhya",
                            "employeeId": "VBI10250",
                            "employemailId": "saividhyas@visualbi.com",
                            "reportingTo": "249048000003042268",
                            "children": []
                          }
                        ]
                      },
                      {
                        "recordId": "249048000004978047",
                        "employeeLname": "Govindarajan",
                        "employeeFname": "Deepika",
                        "employeeId": "VBI10239",
                        "employemailId": "deepikag@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000005305059",
                        "employeeLname": "Raman",
                        "employeeFname": "Nithya",
                        "employeeId": "VBI10258",
                        "employemailId": "nithyar@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000005559003",
                        "employeeLname": "Rajendran",
                        "employeeFname": "Dilli Rajan",
                        "employeeId": "VBI10249",
                        "employemailId": "dillirajanr@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000007641289",
                        "employeeLname": "Prabhu",
                        "employeeFname": "Lavanyaa",
                        "employeeId": "VBI10292",
                        "employemailId": "lavanyaap@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000008534449",
                        "employeeLname": "Arunachalam",
                        "employeeFname": "Vignesh",
                        "employeeId": "VBI10281",
                        "employemailId": "vignesha@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000008594115",
                        "employeeLname": "Balasubramanian",
                        "employeeFname": "Indhu",
                        "employeeId": "VBI10282",
                        "employemailId": "indhub@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000010936303",
                        "employeeLname": "Ramamoorthy",
                        "employeeFname": "Poornima",
                        "employeeId": "VBI10314",
                        "employemailId": "poornimar@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000010985604",
                        "employeeLname": "Kothandapani",
                        "employeeFname": "Revathi",
                        "employeeId": "VBI3007",
                        "employemailId": "revathik@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      },
                      {
                        "recordId": "249048000011038443",
                        "employeeLname": "Ramamoorthy",
                        "employeeFname": "Kalaignarmani",
                        "employeeId": "VBI10316",
                        "employemailId": "kalair@visualbi.com",
                        "reportingTo": "249048000005094211",
                        "children": []
                      }
                    ]
                  },
                  {
                    "recordId": "249048000007354261",
                    "employeeLname": "Selvaraj",
                    "employeeFname": "Suganya",
                    "employeeId": "VBI10267",
                    "employemailId": "suganyas@visualbi.com",
                    "reportingTo": "249048000000917199",
                    "children": []
                  },
                  {
                    "recordId": "249048000007677949",
                    "employeeLname": "R V Lakshmanan",
                    "employeeFname": "Dinesh",
                    "employeeId": "VBI10273",
                    "employemailId": "dineshrvl@visualbi.com",
                    "reportingTo": "249048000000917199",
                    "children": [
                      {
                        "recordId": "249048000003087061",
                        "employeeLname": "Jayapragash",
                        "employeeFname": "Ganeshkumar",
                        "employeeId": "VBI10184",
                        "employemailId": "ganeshkumarj@visualbi.com",
                        "reportingTo": "249048000007677949",
                        "children": []
                      },
                      {
                        "recordId": "249048000003256181",
                        "employeeLname": "Jayachandra",
                        "employeeFname": "Keerthana",
                        "employeeId": "VBI10188",
                        "employemailId": "keerthanaj@visualbi.com",
                        "reportingTo": "249048000007677949",
                        "children": []
                      },
                      {
                        "recordId": "249048000008177109",
                        "employeeLname": "Jacco Jesuraj",
                        "employeeFname": "Arockia",
                        "employeeId": "VBI10276",
                        "employemailId": "arockiaj@visualbi.com",
                        "reportingTo": "249048000007677949",
                        "children": []
                      }
                    ]
                  },
                  {
                    "recordId": "249048000009838707",
                    "employeeLname": "Durairaj",
                    "employeeFname": "Mohan Raj",
                    "employeeId": "VBI10294",
                    "employemailId": "mohanrd@visualbi.com",
                    "reportingTo": "249048000000917199",
                    "children": [
                      {
                        "recordId": "249048000005578817",
                        "employeeLname": "Ramesh Babu",
                        "employeeFname": "Akshay",
                        "employeeId": "VBI10257",
                        "employemailId": "akshayr@visualbi.com",
                        "reportingTo": "249048000009838707",
                        "children": []
                      },
                      {
                        "recordId": "249048000008023001",
                        "employeeLname": "Gurunathan",
                        "employeeFname": "Saravana Kesavan",
                        "employeeId": "VBI10275",
                        "employemailId": "saravanak@visualbi.com",
                        "reportingTo": "249048000009838707",
                        "children": []
                      },
                      {
                        "recordId": "249048000008751406",
                        "employeeLname": "Kanappan",
                        "employeeFname": "Hari",
                        "employeeId": "VBI10283",
                        "employemailId": "harik@visualbi.com",
                        "reportingTo": "249048000009838707",
                        "children": []
                      },
                      {
                        "recordId": "249048000009160699",
                        "employeeLname": "Anbazhagan",
                        "employeeFname": "Sanjeev Kumar",
                        "employeeId": "VBI10287",
                        "employemailId": "sanjeevk@visualbi.com",
                        "reportingTo": "249048000009838707",
                        "children": []
                      },
                      {
                        "recordId": "249048000009764189",
                        "employeeLname": "Shanmugam",
                        "employeeFname": "Selvaraj",
                        "employeeId": "VBI10293",
                        "employemailId": "selvarajs@visualbi.com",
                        "reportingTo": "249048000009838707",
                        "children": []
                      },
                      {
                        "recordId": "249048000009838902",
                        "employeeLname": "Kannan",
                        "employeeFname": "Venkatramanan",
                        "employeeId": "VBI10295",
                        "employemailId": "venkatk@visualbi.com",
                        "reportingTo": "249048000009838707",
                        "children": []
                      },
                      {
                        "recordId": "249048000010117335",
                        "employeeLname": "Murali",
                        "employeeFname": "Aditya Rathinasamy",
                        "employeeId": "VBI10301",
                        "employemailId": "adityarm@visualbi.com",
                        "reportingTo": "249048000009838707",
                        "children": []
                      },
                      {
                        "recordId": "249048000010355289",
                        "employeeLname": "Badhusha Mohideen",
                        "employeeFname": "Mohamed Sameer",
                        "employeeId": "VBI10306",
                        "employemailId": "mohamedsbm@visualbi.com",
                        "reportingTo": "249048000009838707",
                        "children": []
                      }
                    ]
                  },
                  {
                    "recordId": "249048000010180581",
                    "employeeLname": "Mohamed",
                    "employeeFname": "Mahadeer",
                    "employeeId": "VBI10303",
                    "employemailId": "mahadeerm@visualbi.com",
                    "reportingTo": "249048000000917199",
                    "children": [
                      {
                        "recordId": "249048000009569317",
                        "employeeLname": "Raja",
                        "employeeFname": "Sureka",
                        "employeeId": "VBI10311",
                        "employemailId": "surekar@visualbi.com",
                        "reportingTo": "249048000010180581",
                        "children": []
                      },
                      {
                        "recordId": "249048000009622269",
                        "employeeLname": "Kumar",
                        "employeeFname": "Akileswari",
                        "employeeId": "VBI10332",
                        "employemailId": "akileswarik@visualbi.com",
                        "reportingTo": "249048000010180581",
                        "children": []
                      },
                      {
                        "recordId": "249048000009622355",
                        "employeeLname": "Rangasamy",
                        "employeeFname": "Kaviarasu",
                        "employeeId": "VBI10333",
                        "employemailId": "kaviarasur@visualbi.com",
                        "reportingTo": "249048000010180581",
                        "children": []
                      },
                      {
                        "recordId": "249048000010117528",
                        "employeeLname": "Cibi",
                        "employeeFname": "Arul Valan",
                        "employeeId": "VBI10334",
                        "employemailId": "arulvc@visualbi.com",
                        "reportingTo": "249048000010180581",
                        "children": []
                      },
                      {
                        "recordId": "249048000010146179",
                        "employeeLname": "Jacob",
                        "employeeFname": "Jefferson Swartz",
                        "employeeId": "VBI10302",
                        "employemailId": "jeffersonj@visualbi.com",
                        "reportingTo": "249048000010180581",
                        "children": []
                      },
                      {
                        "recordId": "249048000010669058",
                        "employeeLname": "Arivazhagan",
                        "employeeFname": "Sivakumar",
                        "employeeId": "VBI10335",
                        "employemailId": "sivakumara@visualbi.com",
                        "reportingTo": "249048000010180581",
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
        }
    }

    componentDidMount(){

      this._loadInitialState().done(); 
      console.log(this.treeView.getRawData())
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
                  var tree = unflatten(json);
                  this.setState({data:tree});
          })
    }
   
    render() {
      return (
       
        <ExpanableList
          dataSource={this.state.data}
          headerKey="employeeFname"
          memberKey="children"
          renderRow={this._renderRow}
          renderSectionHeaderX={this._renderSection}
          openOptions={[1,2,]}
        />
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
    paddingVertical: 20
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


