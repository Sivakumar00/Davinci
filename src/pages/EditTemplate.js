import React from 'react';
import { StyleSheet, Animated, AsyncStorage, Text, TextInput, FlatList, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, View, StatusBar } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import Modal from "react-native-modal";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Toast from 'react-native-root-toast';
import { db } from '../config/db'


export default class EditTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            title: '',
            fromdate: '',
            todate: '',
            activeRow: null,
            containerVisible: true,
            icon: 'ios-arrow-up',
            btnEnable: true,
            showProgress: false,
            isModalVisible: false,
            getEditQuestion: '',
            getEditWeight: '',
        }
        this.openProgress = this.openProgress.bind(this);
        this.hideProgress = this.hideProgress.bind(this);
        this.addQues = this.addQues.bind(this);
        this.rowTranslateAnimatedValues = {};

    }
    openProgress = () => {
        this.setState({ showProgress: true }, function () {
            console.log(this.state.showProgress)
        });
    }
    hideProgress = () => {
        this.setState({ showProgress: false });
    }

    deleteItem(item,index) {
        var temp = this.state.data
        this.setState({data:[]},function(){
            var result = []
            for (var i = 0; i < temp.length; i++) {
                if (i !== index) {
                    result.push(temp[i])
                }
            }
            this.setState({ data: result }, function () {
                console.log(JSON.stringify(this.state.data))
            })
    
        })
    }

    finishBtn() {
        this.setState({ showProgress: true }, function () {
            console.log(this.state.showProgress)
            this.setState({ btnEnable: false })
            var flag = true;
            var total = 0;

            for (var obj of this.state.data) {
                if (obj.question !== '' && obj.weightage !== '') {
                    total = total + parseInt(obj.weightage)
                } else {
                    flag = false;
                    break;
                }
            }
            console.log(JSON.stringify(this.state.data))
            if (flag && this.state.title !== '' && this.state.fromdate !== '' && this.state.todate !== '' && this.state.data !== null) {

                AsyncStorage.getItem('recordId').then((recordId) => {
                    var key = db.ref('/Questions/' + recordId).push().key;
                    console.log(key);
                    var toBeSaved = {
                        title: this.state.title,
                        fromdate: this.state.fromdate,
                        todate: this.state.todate,
                        questions: this.state.data,
                        total: total,
                        key: key,
                        createdby: recordId + '',
                    }
                    db.ref('/Questions/' + recordId + '/' + key).set(toBeSaved).then((data) => {
                        Toast.show('Assessment created ..!', {
                            duration: Toast.durations.LONG,
                            position: Toast.positions.BOTTOM,
                            shadow: true,
                            animation: true,
                            hideOnPress: true,
                            delay: 0,
                        })
                        //this.setState({btnEnable:true})
                        Actions.home();
                        this.hideProgress();

                    }).catch((error) => {
                        this.setState({ btnEnable: true })
                        Toast.show('Problem Occured :' + error, 200)
                    });
                })

            } else {
                this.setState({ btnEnable: true })
                this.hideProgress();
                Toast.show('Missing field values', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                })

            }
        });

        this.setState({ showProgress: false })
    }

    onClickAdd = () => {
        this.setState({ isModalVisible: true })
    }
    addQues() {
        if (this.state.getEditQuestion !== '' && this.state.getEditWeight !== '') {
            var temp = this.state.data;
            var json = {
                "comments": "",
                "question": this.state.getEditQuestion,
                "rating": "",
                "weightage": this.state.getEditWeight
            }
            temp.push(json);
            this.setState({ data: temp }, function () {
                this.setState({ isModalVisible: false })
            })
        }
    }

    render() {


        return (
            <KeyboardAvoidingView style={styles.container}>
                <Header backgroundColor="#37474f"
                    centerComponent={{ text: 'Modify Questions Set', style: { color: '#fff', fontSize: 20 } }}
                    rightComponent={{ icon: 'add-to-list',size:30, type: 'entypo', color: 'white', onPress: this.onClickAdd }}
                />
                {this.state.showProgress ? <ProgressDialog
                    title="Saving the Assessment"
                    activityIndicatorColor='blue'
                    activityIndicatorSize="large"
                    animationType="slide"
                    message="loading"
                    visible={true}
                /> : null}

                {this.state.containerVisible ? <View style={{ flex: 1, backgroundColor: '#37474f', maxHeight: 180 }}>
                    <TextInput
                        style={styles.inputbox}
                        placeholder='Assessment Title'
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => {
                            this.setState({ title: text })
                        }}
                    />
                    <DatePicker
                        style={{ width: 300, alignSelf: 'center', marginBottom: 10 }}
                        date={this.state.fromdate} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="Date From"
                        format="DD-MMM-YYYY"
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
                                borderRadius: 10,
                                paddingLeft: 20,
                            },
                            dateText: {
                                color: 'white'
                            }
                        }}
                        onDateChange={(date) => {
                            console.log(date.toUpperCase())
                            this.setState({ fromdate: date.toUpperCase() })
                        }}
                    />
                    <DatePicker
                        style={{ width: 300, alignSelf: 'center', marginBottom: 10 }}
                        date={this.state.todate}
                        mode="date" //The enum of date, datetime and time
                        placeholder="Date To"
                        format="DD-MMM-YYYY"
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
                                borderRadius: 10,
                                paddingLeft: 20
                            },
                            dateText: {
                                color: 'white'
                            }
                        }}
                        onDateChange={(date) => {
                            console.log(date.toUpperCase())
                            this.setState({ todate: date.toUpperCase() })
                        }}
                    />
                </View>
                    : null}

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ backgroundColor: 'rgba(238,238,238,1)', borderRadius: 20, padding: 10, flex: 1, justifyContent: 'center' }}>
                        <Text style={{ color: '#1e88e5', fontSize: 23, fontWeight: 'bold', textAlign: 'center' }}>Add Question</Text>

                        <TextInput
                            style={styles.editinputbox}
                            underlineColorAndroid='transparent'
                            placeholder={'Question'}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => {

                                this.setState({ getEditQuestion: text }, function () {
                                })
                            }}
                        ></TextInput>
                        <TextInput
                            style={styles.editinputbox}
                            underlineColorAndroid='transparent'
                            keyboardType={'numeric'}
                            placeholder={'Weightage'}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => {

                                this.setState({ getEditWeight: text })

                            }}
                        ></TextInput>
                        <TouchableOpacity style={{ backgroundColor: '#1e88e5', paddingLeft: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 30, marginBottom: 10, marginTop: 30 }} onPress={this.addQues} >
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#1e88e5', paddingLeft: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 30, marginBottom: 10 }} onPress={() => { this.setState({ isModalVisible: false }) }} >
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>


                <View style={{ flex: 1, maxHeight: 20 }}>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#262d38', width: '100%' }}
                        onPress={() => {
                            console.log(this.state.containerVisible)
                            this.setState({ containerVisible: !this.state.containerVisible }, function () {
                                if (this.state.containerVisible) {
                                    this.setState({ icon: 'ios-arrow-up' })
                                } else {
                                    this.setState({ icon: 'ios-arrow-down' })
                                }
                            })
                        }}
                    >
                        <Icon size={24} name={this.state.icon} type="ionicon" color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state.data}
                        renderItem={({ item, index }) => (
                            <View style={{width:'100%',flexDirection:'row',justifyContent:'center'}}>
                                <Card
                                    containerStyle={{marginLeft:10, padding: 5, borderRadius: 10, borderWidth: 3, backgroundColor: 'white',width:'80%', shadowRadius: 5 }}
                                >
                                    <Sae
                                        ref={'item' + index}
                                        label={'Question'}
                                        iconClass={FontAwesomeIcon}
                                        iconName={'pencil'}
                                        iconColor={'grey'}
                                        inputPadding={16}
                                        labelHeight={24}
                                        borderHeight={2}
                                        labelColor={'red'}
                                        inputStyle={{ color: 'black', fontSize: 17 }}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        defaultValue={item.question}
                                        onChangeText={(text) => {
                                            var temp = this.state.data;
                                            temp[index].question = text
                                            this.setState({ data: temp })
                                        }}
                                    />
                                    <Sae
                                        label={'Weightage'}
                                        iconClass={FontAwesomeIcon}
                                        iconName={'pencil'}
                                        iconColor={'grey'}
                                        inputPadding={16}
                                        labelHeight={24}
                                        keyboardType={'numeric'}
                                        inputStyle={{ color: 'black', fontSize: 17 }}
                                        borderHeight={2}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        defaultValue={item.weightage}
                                        onChangeText={(text) => {
                                            var temp = this.state.data;
                                            temp[index].weightage = text
                                            this.setState({ data: temp })
                                        }}
                                    />
                                </Card>
                                <TouchableOpacity style={{flex:1,width:'20%',backgroundColor:'transparent',justifyContent:'center',alignItems:'center',marginRight:10}}
                                    onPress={()=>{this.deleteItem(item,index)}}
                                >
                                    <Icon
                                        name='delete'
                                        size={30}
                                        color={"white"}
                                    />
                                </TouchableOpacity>
                            </View>)}
                    />

                    <KeyboardSpacer />
                </View>
                <TouchableOpacity disabled={!this.state.btnEnable} style={{ backgroundColor: '#1e88e5', width: '100%' }}
                    onPress={() => { this.finishBtn() }}
                >
                    <Text style={{ color: 'white', textAlign: 'center', padding: 10, fontSize: 18, fontWeight: 'bold' }}>Finish</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#455a64',
        justifyContent: 'center',
    },
    inputbox: {
        width: 300,
        alignSelf: 'center',
        borderRadius: 25,
        paddingLeft: 20,
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 20,
        marginBottom: 10,
        color: '#ffffff',
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    editinputbox: {
        width: 300,
        alignSelf: 'center',
        borderRadius: 25,
        paddingLeft: 20,
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 20,
        marginBottom: 10,
        color: '#000',
        backgroundColor: '#b0bec5'
    }

});