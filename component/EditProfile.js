import React, { Component } from 'react';
import {ActivityIndicator,Dimensions,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {StackActions, NavigationActions,createAppContainer} from 'react-navigation';
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
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
export default class EditProfile extends Component {
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
       showIndicator: true ,
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
  async getuserdata(){
    var check = await this.apicall(global.baseurl+'user_details.php?user_id='+this.state.user_id);
    if(check.length>0){
      this.setState({ 
        registername: check[0].registername,
        name: check[0].name,
        email: check[0].email,
        phone_no: check[0].phone_no,
        image: check[0].image,
        showIndicator: false,               
     });
     }else{
      this.setState({ 
        showIndicator: false,               
     });
     }
  }

  back = (screen) => {
     this.props.navigation.navigate(screen);
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({  
          routeName: screen,
          action: NavigationActions.navigate({routeName: screen})
        })],
      }));        
  }
  
  Redirect = (screen) => {
   if(screen=='Post'){
     this.props.navigation.navigate('PostVideo'); 
   }else{
     this.props.navigation.navigate(screen); 
   }
  }

  Redirects = (screen) => {
    this.props.navigation.navigate('Privacy',{page: screen}); 
  }
  
  componentDidMount = () => {
    this.getuserdata();
  }
  updateprofile = () => {
    this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Updating... !');
     var data = new FormData();     
      data.append("user_id", this.state.user_id);
      data.append("registername", this.state.registername);
      data.append("name", this.state.name);
      data.append("email", this.state.email);
      data.append("phone_no", this.state.phone_no);
      data.append("image", this.state.image);
     fetch(global.baseurl+'update_profile.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Updated Successfully !');
        //  this.Redirect('Profile');
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  selectImage = () => {
    const options = {
       quality: 1.0,
       maxWidth: 500,
       maxHeight: 500,
       title: 'Select Photo', 
       mediaType: 'photo', 
       storageOptions: {
         skipBackup: true,
       }
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else if (response.customButton) {
      }
     else {
        let source = { uri: response.uri };
        //console.warn(response.uri);
          this.setState({
            ImageSource: source,
            ImageUrl: response.uri,
            ImageData: response.data
          });
         this.userImage(); 
       }
    });    
  }

   userImage = () => {
     RNFetchBlob.fetch('POST',global.baseurl+'uploadimage.php', {
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    }, [
        {name: 'file', filename: this.state.ImageUrl, type: 'image/png', data: this.state.ImageData},
        {name:'id',data: String(this.state.user_id)},
      ]).then((resp) => {
           this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Profile Image Updated Successfully !');
      }).catch((err) => {
        // ...
      })
   }
   deleteaccount = () => {
     var data = new FormData();     
      data.append("user_id", this.state.user_id);
     fetch(global.baseurl+'deletemyaccount.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Deleted Successfully !');
        this.logout();
      })
      .catch(function(error) {
        console.log(error);
      });
   }
   logout = () => {
      global.userdata = {};
      AsyncStorage.clear();
    this.props.navigation.navigate('MainScreen'); 
   }
  render() {
    return (
      <View style={styles.container}>
        {this.state.showIndicator ? 
          <View style={styles.loader}>
             <ActivityIndicator size="large" color="white" /> 
          </View> : null
        }
       <Toast ref = "hamaoToast"/>
        <ScrollView style={{marginBottom:0}}>
         <View style={{width:'100%',flexDirection:'row',marginTop:20}}>
           <TouchableOpacity onPress={()=>this.back('Profile')} style={{marginHorizontal:20}}>
              <Icon name="keyboard-arrow-left" size={40} color="white" />
           </TouchableOpacity>
           <Text style={{fontWeight:'bold',fontSize:16,marginLeft:0,margin:7,color:'#FFF'}}>EDIT PROFILE</Text>
           <TouchableOpacity style={{width:'70%',marginHorizontal:20,marginTop:5}} onPress={()=>this.updateprofile()}>
              <Icon name="check-circle" size={35} color="white" />
           </TouchableOpacity>
         </View>
         <View style={styles.topDivider}>
           <View style={styles.divider}>
             {this.state.ImageUrl == null ? 
               <Image style={{width:180,height:180,borderRadius:100}} source={{uri: this.state.image}} />  
               :
               <Image style={{width:180,height:180,borderRadius:100}} source={{uri: this.state.ImageUrl}} />  
             } 
              <View style={styles.profileText}>
                <TouchableOpacity onPress={()=>this.selectImage()}>
                  <Text style={{fontWeight:'bold',fontSize:15,paddingRight:5,paddingTop:8,color:'#FFF'}}>PROFILE PICTURE</Text>
                   <Icon name="add-a-photo" size={20} color="white" />
                </TouchableOpacity>
              </View>                
           </View>
         </View>
         <Text style={{fontWeight:'bold',fontSize:15,color:'#FFF',marginLeft:25,paddingTop:25}}>NAME</Text>
         <View style={styles.informationDivider}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="NAME"
              placeholderTextColor = "#fff"
              value={this.state.registername}
              onChangeText={(TextInputValue) => this.setState({registername:TextInputValue})} 
              />
           </View>
         </View>     
         <Text style={{fontWeight:'bold',fontSize:15,color:'#FFF',marginLeft:25,paddingTop:25}}>USER NAME</Text>
         <View style={styles.informationDivider}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="USER NAME"
              placeholderTextColor = "#fff"
              value={this.state.name}
              onChangeText={(TextInputValue) => this.setState({name:TextInputValue})} 
              />
           </View>
         </View>
         <View style={styles.private}>
           <Text style={{fontWeight:'bold',fontSize:15,color:'#FFF',marginLeft:25,paddingTop:25}}>PRIVATE INFORMATION</Text>
         </View>
         <Text style={{fontWeight:'bold',fontSize:15,color:'#FFF',marginLeft:25,paddingTop:25}}>EMAIL</Text>
         <View style={styles.informationDivider}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="EMAIL"
              placeholderTextColor = "#fff"
              value={this.state.email}
              onChangeText={(TextInputValue) => this.setState({email:TextInputValue})} 
              />
           </View>
         </View>
         <Text style={{fontWeight:'bold',fontSize:15,color:'#FFF',marginLeft:25,paddingTop:25}}>PHONE NUMBER</Text>
         <View style={styles.informationDivider}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="PHONE NUMBER"
              placeholderTextColor = "#fff"
              value={this.state.phone_no}
              onChangeText={(TextInputValue) => this.setState({phone_no:TextInputValue})} 
              />
           </View>
         </View>

         <View style={styles.private}>
           <Text style={{fontWeight:'bold',fontSize:15,color:'#FFF',marginLeft:25,paddingTop:25}}>SETTING</Text>
         </View>

        <View style={styles.mainContent}>
          <TouchableOpacity onPress={()=>this.Redirects('notification')} style={styles.userInfo}>
            <View style={styles.leftInfo}>
               <Icon name="notifications-none" size={30} color="white" />
           </View>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>NOTIFICATION </Text>
            </View>
            <View>
              <Icon name="keyboard-arrow-right" size={35} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.Redirect('Favorite')} style={styles.userInfo}>
            <View style={styles.leftInfo}>
               <Icon name="star-border" size={30} color="white" />
           </View>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>FAVORITES </Text>
            </View>
            <TouchableOpacity>
              <Icon name="keyboard-arrow-right" size={35} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.Redirects('privacy')} style={styles.userInfo}>
            <View style={styles.leftInfo}>
               <Icon name="lock" size={30} color="white" />
           </View>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>PRIVACY</Text>
            </View>
            <TouchableOpacity>
              <Icon name="keyboard-arrow-right" size={35} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
           <TouchableOpacity onPress={()=>this.Redirects('about')} style={styles.userInfo}>
           <View style={styles.leftInfo}>
               <Icon name="error-outline" size={30} color="white" />
           </View>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>ABOUT </Text>
            </View>
            <TouchableOpacity>
              <Icon name="keyboard-arrow-right" size={35} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.Redirects('support')} style={styles.userInfo}>
            <View style={styles.leftInfo}>
               <Icon name="help-outline" size={30} color="white" />
           </View>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>SUPPORT </Text>
            </View>
            <TouchableOpacity>
              <Icon name="keyboard-arrow-right" size={35} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.deleteaccount()} style={styles.userInfo}>
            <View style={styles.leftInfo}>
               <Icon name="delete" size={30} color="white" />
           </View>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>DELETE MY ACCOUNT </Text>
            </View>
            <TouchableOpacity>
              <Icon name="keyboard-arrow-right" size={35} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.logout()} style={styles.userInfo}>
            <View style={styles.leftInfo}>
               <Icon name="exit-to-app" size={30} color="white" />
           </View>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>LOGOUT</Text>
            </View>
            <TouchableOpacity>
              <Icon name="keyboard-arrow-right" size={35} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>        

        
        </ScrollView>
         {!this.state.showIndicator ? 
           <Footer parent={this.Redirect} /> : null
         }
     </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    backgroundColor:'black',
    opacity:10,
    flex:1,
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign:'center',
    alignItems:'center',
    position: 'absolute',
    top: 0,
    bottom:0,
    left: 0,
    right: 0,
    zIndex: 2
  }, 
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