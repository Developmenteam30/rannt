import React, { Component } from 'react';
import {ActivityIndicator,Switch,Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';
import Toast from './Toast';

const width = Dimensions.get('window').width;
export default class Privacy extends Component {
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
     this.state={
       switchValue:false,
       switchValues:false,
       content: '',
       showIndicator: true ,
       data:[],
       user_id: global.userdata.user_id,
       page:'',
     }
  }

  toggleSwitch = (value) => {
    this.setState({switchValue: value})
    if(value==true){
      var switchvalues=0;
    }else{
      var switchvalues=1;
    }
    fetch(global.baseurl+'update_privacy.php?user_id='+this.state.user_id+'&privacy='+switchvalues, {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Updated !');
       })
      .catch(function(error) {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
      });
  }

  toggleSwitchs = (value) => {
    this.setState({switchValues: value})
    if(value==true){
      var switchvalue=0;
    }else{
      var switchvalue=1;
    }
    fetch(global.baseurl+'update_notification.php?user_id='+this.state.user_id+'&noti='+switchvalue, {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Updated !');
       })
      .catch(function(error) {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
      });
  }

  back = (screen) => {
    this.props.navigation.navigate(screen); 
  }

  Redirect = (screen) => {
    this.props.navigation.navigate(screen); 
  }

  componentDidMount = () => {
    var id = this.props.navigation.state.params;
    if(global.userdata.push_notification=='1'){    
      this.setState({
        page: id.page,
        switchValues:true
      })
    }else{
      this.setState({
        page: id.page,
        switchValues:false
      })   
    }
    this.getuserdata();
    this.getdata(id.page);
  }

 getuserdata(){
    fetch(global.baseurl+'user_details.php?user_id='+this.state.user_id, {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {//console.log(responseJson[0].push_notification);
         if(responseJson[0].push_notification=='1'){    
             this.setState({switchValues:true});
          }else{
             this.setState({switchValues:false});       
          }
         if(responseJson[0].privacy=='1'){    
             this.setState({switchValue:true});
          }else{
             this.setState({switchValue:false});       
          }
      })
      .catch(function(error) {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
      });
  }

  getdata(page){
    fetch(global.baseurl+'privacy.php?type='+page,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      this.setState({
        content: responseJson,
        showIndicator:false
      })
    });
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
       <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
          <TouchableOpacity onPress={()=>this.back('EditProfile')} style={{marginHorizontal:10}}>
            <Icon name="keyboard-arrow-left" size={40} color="white" />
          </TouchableOpacity>
          <Text style={{fontWeight:'bold',fontSize:16,margin:7,marginLeft:0,color:'#FFF'}}>Back</Text>
        </View>
        {this.state.page == 'privacy' && 
        <View>
          <View style={styles.topHeading}>
             <Text style={styles.headingText}>PRIVACY POLICY</Text>
          </View>
          <Text style={styles.divider}> </Text>
          <View style={styles.switch}>
            <View style={styles.switchLeft}>
               <Text style={styles.switchLeftText}>Set Account Private </Text>
            </View>
            <View style={styles.switchRight}>
              <Switch onValueChange={this.toggleSwitch} value={this.state.switchValue}/>          
            </View>
          </View>
        </View>
        }
        {this.state.page == 'notification' && 
        <View>
          <View style={styles.topHeading}>
             <Text style={styles.headingText}>PUSH NOTIFICATION</Text>
          </View>
          <Text style={styles.divider}> </Text>
          <View style={styles.switch}>
            <View style={styles.switchLeft}>
               <Text style={styles.switchLeftText}>Get Notifications </Text>
            </View>
            <View style={styles.switchRight}>
              <Switch onValueChange={this.toggleSwitchs} value={this.state.switchValues}/>          
            </View>
          </View>
        </View>
        }
        <ScrollView>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {this.state.content}
            </Text>
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
  topHeading:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  headingText:{
    marginTop:20,
    color:'#fff',
    fontSize:16,
    fontWeight:'bold'
  },
  divider:{
    width:'100%',
    borderTopWidth:2,
    borderTopColor:'#434343',
    marginTop:10
  },
  switch:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:'#fff',
    paddingBottom:10,
  },
  switchLeft:{
    width:'60%',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:10,
  },
  switchLeftText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:19
  },
  switchRight:{
    width:'40%',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:40,
  },
  switchRightIcon:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
  },
  content:{
    marginBottom:60,
    width:'100%',
    paddingTop:5,
    padding:10
  },
  contentText:{
    textAlign:'justify',
    color:'#fff',
    fontSize:15,
  },

});