import React, { Component } from 'react';
import {Dimensions,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import MyStatus from './MyStatus';
import Footer from './Footer';
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default class MainScreen extends Component {
  static navigationOptions = {
    title: (<Image resizeMode='stretch' style={{width:120,height:25 }} source={require('../image/rant.png')} />),
    headerShown:false  
  };

  constructor(props){     
     super(props);
     this.login=this.login.bind(this);
     this.signup=this.signup.bind(this);
     this.facebooklogin=this.facebooklogin.bind(this);
     this.home=this.home.bind(this);
  }
  storeData = (name, value) => {
    AsyncStorage.setItem('userdata', value);
  }
  getData = async (name) => {
    try {
      const value = await AsyncStorage.getItem('userdata')
      if(value !== null) {
        global.userdata = JSON.parse(value);
        if(global.userdata.user_id){
           this.props.navigation.navigate('Home', {naveen: Math.random()}); 
        }
        return value;
      }
    } catch(e) {
      // error reading value
    }
  }
  login(){
    this.props.navigation.navigate('Login'); 
  }

  home(){
    if(global.userdata.user_id){
        this.storeData('userdata', JSON.stringify(global.userdata));
        this.props.navigation.navigate('Home', {naveen: Math.random()}); 
    }else{
        setTimeout(() => {this.home();}, 1500)
    }
  }
  signup(){
    this.props.navigation.navigate('SignUp'); 
  }
  async facebooklogin(){
    await LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              const infoRequest = new GraphRequest(
                '/me?fields=id,name,picture,email',
                null,
                (error, result) => {
                  if (error) {
                    console.log('Error fetching data: ' + error.toString());
                  } else {
                   var data = new FormData();
                    data.append("name", result.name);
                    data.append("email", result.email);
                    data.append("picture", result.picture.data.url);
                    fetch(global.baseurl+'socialregister.php', {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                      },
                      body: data,
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                       if(responseJson.response == 'true' || responseJson.response == 'login'){
                          global.userdata = responseJson;
                       }
                     })
                    .catch(function(error) {
                      console.log(error);
                    });

                  }
                }
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            }
          )
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
        setTimeout(() => {this.home();}, 1500)
  }
  componentDidMount = () => {
        this.getData(userdata);
  }

  render() {
    return (
      <View style={styles.container}>
       <MyStatus />
        <ImageBackground style={styles.imageBackground} source={require('../image/logo_back.jpg')}>
          <View style={styles.center}>
            <Image style={{marginBottom:20,width:100,height:110}} source={require('../image/logo.png')} />
            <Image style={{width:250,height:50}} source={require('../image/rant.png')} />
            <TouchableOpacity onPress={()=>this.login()} activeOpacity={0.2} style={styles.Loginbutton} >
               <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.signup()} activeOpacity={0.2} style={styles.Signupbutton} >
               <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Googlebutton} onPress={()=>this.facebooklogin()}>
              <Text style={styles.buttonText}>FACEBOOK</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>we don't post anything to Google. By signing in you agree to our Terms of service and Privacy Policy. </Text>
        
        </View>
        </ImageBackground>

     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },
  imageBackground:{
    width:'100%',
    height:'100%',
  },
  center:{
    flex: 1,
    alignItems:'center',
    justifyContent:'center',

  },
  Loginbutton:{
    marginTop:70,
    width:'70%',
    height:45,
    backgroundColor:'transparent',
    borderWidth:1,
    borderColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
  },
  Signupbutton:{
    marginTop:20,
    width:'70%',
    height:45,
    backgroundColor:'transparent',
    borderWidth:1,
    borderColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
  },
  Googlebuttons:{
    marginTop:5,
    width:'70%',
    height:30,
    backgroundColor:'#348feb',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
  },
  Googlebutton:{
    marginTop:25,
    width:'70%',
    height:45,
    backgroundColor:'#348feb',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
  },
  buttonText:{
    fontSize:16,
    fontWeight:'bold',
    textAlign:'center',
    color:'white'
  },
  termsText:{
    width:'70%',
    padding:12,
    fontSize:17,
    textAlign:'justify',
    color:'white'
  },

});