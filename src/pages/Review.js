import React from 'react';
import { StyleSheet,TextInput, Dimensions, TouchableOpacity,KeyboardAvoidingView, NetInfo, BackHandler, ImageBackground, Image, ActivityIndicator, AsyncStorage, Text, View, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { Card } from 'react-native-elements';
import { Rating, AirbnbRating } from 'react-native-ratings';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(85);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const SLIDER_1_FIRST_ITEM = 0;

export default class Review extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            recordId: '',
            questions: [],
            title: '',
            startdate: '',
            enddate: '',
            key: '',
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            employeeName: '',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png',
            isLoading: true,
            email: '',
            present: 0,
            showProgress: true,
        }
        this._loadInit = this._loadInit.bind(this)
        this.hideProgress = this.hideProgress.bind(this)

    }
    openProgress = () => {
        this.setState({ showProgress: true });
    }

    hideProgress = () => {
        this.setState({ showProgress: false });
    }

    componentDidMount() {
        this._loadInit();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }
    //back handler methods
    handleBackButton = () => {

        if (Actions.state.index === 0) {
            return false
        }
        Actions.pop()
        return true
    }
    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({ isConnected });
        } else {
            this.setState({ isConnected });
        }
    }
    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
      }
    //other methods
    _loadInit() {
        var jsonItem = this.props.item;
        var jsonAssItem = this.props.assessmentItem;
        console.log("assessment detaisl  " + JSON.stringify(jsonAssItem))
        this.setState({
            recordId: jsonItem.recordId,
            employeeName: jsonItem.employeeFname + " " + jsonItem.employeeLname,
            questions: jsonAssItem.questions,
            title: jsonAssItem.title,
            startdate: jsonAssItem.fromdate,
            enddate: jsonAssItem.todate,
            key: jsonAssItem.key,
            email: jsonItem.employemailId,

        }, function () {
            const setState = this.setState.bind(this);
            console.log(this.state.startdate + " " + this.state.enddate + "  - " + this.state.email)
            //employee api fetch
            fetch('https://people.zoho.com/people/api/attendance/getUserReport?authtoken=6e13da6b433aecfb0236a5ba09632032&sdate=' + this.state.startdate + '&edate=' + this.state.enddate + '&emailId=' + this.state.email + '&dateFormat=dd-MMM-yyyy')
                .then((response) => response.json())
                .then((responsedata) => {
                    //console.log(JSON.stringify(responsedata))
                    var arr = Object.values(responsedata);
                    var present = 0;
                    arr.forEach(function (data, index) {
                        if (data.Status === 'Present') {
                            present = present + 1
                        }
                        setState({ present: present })
                    })

                }).catch((err) => { console.log(err) })

            fetch('https://people.zoho.com/people/api/forms/P_EmployeeView/records?authtoken=6e13da6b433aecfb0236a5ba09632032&searchColumn=EMPLOYEEMAILALIAS&searchValue=' + this.state.email)
                .then((response) => response.json())
                .then((responsedata) => {
                    var image = responsedata[0].Photo
                    if (image.includes('api')) {
                        this.setState({
                            image: image + '&authtoken=6e13da6b433aecfb0236a5ba09632032',
                            name: responsedata[0].ownerName,
                            showProgress: false
                        })
                    } else {
                        this.setState(
                            {
                                image: responsedata[0].Photo,
                                name: responsedata[0].ownerName,
                                showProgress: false
                            })
                    }

                })
        })

    }

    render() {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.container}>
                <ImageBackground style={styles.headerbackground} source={require('../images/visualbi_logo.png')}>
                    <View style={styles.header}>
                        <View style={styles.profilePicWrap}>
                            <Image style={styles.profilepic} source={{ uri: this.state.image }}></Image>
                        </View>

                        <Text style={styles.name}>{this.state.name}</Text>
                        <Text style={styles.position}>{"Attendance : " + this.state.present + " days for given time range"}</Text>
                        <ActivityIndicator animating={this.state.showProgress} />
                    </View>
                </ImageBackground>
                <View style={{flex:1}}>
                    <Carousel
                        ref={c => this._slider1Ref = c}
                        data={this.state.questions}
                        renderItem={({item,index})=>
                            <View>
                                <Card
                                    containerStyle={{ padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                                    title={(index+1)+") "+item.question}
                                    titleStyle={{ fontSize: 19 }}>
                                    <Text style={{fontSize:14, textAlign:'center', fontStyle:'italic',color:colors.gray}}>
                                        Star Rating for the Question
                                    </Text>
                                    <Rating
                                        showRating
                                        onFinishRating={this.ratingCompleted}
                                        style={{ paddingVertical: 10 }}
                                    />
                                    <TextInput 
                                        style={styles.inputbox}
                                        underlineColorAndroid='transparent' 
                                        placeholder='Comments (Optional)' 
                                        placeholderTextColor={colors.gray}
                                        multiline = {true}
                                        numberOfLines = {4}
                                        onChangeText={(text)=>{
                                            console.log(text)
                                        }}
                                    />


                                </Card>
                            </View>
                        }
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        style={{height:300}}
                        firstItem={SLIDER_1_FIRST_ITEM}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.7}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        loop={false}
                        layout={"tinder"}
                        layoutCardOffset={18} 
                        onSnapToItem={(index) => {this.setState({ slider1ActiveSlide: index })
                            console.log(index+" onSnap ")
                        } }
                    />
                    <Pagination
                    dotsLength={this.state.questions.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={'rgba(255, 255, 255, 0.92)'}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={colors.black}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                    />
                    
                </View>
                <TouchableOpacity style ={{backgroundColor:'#1e88e5',paddingLeft:20,paddingTop:10,paddingBottom:10, borderRadius:30,marginBottom:10,marginTop:30,marginLeft:20,marginRight:20}} onPress={this.reSubmitQues} >
                    <Text style={{color:'#fff',textAlign:'center'}}>Finish</Text>
                </TouchableOpacity>
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
    headerbackground: {
        flex: 1,
        width: null,
        maxHeight: 200,
        alignSelf: 'stretch'
    },
    header: {
        alignItems: 'center',
        padding: 20,
        maxHeight: 200,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    profilePicWrap: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 100,
        borderColor: 'rgba(0,0,0,0.4)',
        borderWidth: 16,
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
        marginTop: 10,
        fontSize: 19,
        color: '#fff',
        fontWeight: 'bold'
    },
    position: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '300',
        fontStyle: 'italic'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    },
    inputbox:{
        width:'100%',
        alignSelf:'center',
        height:100,
        borderRadius:12, 
        paddingLeft:20,
        paddingTop:8,
        paddingBottom:8,
        marginTop:20,
        marginLeft:30,
        textAlignVertical:'top',
        marginRight:30,
        marginBottom:10,
        color:'#000',
        backgroundColor:'#cfd8dc'
      }
});
const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};