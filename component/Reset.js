import React, { Component } from 'react';
import {Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import Toast from './Toast';

const width = Dimensions.get('window').width;
export default class Reset extends Component {
    static navigationOptions = {
      title: (
             <Image resizeMode='stretch' style={{width:(width-(width/1.5)),height:25 }} source={require('../image/rant.png')} />
          ),    
      headerLeft:() => null,
      headerStyle: {
         backgroundColor: '#000',
         shadowColor : '#5bc4ff',
         shadowOpacity: 0,
         shadowOffset: {
           height: 0,
         },
         shadowRadius: 0, 
      },
      headerTintColor: '#fff',
      headerTitleAlign:'center',
      headerTitleStyle: {
         fontWeight: 'bold',
         textAlign: 'center',
         marginLeft: width/1.5,
         flexGrow:1,
         width: width,
         height: 30,
         marginTop:10,
         alignSelf:'center',
      },
    };
  
  constructor(props){     
     super(props);
     this.state = {
        email: '',
     }
  }

  login = () => {
    this.props.navigation.navigate('Login'); 
  }
  
  resetCode = () => {
    this.props.navigation.navigate('ResetCode',{
       email: this.state.email,
    });         
  }

  reset = () => {
     var data = new FormData();     
      data.append("email", this.state.email);
      fetch(global.baseurl+'reset.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.response == 'true'){
            this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Code sent to email.');
            this.resetCode();         
         }else{
            this.refs.hamaoToast.Default_Toast_Top_With_Different_Color(responseJson.response);
         }
       })
      .catch(function(error) {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
      });
  }  

  render() {
    return (
      <View style={styles.container}>
        <Toast ref = "hamaoToast"/>
        <View style={styles.topInputContainer}>
         <View style={styles.inputContainer}>
           <TextInput style={styles.inputs}
            placeholder="EMAIL"
            placeholderTextColor = "#fff"
            underlineColorAndroid='#fff' 
            onChangeText={(TextInputValue) => this.setState({email:TextInputValue})} />
         </View>

        <TouchableOpacity activeOpacity={0.2} style={styles.Loginbutton} onPress={()=>this.reset()}>
          <Text style={styles.buttonText}>RESET PASSWORD</Text>
        </TouchableOpacity>
        
        <TouchableOpacity activeOpacity={0.3} style={styles.Backbutton} onPress={()=>this.login()}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'black',
  },
  topInputContainer:{
    marginTop:80,
    alignItems:'center',
    justifyContent:'center',    
  },
  Loginbutton:{
    width:'55%',
    height:50,
    backgroundColor:'#262829',
    borderWidth:2,
    borderColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
  },
  Backbutton:{
    marginTop:20,
    width:'55%',
    height:50,
    backgroundColor:'#262829',
    alignItems:'center',
    justifyContent:'center',
    borderWidth:2,
    borderColor:'#fff',
    borderRadius:100,
    marginBottom:60,
  },
  buttonText:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center',
    color:'white'
  },
  inputContainer: {
    backgroundColor: 'transparent',
    width:'90%',
    height:45,
    marginBottom:40,
  },
  inputs:{
    height:45,
    borderBottomWidth:1,
    borderBottomColor: '#FFF',
    flex:1,
    color:'#fff'
  },

});