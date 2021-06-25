import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Alert, Text, View, Image, ImageBackground, AsyncStorage, ActivityIndicator } from 'react-native';
import { db } from '../config/db';
import { Actions } from 'react-native-router-flux';
import { Header } from 'react-native-elements';
export default class HeaderPro extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            userEmail: '',
            position: '',
            userId: '',
            showProgress: true,
            isLoading: true,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png',

        }
    }
    openProgress = () => {
        this.setState({ showProgress: true });
    }
    hideProgress = () => {
        this.setState({ showProgress: false });
    }
    componentDidMount() {
        this._loadInitialState().done();
    }
    _loadInitialState = async () => {

        // to fetch employee details https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken=9c69640f94ebb37f50ca148734b2c5e4&searchColumn=EMPLOYEEMAILALIAS&searchValue=charless@zykler.com
        var value = await AsyncStorage.getItem('user');
        var userEmail = await AsyncStorage.getItem('userEmail');
        if (value !== null) {
            console.log("user id :" + value);
            this.setState({ userId: value });
            this.setState({ userEmail: userEmail });
            console.log(this.state.userEmail);
            var endpoint = 'https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken=' + value + '&searchColumn=EMPLOYEEMAILALIAS&searchValue=' + this.state.userEmail
            console.log("endpoint :" + endpoint)
            fetch(endpoint)
                .then((response) => response.json())
                .then((responseJson) => {
                    var json = responseJson[0];
                    console.log(json.Photo);
                    var image = '';
                    if (json.Photo.includes('api')) {
                        image = json.Photo + '&authtoken=' + value;
                    } else {
                        image = json.Photo;
                    }
                    this.saveUserID(json.recordId);
                    this.setState({
                        isLoading: false,
                        image,
                        username: json['First Name'],
                        position: responseJson[0].Title
                    })

                    var storeData = {
                        userEmail: this.state.userEmail,
                        userName: this.state.username,
                        userPosition: this.state.position,
                        userPhoto: json.Photo,
                    }

                    AsyncStorage.setItem('recordId', json.recordId);
                    console.log("record Id " + json.recordId);
                    db.ref('/Users/' + json.recordId).once('value', function (snapshot) {
                        if (!snapshot.exists()) {
                            db.ref('/Users/' + json.recordId).set(storeData)
                                .then((data) => {
                                    console.log("Data inserted ..!")
                                }).catch((error) => {
                                    console.error(error)
                                })
                        }
                    })

                })

        }
        this.hideProgress();
    }

    onLogout = () => {
        console.log("on logout")
        Alert.alert(
            'Logout',
            'Are you sure to logout from your account?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: this.logout
            }], {
                cancelable: false
            }
        )
    }

    logout = () => {
        console.log("logout entered")
        AsyncStorage.removeItem('user').then((err) => {
            console.log("user id removed !!")
        })
        AsyncStorage.removeItem('recordId').then((err) => {
            console.log("user record id removed !!")
        })
        AsyncStorage.removeItem('userEmail').then((Err) => {
            console.log("user email removed !!")
        })
        Actions.login();
    }


    saveUserID = async userId => {
        try {
            await AsyncStorage.setItem('recordId', userId);
            console.log(await AsyncStorage.getItem('recordId'))

        } catch (error) {
            console.error(error);

        }
    }
    render() {
        return (

            <View style={styles.headerbackground} >
                <View style={{ flex: 1 }}>
                    <Header
                        backgroundColor="transparent"
                        centerComponent={{ text: 'D A V I N C I', style: { fontSize: 20, fontWeight: 'bold', color: '#fff' } }}
                    />
                </View>
                <View style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={styles.header}>
                        <View style={styles.profilePicWrap}>
                            <Image style={styles.profilepic} source={{ uri: this.state.image }}></Image>
                        </View>
                        <View style={{ flex: 1, width: '70%', marginLeft: 20 }}>
                            <Text style={styles.name}>{this.state.username}</Text>
                            <Text style={styles.position}>{this.state.position}</Text>
                            {!this.state.isLoading?<TouchableOpacity style={{ backgroundColor: 'white', marginTop: 5, borderRadius: 10, width: 60 }} onPress={this.onLogout}>
                                <Text style={{ color: 'red', paddingLeft: 5, textAlign: 'center', paddingRight: 5, paddingTop: 2, paddingBottom: 3, fontSize: 14 }}>Logout</Text>
                            </TouchableOpacity>:null}
                            <ActivityIndicator animating={this.state.isLoading} />
                        </View>

                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    headerbackground: {
        flex: 1,
        width: null,
        maxHeight: 200,
        backgroundColor: '#262d38',
        alignSelf: 'stretch'
    },
    header: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        maxHeight: 200,
        marginBottom:20
    },
    profilePicWrap: {
        width: '30%',
        height: 100,
        borderRadius: 100,
        alignItems: 'center',
        borderColor: 'rgba(0,0,0,0.4)',
        borderWidth: 10,
    },
    profilepic: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 4,
    },
    name: {
        marginTop: 6,
        fontSize: 19,
        color: '#fff',
        fontWeight: 'bold'
    },
    position: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '300',
        fontStyle: 'italic'
    }

}); 