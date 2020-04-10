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
export default class ResetCode extends Component {
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
        code: '',
        email: '',
        password: '',
        confirm_password: '',
        varified : false,
     }
  }

  componentDidMount(){
    var email = this.props.navigation.state.params;
    this.setState({email:email.email})
  }

  login = () => {
    this.props.navigation.navigate('Login'); 
  }

  authenticate = () => {
     fetch(global.baseurl+'authenticating.php?email='+encodeURI(this.state.email)+'&code='+encodeURI(this.state.code), {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.response == 'yes'){
            this.setState({varified:true}); 
         }else{
            this.refs.hamaoToast.Default_Toast_Top_With_Different_Color(responseJson.response);
         }
       })
      .catch(function(error) {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
      });
  }

  reset = () => {
    fetch(global.baseurl+'updatepass.php?email='+encodeURI(this.state.email)+'&code='+encodeURI(this.state.code)+'&password='+encodeURI(this.state.password), {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         this.props.navigation.navigate('Login'); 
      })
      .catch(function(error) {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
      });
  }  

  render() {
    return (
      <View style={styles.container}>
        <Toast ref = "hamaoToast"/>
        {this.state.varified === true ? 
          <View style={styles.topInputContainer}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="PASSWORD"
              placeholderTextColor = "#fff"
              underlineColorAndroid='#fff' 
              secureTextEntry={true}
              onChangeText={(TextInputValue) => this.setState({password:TextInputValue})} />
           </View>
           
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="CONFIRM PASSWORD"
              placeholderTextColor = "#fff"
              underlineColorAndroid='#fff' 
              secureTextEntry={true}
              onChangeText={(TextInputValue) => this.setState({confirm_password:TextInputValue})} />
           </View>

          <TouchableOpacity activeOpacity={0.2} style={styles.Loginbutton} onPress={()=>this.reset()}>
            <Text style={styles.buttonText}> SAVE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.3} style={styles.Backbutton} onPress={()=>this.login()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          
          </View>
          :
          <View style={styles.topInputContainer}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="6 DIGIT CODE"
              placeholderTextColor = "#fff"
              underlineColorAndroid='#fff' 
              secureTextEntry={true}
              onChangeText={(TextInputValue) => this.setState({code:TextInputValue})} />
           </View>

          <TouchableOpacity activeOpacity={0.2} style={styles.Loginbutton} onPress={()=>this.authenticate()}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.3} style={styles.Backbutton} onPress={()=>this.login()}>
            <Text style={styles.buttonText}>BACK</Text>
          </TouchableOpacity>
          
          </View>
        }
        
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