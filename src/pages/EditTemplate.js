import React from 'react';
import { StyleSheet, AsyncStorage, Text, TextInput, FlatList, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, View, StatusBar } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import KeyboardSpacer from 'react-native-keyboard-spacer';
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

        }
    }

    _renderList = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback style={{ backgroundColor: 'transparent', borderRadius: 20, width: 200, }}
                onPress={() => { console.log('adf') }}>
                <Card
                    containerStyle={{ padding: 5, borderRadius: 10, borderWidth: 3, backgroundColor: 'white', shadowRadius: 5 }}
                >
                    <Sae
                        ref={'item'+index}
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
                        onSubmitEditing={() => {
                            let reference = 'itemW' + (index);
                            this.refs[reference].focus()
                        }}
                        defaultValue={item.question}
                        onChangeText={(text) => {
                            var temp = this.state.data;
                            temp[index].question = text
                            this.setState({ data: temp })
                        }}
                    />
                    <Sae
                        ref={'itemW'+index}
                        label={'Weightage'}
                        iconClass={FontAwesomeIcon}
                        iconName={'pencil'}
                        iconColor={'grey'}
                        inputPadding={16}
                        labelHeight={24}
                        inputStyle={{ color: 'black', fontSize: 17 }}
                        borderHeight={2}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        defaultValue={item.weightage}
                        onSubmitEditing={()=>{
                            let reference = 'item'+(index+1)
                            this.refs[reference].focus()
                        }}
                        onChangeText={(text) => {
                            var temp = this.state.data;
                            temp[index].weightage = text
                            this.setState({ data: temp })
                        }}
                    />
                </Card>
            </TouchableWithoutFeedback>
        );
    }

    finishBtn() {
        var flag = true;
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
            var total = 0;

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
                    Actions.pop();
                }).catch((error) => { Toast.show('Problem Occured :' + error, 200) });
            })

        } else {
            Toast.show('Missing field values', {
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
            <KeyboardAvoidingView style={styles.container}>
                <Header backgroundColor="#37474f"
                    centerComponent={{ text: 'Modify Questions Set', style: { color: '#fff', fontSize: 20 } }}
                />
                <View style={{ flex: 1, backgroundColor: '#37474f', maxHeight: 180 }}>
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
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        renderItem={this._renderList}
                    />
                    <KeyboardSpacer />
                </View>
                <TouchableOpacity style={{ backgroundColor: '#1e88e5', width: '100%' }}
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