  import React, { Component } from 'react';
  import {ActivityIndicator,Dimensions,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
  import {createAppContainer} from 'react-navigation';
  import {createStackNavigator} from 'react-navigation-stack';
  import {Icon} from 'react-native-elements';
  import logo_back from '../image/logo_back.jpg';
  import logos from '../image/logo.png';
  import rant from '../image/rant.png';
  import Toast from './Toast';
  import AsyncStorage from '@react-native-community/async-storage';

  const width = Dimensions.get('window').width;
  export default class Login extends Component {
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
        email   : '',
        password: '',
        showIndicator: false,
        showsideb: false,
      }

       this.goBack=this.goBack.bind(this);
       this.Home=this.Home.bind(this);
       this.loginfunction=this.loginfunction.bind(this);
       this.storeData=this.storeData.bind(this);
    }
    storeData = async (name, value) => {
      try {
        await AsyncStorage.setItem('userdata', value)
      } catch (e) {
      }
    }
    loginfunction = () => {
     if(this.state.email && this.state.password){
       this.setState({showIndicator: true})
       var data = new FormData();     
        data.append("email", this.state.email);
        data.append("password", this.state.password);
       fetch(global.baseurl+'login.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: data,
        })
        .then((response) => response.json())
        .then((responseJson) => {
             this.setState({showIndicator: false})
              if(responseJson.response == 'true'){
              this.storeData('userdata', JSON.stringify(responseJson));
             // console.log(responseJson);
              global.userdata = responseJson;
              this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Succesffuly logged in.');
              this.Home();
           }else if(responseJson.response == 'unverfied'){
              //storeData('user', responseJson);
              this.storeData('userdata', JSON.stringify(responseJson));
              global.userdata = responseJson;
              this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Verify Email');
              this.Verify();
           }else{
              this.refs.hamaoToast.Default_Toast_Top_With_Different_Color(responseJson.response);
           }
         })
        .catch(function(error) {
          this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
        });
      }else{
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Please fill all required fields.');
      }  
    }  
    goBack(){
      this.props.navigation.navigate('MainScreen'); 
    }
    
    Home(){
      this.props.navigation.navigate('Home', {naveen: Math.random()}); 
    }
    Verify(){
      this.props.navigation.navigate('Home'); 
    }
    
    Reset = () => {
      this.props.navigation.navigate('Reset'); 
    }
    
    componentDidMount = () => {
    }

    render() {
      return (
        <View style={styles.container}>
           <Toast ref = "hamaoToast"/>
           <View style={styles.inputContainer}>
               <TextInput style={styles.inputs}
                placeholder="USERNAME / EMAIL"
                placeholderTextColor = "#fff"
                underlineColorAndroid='#fff'
                onChangeText={(TextInputValue) => this.setState({email:TextInputValue})} 
               />
           </View>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="PASSWORD"
              placeholderTextColor = "#fff"
              underlineColorAndroid='white'
              secureTextEntry={true}
              onChangeText={(TextInputValue) => this.setState({password:TextInputValue})} 
             />
           </View>
           <View style={styles.reset}>
             <Text onPress={()=>this.Reset()} style={styles.resetText}>Reset Password </Text>
           </View>

            {this.state.showIndicator ?
              <View style={styles.loader}>  
                 <ActivityIndicator size="large" color="white" width="150" height="150" /> 
              </View> : null
            }

           {this.state.showIndicator ? 
             <TouchableOpacity activeOpacity={0.2} style={styles.Loginbuttons} >
               <Text style={styles.buttonTexts}> </Text>
             </TouchableOpacity> : null
           }
           {!this.state.showIndicator ? 
             <TouchableOpacity activeOpacity={0.2} style={styles.Loginbutton} onPress={()=>this.loginfunction()}>
               <Text style={styles.buttonText}>LOGIN</Text>
             </TouchableOpacity> : null
           }

           <TouchableOpacity activeOpacity={0.6} style={styles.Backbutton} onPress={()=>this.goBack()}>
             <Text style={styles.buttonText}>GO BACK</Text>
           </TouchableOpacity>
    
       </View>
      );
    }
  }

  const styles = StyleSheet.create({
    loader: {
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign:'center',
      alignItems:'center',
      position: 'absolute',
      top: 150,
      bottom:0,
      left: 0,
      right: 0,
      zIndex: 2
    },
    container: {
      backgroundColor:'black',
      flex: 1,
      alignItems:'center',
      justifyContent:'center',
    },
    center:{
      flex: 1,
      alignItems:'center',
      justifyContent:'center',

    },
    Loginbutton:{
      marginTop:10,
      width:'50%',
      height:50,
      backgroundColor:'#262829',
      borderWidth:2,
      borderColor:'#fff',
      alignItems:'center',
      justifyContent:'center',
      borderRadius:100,
    },
    Loginbuttons:{
      marginTop:10,
      width:'50%',
      height:50,
      backgroundColor:'transparent',
      borderWidth:2,
      borderColor:'transparent',
      alignItems:'center',
      justifyContent:'center',
      borderRadius:100,
    },
    Backbutton:{
      marginTop:20,
      width:'50%',
      height:50,
      backgroundColor:'#262829',
      alignItems:'center',
      justifyContent:'center',
      borderWidth:2,
      borderColor:'#fff',
      borderRadius:100,
    },
    buttonText:{
      fontSize:18,
      fontWeight:'bold',
      textAlign:'center',
      color:'white'
    },
    buttonTexts:{
      fontSize:18,
      fontWeight:'bold',
      textAlign:'center',
      color:'white'
    },
    reset:{
      width:'100%',
      alignItems:'center',
      justifyContent:'center',
    },
    resetText:{
      textAlign:'center',
      padding:12,
      fontSize:17,
      textAlign:'justify',
      color:'white',
      fontWeight:'bold',
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