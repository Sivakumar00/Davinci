import React,{Component} from 'react';
import {BackHandler} from 'react-native';
import {Router, Stack, Scene,Reducer,Actions} from 'react-native-router-flux'; 

import Login from './pages/Login'
import Home from './pages/Home'
import CreateAssessment from './pages/CreateAssessment'
import Review from './pages/Review';
import ImportQues from  './pages/ImportQues'
import EditReview from './pages/EditReview';
import EditTemplate from './pages/EditTemplate'

const reducerCreate = params => {

    const defaultReducer = new Reducer(params);
  
    return (state, action) => {
      // Open this up in your console of choice and dive into this action variable
     // console.log('ACTION:', action);
      // Add some lines like this to grab the action you want
      if(action.type === 'Navigation/BACK' && state.index === 0){
        BackHandler.exitApp()
      }
      return defaultReducer(state, action);
    };
  };
  
export default class Routes extends React.Component{
    render(){
        return(
        <Router
            backAndroidHandler={this.onBackPress}
            createReducer={reducerCreate}>
              <Stack key="root" hideNavBar={true }>
                    <Scene key="login" component={Login} title="Login" initial={true}/>
                    <Scene key="home" component={Home} title="Home" />
                    <Scene key="Question" component = {CreateAssessment} title="Create Assessment" back={true} />
                    <Scene key="review" component = {Review} title = "Review" back={true}/>
                    <Scene key="editReview" component = {EditReview} title="Edit Review" back ={true}/>
                    <Scene key="importQues" component={ImportQues} title ="Import Questions" back={true}/>
                    <Scene key='editTemplate' component={EditTemplate} title = "Edit Template" back={true}/>
                </Stack>
            </Router>
        )
    }
    onBackPress() {
        if (Actions.state.index === 0) {
          return false
        }
        Actions.pop()
        return true
      }
}