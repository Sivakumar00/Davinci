import React from 'react';
import { StyleSheet,TextInput,Keyboard, Dimensions, TouchableOpacity,KeyboardAvoidingView, NetInfo, BackHandler, ImageBackground, Image, ActivityIndicator, AsyncStorage, Text, View, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SideSwipe from 'react-native-sideswipe';
import { Card } from 'react-native-elements';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { PagerDotIndicator, IndicatorViewPager} from 'rn-viewpager';

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
            height:0,
            rating:0,
            comments:'',
            snapPosition:0,
            headerheight:true,
            response:[],
            rightBtnVisible:true,
            currentIndex:0,
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
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    
    }

    _keyboardDidShow =()=> {
        const setState = this.setState.bind(this);
        setState({headerheight:false},function(){
            console.log(this.state.headerheight)
        })
      }
    
      _keyboardDidHide =()=> {
        const setState = this.setState.bind(this);
        setState({headerheight:true},function(){
            console.log(this.state.headerheight)
        })
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
    _renderDotIndicator() {
        return <PagerDotIndicator />;
    }
    render() {
        const { slider1ActiveSlide } = this.state;
        const { width } = Dimensions.get('window');
        const contentOffset = (width - 250) / 2;
    
        return (
            
            <View
                style={styles.container}
                >
                    {this.state.headerheight?
                    <View style={styles.header}>
                        <View style={styles.profilePicWrap}>
                            <Image style={styles.profilepic} source={{ uri: this.state.image }}></Image>
                        </View>
                        <View style={{flexDirection:'column'}}>
                            <Text style={styles.name}>{this.state.name}</Text>
                            <Text style={styles.position}>{"Attendance : " + this.state.present + " days"}</Text>
                            <ActivityIndicator animating={this.state.showProgress} />
                        </View>
                    </View>:null}
                <View style={{flex:1,height:450}}>
                        {/* <Carousel
                            ref={c => this._slider1Ref = c}
                            data={this.state.questions}                            
                            sliderWidth={sliderWidth}
                            itemWidth={itemWidth}
                            itemHeight={400}
                            style={{height:400}}
                            firstItem={SLIDER_1_FIRST_ITEM}
                            inactiveSlideScale={0.94}
                            inactiveSlideOpacity={0.7}
                            containerCustomStyle={styles.slider}
                            enableSnap={false}
                            contentContainerCustomStyle={styles.sliderContentContainer}
                            loop={false}
                            layout={"tinder"}
                            layoutCardOffset={18} 
                            onSnapToItem={(index) => {this.setState({ slider1ActiveSlide: index })
                                console.log(index+" onSnap ")
                            } }
    
                            renderItem={({item,index})=> */}
                            <IndicatorViewPager
                                ref={viewPager => { this.viewPager = viewPager; }}
                                style={{height:450,width:'90%',margin:20}}
                                scrollEnabled={false}
                                horizontalScroll={false}
                                indicator={this._renderDotIndicator()}
                                
                                >
                                {this.state.questions.map((item,index)=>
                                    <View style={{flex:1}}>
                                    <Card
                                        containerStyle={{height:330, padding: 5, borderRadius: 10, backgroundColor: 'white', shadowRadius: 5 }}
                                        title={(index+1)+") "+item.question}
                                        titleStyle={{ fontSize: 19 }}>
    
                                        <Text style={{fontSize:14, textAlign:'center', fontStyle:'italic',color:colors.gray}}>
                                            Star Rating for the Question
                                        </Text>
                                        <AirbnbRating 
                                            defaultRating={0}
                                            reviews={["1/5","2/5","3/5","4/5","5/5"]}
                                            onFinishRating={(rating)=>{
                                                this.setState({
                                                    rating:rating
                                                })
                                            }}
                                        />
                                        
                                        <TextInput 
                                            underlineColorAndroid='transparent' 
                                            placeholder='Comments (Optional)' 
                                            placeholderTextColor={colors.gray}
                                            multiline = {true}
                                            pointerEvents='none'
                                            numberOfLines = {4}
                                            onContentSizeChange={(event) => 
                                                this.setState({ height:event.nativeEvent.contentSize.height})
                                            }
                                            style={[styles.inputbox, {
                                              height:100
                                            }]}        
                                            onChangeText={(text)=>{
                                               // console.log(text)
                                               this.setState({
                                                   comments:text
                                               })
                                            }}
                                          />
                                
    
                                    </Card>
                                </View>
    
                                )}
                            </IndicatorViewPager>

                  
                </View >
                <View style={{alignItems:'center',justifyContent:'center' ,flexDirection:'row',marginTop:60,marginBottom:30}}>
                {this.state.snapPosition?<TouchableOpacity style ={{width:60,height:60,backgroundColor:'transparent',marginRight:30}} 
                        onPress={()=>{
                            if(this.state.snapPosition > 0){
                                
                                var position =  this.state.snapPosition - 1;
                                this.viewPager.setPage(position)
                                this.setState({snapPosition:position,rightBtnVisible:true},function(){
                                    console.log("moved: "+this.state.snapPosition)
                                })
                            }  else if(this.state.snapPosition){

                            } 
                        }} > 

                        <Image style={{height:60,width:60}} source={require('../images/left-arrow.png')}></Image>
                </TouchableOpacity>:null}

                {this.state.rightBtnVisible?
                <TouchableOpacity style ={{width:60,height:60,backgroundColor:'transparent',marginLeft:30}} 
                        onPress={()=>{
                            if(this.state.snapPosition === this.state.questions.length - 1){
                                this.setState({rightBtnVisible:false})
                            }else if(this.state.snapPosition >=0 && this.state.snapPosition< this.state.questions.length){
                                
                                var position =  this.state.snapPosition + 1;
                                this.setState({snapPosition:position},function(){
                                    this.viewPager.setPage(position)
                                    console.log("moved: "+this.state.snapPosition)
                                })

                            }
                        }} >
                        <Image style={{height:60,width:60}} source={require('../images/right-arrow.png')}></Image>
                </TouchableOpacity>:null}
                </View> 
                <TouchableOpacity style ={{backgroundColor:'#1e88e5',paddingLeft:20,paddingTop:10,paddingBottom:10, borderRadius:30,marginBottom:10,marginTop:30,marginLeft:20,marginRight:20}} >
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
        justifyContent: 'center'
    },
    headerbackground: {
        flex: 1,
        width: null,
        maxHeight: 100,
        alignSelf: 'stretch'
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection:'row'
    },
    profilePicWrap: {
        width: 75,
        height: 75,
        borderRadius: 100,
        borderColor: 'rgba(0,0,0,0.4)',
        marginRight:10,
        marginTop:10,
        borderWidth: 5,
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