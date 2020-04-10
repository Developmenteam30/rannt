import React, { Component } from 'react';
import {Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';
import Toast from './Toast';

const width = Dimensions.get('window').width;
export default class Report extends Component {
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
         marginTop:0,
         alignSelf:'center',
      },
    };

  constructor(props){     
     super(props);
     this.state = {
       user_id: global.userdata.user_id,
       userdata: [],
       registername: '',
       name: '',
       email: '',
       phone_no: '',
       image: '',
       ImageUrl:null,
       ImageData: '',
       ImageSource: null,
       post_id: '',
       description: '',
     };
    }
  apicall(url){
    return fetch(url,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      return responseJson;
    });
  }
  
  Redirect = (screen) => {
     this.props.navigation.navigate(screen); 
  }

  back=(screen) => {
     this.props.navigation.navigate(screen);
  }
  
  componentDidMount = () => {
    var id = this.props.navigation.state.params;
        this.setState({
           post_id: id.post_id,
        })
  }
  updateprofile = () => {
    this.apicall(global.baseurl+'report.php?id='+this.state.post_id+'&user='+this.state.user+'&description='+encodeURI(this.state.description));
     this.props.navigation.navigate('Home'); 
  }

  render() {
    return (
      <View style={styles.container}>
       <Toast ref = "hamaoToast"/>
        <ScrollView style={{marginBottom:0}}>
         <View style={{width:'100%',flexDirection:'row',marginTop:20}}>
           <TouchableOpacity onPress={()=>this.back('Home')} style={{marginHorizontal:20}}>
              <Icon name="keyboard-arrow-left" size={40} color="white" />
           </TouchableOpacity>
           <Text style={{fontWeight:'bold',fontSize:16,marginLeft:0,margin:7,color:'#FFF'}}>REPORT</Text>
           <TouchableOpacity style={{width:'70%',marginHorizontal:20,marginTop:5}} onPress={()=>this.updateprofile()}>
              <Icon name="check-circle" size={35} color="white" />
           </TouchableOpacity>
         </View>
         <View style={styles.private}>
           <Text style={{fontWeight:'bold',fontSize:15,color:'#FFF',marginLeft:25,paddingTop:25}}>REPORT INFORMATION</Text>
         </View>
         <View style={styles.informationDivider}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="Report"
              placeholderTextColor = "#fff"
              onChangeText={(TextInputValue) => this.setState({description:TextInputValue})} 
              />
           </View>
         </View>

        
        </ScrollView>
       <Footer parent={this.Redirect} />
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'black',
    flex: 1,
  },
  mainContent:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:50,
    marginTop:20,
  },
  userInfo:{
    flexDirection:'row',
    paddingTop:-0,
    padding:40,
  },
  leftInfo:{
    width:'10%'
  },
  centerInfo:{
    marginLeft:10,
    width:'90%',
  },
  centerText:{
    marginTop:5,
    color:'white',
    fontWeight:'bold',
    fontSize:15,
  },
  centerText2:{
    color:'white',
    fontSize:12,
  },
  reply:{
    flexDirection:'row',
    width:'100%',   
  },
  replyText:{
    color:'white',
    fontSize:15,
    paddingTop:5,
  },
  rightInfo:{
    width:'20%',
    marginVertical:15,
  },
  topDivider:{
    marginTop:20,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  divider:{
    width:'90%',
    borderTopWidth:2,
    borderBottomWidth:2,
    borderColor:'#4f5250',
    alignItems:'center',
    justifyContent:'center',
    padding:30,
  },
  profileText:{
    flexDirection:'row',
    margin:5, 
  },
  informationDivider:{
    marginTop:10,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  }, 
  inputContainer: {
    backgroundColor: '#363333',
    borderRadius:10,
    width:'90%',
    height:45,
    marginBottom:20,
    flexDirection: 'row',
  },
  inputs:{
    height:45,
    marginLeft:16,
    color:'#fff',
  },
  private:{
    marginTop:10,
    marginBottom:15,
    width:'100%',
  },

});