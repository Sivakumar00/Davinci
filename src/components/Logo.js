import React from 'react';
import { StyleSheet, Text, View ,Image} from 'react-native';


export default class Logo extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          <Image
            style={{width:80,height:80,marginLeft:20,alignSelf:'center'}}
            source={require('../images/visualbi_logo.png')}
          />
           <Image
           style={{height:12,width:200,marginTop:10,marginBottom:8}}
            source={require('../images/line.png')}
          />
          <Text style={styles.text}>
            D A V I N C I
          </Text>
      </View>
    ); 
  }
}
 
const styles=StyleSheet.create({
    container:{
        flexGrow:1,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    text:{
        color:'#e0e0e0',
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold'
      }
});