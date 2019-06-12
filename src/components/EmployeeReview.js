import React from 'react';
import { StyleSheet, AsyncStorage,RefreshControl,TouchableOpacity,Image, Text, View, FlatList, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { db } from '../config/db';
import { Card } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default class EmployeeReview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isRefreshing: true,

        }
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        const setState = this.setState.bind(this);
        AsyncStorage.getItem('recordId').then((recordId) => {
            db.ref('Review').once('value', function (snapshot) {
                snapshot.forEach(function (_child_snapshot) {
                    _child_snapshot.forEach(function (child) {
                        if (child.key === recordId) {
                            setState({ data: Object.values(child.val()) }, function () {
                                console.log("data :" + JSON.stringify(this.state.data))
                            })
                        }
                    })
                })
            })
        })
        setState({isRefreshing:false})


    }

    ListEmpty = () => {
        return (
            //View to show when list is empty
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#262d38'
                }}>
                    <Text style={{ width: '100%', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 17 }}>No Reviews..!.</Text>
                </View>
                <TouchableOpacity onPress={this.onRefresh}>
                    <Image style={{ width: 40, height: 40, marginTop: 100 }} source={require('../images/refresh.png')} />
                </TouchableOpacity>

            </View>
        );
    }

    getColor = (item) => {
        var percent = item.result
        console.log(percent + '%')
        if (percent < 40) {
            return 'red'
        } else if (percent >= 40 && percent < 60) {
            return 'orange'
        } else if (percent >= 60) {
            return 'green'
        }
    }
    myReviewClick(item) {
        console.log("my review " + JSON.stringify(item))
        if (item !== null)
            Actions.editReview({ item, view: false })
    }

    onRefresh = () => {
        this.setState({ data: [] }, function () {
            this.getData();
        });
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.data}
                    ListEmptyComponent={this.ListEmpty}
                    extraData={this.state}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                    renderItem={({ item, index }) =>
                        <TouchableWithoutFeedback onPress={() => { this.myReviewClick(item) }}>
                            <Card
                                containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5, marginBottom: 4 }}
                                title={item.title}
                                titleStyle={{ fontSize: 18 }}>
                                <Text style={styles.item}>
                                    {item.startdate} - {item.enddate}
                                </Text>
                                <Text style={[styles.itemmark, { color: this.getColor(item) }]}>
                                    {Math.round(item.result) + ' %'}
                                </Text>

                            </Card>
                        </TouchableWithoutFeedback>
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
    },
    item: {
        color: '#000',
        fontSize: 15,
        textAlign: 'center',
    },
    itemmark: {
        textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 10, paddingTop: 5
    },
});