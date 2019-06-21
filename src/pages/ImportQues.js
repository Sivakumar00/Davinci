import React from 'react';
import { StyleSheet, Text, View, FlatList, BackHandler, NetInfo, Image, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo'
import { Actions } from 'react-native-router-flux';
import { db } from '../config/db'
import { Constants } from 'expo'
import { Card } from 'react-native-elements';

export default class ImportQues extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            questions: [],
            data: [],
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
                maxHeight:120,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#262d38'
            }}>
                <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17 }}>No Assessments.</Text>
            </View>
        );
    };

    _renderList = ({item,index}) => {
        return (
            <TouchableOpacity style={{ backgroundColor: 'transparent', borderRadius: 20, width: 200, }}>
                <Card
                    containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                    title={item.title}
                    titleStyle={{ fontSize: 18,textAlign:'center' }}>
                    <Text style={{fontSize:10,color:'black',textAlign:'center'}}>
                        {item.fromdate} - {item.todate}
                    </Text>
                </Card>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                {!this.state.isConnected ?
                    <View style={styles.offlineContainer}>
                        <Text style={styles.offlineText}>No Internet Connection</Text>
                    </View> : null}
                <Text style={{ color: 'white', marginTop: 10, marginBottom:20, fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}> Questions Templates</Text>
                <View style={{ flex: 1, maxHeight: 120, justifyContent: 'center' }}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        horizontal={true}
                        ListEmptyComponent={this.ListEmptyAssessment}
                        renderItem={this._renderList}
                    />
                </View>
            </View>
        );

    }

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#455a64',
        flexGrow: 1,
        paddingTop: Constants.statusBarHeight,
        alignItems: 'center',
        justifyContent: 'center'
    },

});

