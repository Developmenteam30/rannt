import React, { Component } from 'react';
import {Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import slide1 from '../image/slide1.jpg';
import slide2 from '../image/slide2.jpg';
import slide3 from '../image/slide3.jpg';
import Toast from './Toast';

const width = Dimensions.get('window').width;
export default class SignUp1 extends Component {
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
       screen:1,
       first:true,
       second:false,
       third:false
     }
     this.go=this.go.bind(this);
  }
  
  go(){
    this.props.navigation.navigate('MainScreen'); 
  }

 next = (num) => { //console.log(num);
   if(num < 3){
     this.setState({screen:this.state.screen+1,})
   }else{
    this.props.navigation.navigate('SignUp2'); 
   }  
 } 

  render() {
    return (
      <View style={styles.container}>
          {this.state.screen==1 ?
           <Image style={styles.imageBackground} source={require('../image/slide1.jpg')} /> : null
          }
          {this.state.screen==2 ?
           <Image style={styles.imageBackground} source={require('../image/slide2.jpg')} /> : null
          }
          {this.state.screen==3 ?
           <Image style={styles.imageBackground} source={require('../image/slide3.jpg')} /> : null
          }
          <View style={styles.next}>
            <TouchableOpacity onPress={()=>this.next(this.state.screen)} style={{flexDirection:'row'}}>
              <Text style={styles.nextText}>SKIP</Text>
              <Icon name="keyboard-arrow-right" size={40} color="white" />
            </TouchableOpacity>             
          </View>
           <View style={styles.center}>
           {this.state.screen==1 ?
            <View style={styles.center2}>
             <Text style={styles.welcome}>WELCOME TO RANNT</Text>
             <Text style={styles.termsText}>The sports based social media platform that allows you to Rannt and interact with other sport fans in a new and exciting way! </Text>
            </View> : null
           } 
           {this.state.screen==2 ?
            <View style={styles.center2}>
             <Text style={styles.welcome}>CUSTOMIZED FOR YOU</Text>
             <Text style={styles.termsText}>Choose your favorite sports, team or leagues to hear and see whats being talked about, and also to create aRannt yourself.  </Text>
            </View> : null
           } 
           {this.state.screen==3 ?
            <View style={styles.center2}>
             <Text style={styles.welcome}>START RANNTING</Text>
             <Text style={styles.termsText}> Now you are ready to start rannting.you can like, share or comment someone's  Rannt or start your own rannt by clicking the rannt icon.</Text>
            </View> : null
           } 
          <View style={styles.back}>
            <TouchableOpacity onPress={()=>this.next(this.state.screen)} style={{flexDirection:'row'}}>
              <Text style={styles.backText}>NEXT</Text>
              <Icon name="keyboard-arrow-right" size={40} color="white" />
            </TouchableOpacity>             
          </View>
          </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor:'black',
    flex:1,  
  },
  imageBackground:{
    width:'100%',
    height:'100%',
  },
  center:{
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom:25,
    left:0,
    right:0,
  },
  center2:{
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom:60,
    left:0,
    right:0,
  },
  welcome:{
    width:'60%',
    fontWeight:'bold',
    fontSize:20,
    textAlign:'center',
    color:'white'
  },
  termsText:{
    width:'70%',
    fontWeight:'bold',
    fontSize:14,
    textAlign:'center',
    color:'white'
  },
  next:{
    position:'absolute',
    marginRight:0,
    alignItems:'flex-end',
    width:'100%',
    padding:10,
  },
  nextText:{
    zIndex:2,
    textAlign:'center',
    color:'#fff',
    fontSize:18,
    marginTop:8,
  },
  back:{
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    padding:10,
  },
  backText:{
    textAlign:'center',
    color:'#fff',
    fontSize:18,
    marginTop:8,
  },


});