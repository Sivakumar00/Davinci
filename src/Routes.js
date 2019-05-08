import React,{Component} from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux'; 

import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'

export default class Routes extends React.Component{
    render(){
        return(
            <Router>
              <Stack key="root" hideNavBar={true }>
                    <Scene key="login" component={Login} title="Login" initial={true}/>
                    <Scene key="signup" component={SignUp} title="Register"/>
                    <Scene key="home" component={Home} title="Home" />
                </Stack>
            </Router>
        )
    }
}