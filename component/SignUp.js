import React, { Component } from 'react';
import {ActivityIndicator,Dimensions,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import {Icon} from 'react-native-elements';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import Toast from './Toast';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
export default class SignUp extends Component {
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
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year    
     super(props);
     this.state = {
        showIndicator: false,
        dobText: month + '/' + date + '/' + year,
        dobDate: null,
        name: '',
        email: '',
        phone: '',
        password:'',
        cpassword:'',
        dob   : '',
     }
     this.go=this.go.bind(this);
  }
    onDOBPress = () => {
      let dobDate = this.state.dobDate;
      if(!dobDate || dobDate == null){
        dobDate = new Date();
        this.setState({
          dobDate: dobDate
        });
      }
      //To open the dialog
      this.refs.dobDialog.open({
        date: dobDate,
        maxDate: new Date() //To restirct future date
      });
    }
    onDOBDatePicked = (date) => {
      this.setState({
        dobDate: date,
        dobText: moment(date).format('MM/DD/YYYY')
      });
    }
  
  go(){
    this.props.navigation.navigate('MainScreen'); 
  }

  next = () => {
    this.props.navigation.navigate('SignUp1'); 
  }
  storeData = async (name, value) => {
    AsyncStorage.setItem('userdata', JSON.stringify(value))
  }
  
  signup = () => {//console.log(this.state.dobText);
    if(this.state.email && this.state.name && this.state.password && this.state.cpassword){
     this.setState({showIndicator: true})
      var data = new FormData();     
      data.append("name", this.state.name);
      data.append("email", this.state.email);
      data.append("phone", this.state.phone);
      data.append("password", this.state.password);
      data.append("c_pass", this.state.cpassword);
      data.append("dob", this.state.dobText);
      fetch(global.baseurl+'register.php', {
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
            this.storeData('userdata', responseJson);
            //console.log(responseJson);
            global.userdata = responseJson;
            this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Succesffuly Registered.');
            this.next();
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

  render() {
    return (
      <View style={styles.container}>
       <Toast ref = "hamaoToast"/>
       <ScrollView style={{width:'100%',}} >
        <View style={styles.topInput}>
         <View style={styles.inputContainer}>
           <TextInput style={styles.inputs}
            placeholder="NAME"
            placeholderTextColor = "#fff"
            underlineColorAndroid='#fff' 
            onChangeText={(TextInputValue) => this.setState({name:TextInputValue})} />
         </View>
         <View style={styles.inputContainer}>
           <TextInput style={styles.inputs}
            placeholder="EMAIL"
            placeholderTextColor = "#fff"
            underlineColorAndroid='#fff'
            onChangeText={(TextInputValue) => this.setState({email:TextInputValue})} />
         </View>
         <View style={styles.inputContainer}>
           <TextInput style={styles.inputs}
            placeholder="PHONE"
            placeholderTextColor = "#fff"
            underlineColorAndroid='#fff' 
            onChangeText={(TextInputValue) => this.setState({phone:TextInputValue})} />
         </View>
         <Text style={styles.datePickerTextTop}>DATE OF BIRTH must be 13 year of age...</Text>
         <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
             <View style={styles.datePickerBox}>
               <Text style={styles.datePickerText}>{this.state.dobText}</Text>
             </View>
         </TouchableOpacity>
         <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
         <View style={styles.inputContainer}>
           <TextInput style={styles.inputs}
            placeholder="PASSWORD"
            placeholderTextColor = "#fff"
            underlineColorAndroid='white' 
            secureTextEntry={true}
            onChangeText={(TextInputValue) => this.setState({password:TextInputValue})} />
         </View>
         <View style={styles.inputContainer}>
           <TextInput style={styles.inputs}
            placeholder="CONFIRM PASSWORD"
            placeholderTextColor = "#fff"
            underlineColorAndroid='white' 
            secureTextEntry={true}
            onChangeText={(TextInputValue) => this.setState({cpassword:TextInputValue})} />
         </View>
        </View> 
        <View style={styles.topButton}>
  
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
          <TouchableOpacity activeOpacity={0.2} style={styles.Loginbutton} onPress={()=>this.signup()}>
            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity> : null
         }  
         <TouchableOpacity activeOpacity={0.3} style={styles.Backbutton} onPress={()=>this.go()}>
            <Text style={styles.buttonText}>GO BACK</Text>
         </TouchableOpacity>
        </View>
        </ScrollView>
       
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
    top: 0,
    bottom:150,
    left: 0,
    right: 0,
    zIndex: 2
  },
  container: {
    backgroundColor:'black',
    alignItems:'center',
    justifyContent:'center',
  },
  datePickerBox:{
    flexDirection:'row',
    width:'100%',
    marginTop: 0,
    borderColor: '#FFFFFF',
    borderBottomWidth: 1,
    padding: 0,
    borderRadius:0,
    height: 50,
    justifyContent:'flex-start',
    backgroundColor:'black',
    marginBottom:40,
  },
  datePickerTextTop: {
    width:'85%',
    fontSize: 14,
    marginTop:0,  
    marginLeft:10,
    borderBottomColor: '#FFFFFF',
    borderWidth: 0,
    color: '#fff',
  },
  datePickerText: {
    width:'85%',
    fontSize: 14,
    marginTop:18,  
    marginLeft:10,
    borderBottomColor: '#FFFFFF',
    borderWidth: 0,
    color: '#fff',
  },
  topButton: {
    alignItems:'center',
    justifyContent:'center',
  },
  Loginbuttons:{
    width:'55%',
    height:50,
    backgroundColor:'transparent',
    borderWidth:2,
    borderColor:'transparent',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
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
  buttonTexts:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center',
    color:'transparent'
  },
  buttonText:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center',
    color:'white'
  },
  topInput: {
    marginTop:30,
    alignItems:'center',
    justifyContent:'center',
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