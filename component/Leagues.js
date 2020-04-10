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
export default class Leagues extends Component {
    static navigationOptions = {
      title: (
             <Image resizeMode='stretch' style={{width:(width-(width/1.5)),height:25 }} source={require('../image/rant.png')} />
          ),    
      headerLeft:() => null,
      headerStyle: {
        backgroundColor: '#000',
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
  }

  render() {
    return (
      <View style={styles.container}>
         
         <View style={styles.private}>
           <Text style={styles.privateText}>WHAT LEAGUES DO YOU LIKE?</Text>
         </View>
        <ScrollView style={{marginBottom:0}}>
         
         <View style={styles.mainContent}>
          <View style={styles.row}>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>NFL FOOTBALL </Text>
            </View>
            <View style={styles.righIcon}>
             <TouchableOpacity>
              <Icon name="star-border" size={30} color="white" />
             </TouchableOpacity>
            </View>
          </View>  
          <View style={styles.row}>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>NBA BASKETBALL</Text>
            </View>
            <View style={styles.righIcon}>
              <Icon name="star-border" size={30} color="white" />
            </View>
          </View>  
          <View style={styles.row}>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>MLB BASKETBALL</Text>
            </View>
            <View style={styles.righIcon}>
              <Icon name="star-border" size={30} color="white" />
            </View>
            </View>
          <View style={styles.row}>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>NHL HOCKEY</Text>
            </View>
            <View style={styles.righIcon}>
              <Icon name="star-border" size={30} color="white" />
            </View>
            </View>
          <View style={styles.row}>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>NCAA FOOTBALL</Text>
            </View>
            <View style={styles.righIcon}>
              <Icon name="star-border" size={30} color="white" />
            </View>
            </View>
          <View style={styles.row}>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>NCAA BASKETBALL</Text>
            </View>
            <View style={styles.righIcon}>
              <Icon name="star-border" size={30} color="white" />
            </View>
          </View>         
         </View> 
        </ScrollView>

        <View style={styles.mainBottom}>
         <View style={styles.bottom}>
          <View style={styles.back}>
            <TouchableOpacity style={{flexDirection:'row'}}>
              <Icon name="keyboard-arrow-left" size={40} color="white" />
              <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>             
          </View>
   
          <View style={styles.back}>
            <TouchableOpacity style={{flexDirection:'row'}}>
              <Text style={styles.backText}>SKIP</Text>
              <Icon name="keyboard-arrow-right" size={40} color="white" />
            </TouchableOpacity>             
          </View>
   
          <View style={styles.back}>
            <TouchableOpacity style={{flexDirection:'row'}}>
              <Text style={styles.backText}>NEXT</Text>
              <Icon name="keyboard-arrow-right" size={40} color="white" />
            </TouchableOpacity>             
          </View>
         </View> 
        </View>

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
    marginTop:15,
  },
  row:{
    width:'90%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    marginTop:10,
    flexDirection:'row',
  },
  centerInfo:{
    marginLeft:10,
    width:'80%',
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
  rightIcon:{
    width:'20%',
  },
  private:{
    marginTop:30,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  privateText:{
    textAlign:'center',
    width:'90%',
    color:'white',
    fontWeight:'bold',
    fontSize:20,
    borderBottomWidth:2,
    borderBottomColor:'#fff',
    paddingBottom:10,
  },
  mainBottom:{
    backgroundColor:'black',
    width:'100%',
    borderTopWidth:1,
    borderTopColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    position:'absolute',
    bottom:0,
  },
  bottom:{
    width:'100%',
    flexDirection:'row',
    marginLeft:25,
  },
  back:{
    width:'33%',
    padding:10,
  },
  backText:{
    color:'#fff',
    fontSize:16,
    marginTop:8,
  },
  
});