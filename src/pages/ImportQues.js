import React from 'react';
import { StyleSheet, Text, View, FlatList, BackHandler, NetInfo, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Logo from '../components/Logo'
import { Actions } from 'react-native-router-flux';
import { db } from '../config/db'
import { Constants } from 'expo'
import { Card, Header, Icon } from 'react-native-elements';
import Toast from 'react-native-root-toast';

export default class ImportQues extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            questions: [],
            data: [],
            borderColor:'white',
            currentView:-1,
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        this.getData()

    }
    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({ isConnected });
        } else {
            this.setState({ isConnected });
        }
    }

    handleBackButton = () => {

        if (Actions.state.index === 0) {
            return false
        }
        Actions.pop()
        return true
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);

    }
    getData() {
        const setState = this.setState.bind(this)
        var tempArr = this.state.data;

        db.ref('Questions').on('value', function (snapshot) {

            snapshot.forEach(function (childSnapshot) {
                childSnapshot.forEach(function (_childSnapshot) {
                    tempArr.push(_childSnapshot.val())
                })
            })
        })
        this.setState({ data: tempArr }, function () {

        })
    }
    ListEmptyAssessment = () => {
        return (
            //View to show when list is empty
            <View style={{
                flex: 1,
                maxHeight: 120,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#262d38'
            }}>
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17 }}>No Assessments.</Text>
            </View>
        );
    };

    ListEmptyContent = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', paddingTop: "15%",marginBottom:20 }}>
                <Icon
                    name='alert-circle'
                    color='white'
                    type='feather'
                    style={{ marginBottom: 10 }}
                    size={50}
                />
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>{'Select Question Template \n to view questions'}</Text>
            </View>
        )
    }
    _renderList = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback style={{ backgroundColor: 'transparent', borderRadius: 20, width: 200, }}
                onPress={() => {
                    this.setState({ questions: item.questions,currentView:index }, function () {
                        console.log("selected questions" + JSON.stringify(this.state.questions))
                    })
                }}>
                <Card
                    containerStyle={{ padding: 5, borderRadius: 10,borderWidth:3, borderColor:this.state.currentView === index? '#1e88e5':'white', backgroundColor: 'white', shadowRadius: 5 }}
                    title={item.title}
                    titleStyle={{ fontSize: 18, textAlign: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'black', textAlign: 'center' }}>
                        {item.fromdate} - {item.todate}
                    </Text>
                </Card>
            </TouchableWithoutFeedback>
        )
    }
    _renderQuesList = ({ item, index }) => {
        return (
            <View>
                <TouchableWithoutFeedback onPress={()=>{
                    var temp =this.state.data;

                    if(temp[this.state.currentView].questions[index].rating === ''){
                        if(this.state.currentView >=0){
                            temp[this.state.currentView].questions[index].rating = 'true'  
                            this.setState({data:temp}) 
                        }                     
                    }else{
                        if(this.state.currentView >=0){
                            temp[this.state.currentView].questions[index].rating = ''  
                            this.setState({data:temp}) 
                        }                     

                    }
                }}>
                <Card
                    containerStyle={{ padding: 10, borderRadius: 10,borderWidth:4,borderColor:this.state.data[this.state.currentView].questions[index].rating === 'true'?'green':'white', backgroundColor: 'white', shadowRadius: 5 }}>
                    <Text style={{fontSize:19,textAlign:'center',fontWeight:'bold',color:'grey',}}>{item.question+' ('+item.weightage+')'}</Text>
                </Card>
                </TouchableWithoutFeedback>
            </View>
        )

    }
    proceedToNextBtn(){
        var tempData = this.state.data
        var result=[];
        for(var i in tempData){
            for(var obj of tempData[i].questions){
                if(obj.rating === 'true'){
                    obj.rating = ''
                    result.push(obj);
                }
            }
        }   
        if(result.length>0){
            console.log(JSON.stringify(result))
            Actions.editTemplate({data:result});

        } else{
            Toast.show('Select atleast one question ..!', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header backgroundColor="#37474f"
                    centerComponent={{ text: 'Question Templates', style: { color: '#fff', fontSize: 20 } }}
                    rightComponent={ 
                <TouchableOpacity onPress={()=>{this.proceedToNextBtn()}}>
                    <Image source={require('../images/tick.png')} style={{width:25,height:28}}/>
                </TouchableOpacity>}
                />
                {!this.state.isConnected ?
                    <View style={styles.offlineContainer}>
                        <Text style={styles.offlineText}>No Internet Connection</Text>
                    </View> : null}
                <View style={{ flex: 1, maxHeight: 100, marginBottom: 10, justifyContent: 'center' }}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        horizontal={true}
                        ListEmptyComponent={this.ListEmptyAssessment}
                        renderItem={this._renderList}
                    />
                </View>
                <Text style={{ color: 'white', fontSize: 15, padding: 5, justifyContent: 'center', backgroundColor: '#37474f', marginTop: 10, textAlign: 'center', alignContent: 'center', borderColor: 'white', width: '100%' }}>Questions</Text>
                <FlatList
                    style={{width:'100%'}}
                    data={this.state.questions}
                    extraData={this.state}
                    ListEmptyComponent={this.ListEmptyContent}
                    renderItem={this._renderQuesList}
                />
               
            </View>
        );

    }

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#455a64',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width:'100%',
        position: 'absolute',
        top: 30
      },
      offlineText: { color: '#fff' }
    
});

