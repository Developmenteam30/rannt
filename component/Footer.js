import React, { Component } from 'react';
import {Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
const width = Dimensions.get('window').width;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default class Footer extends Component {
  constructor(props){     
     super(props);
  }

  functionCall = (screen) => {
    this.props.parent(screen); 
  }  
 
  componentDidMount = () => {
  }

  render() {
    return (
      <View style={styles.container}>
         <View style={styles.footer}>   
           <View style={{width:'20%',flexDirection:'row',padding:0,justifyContent:'center' ,alignItems:'center',textAlign:'center'}}> 
             <TouchableOpacity onPress={()=>this.functionCall('Home')}>
                <Icon name="home" size={30} color="#fff" />
             </TouchableOpacity>
           </View>
           <View style={{width:'20%',flexDirection:'row',padding:0,justifyContent:'center'}}> 
            <TouchableOpacity onPress={()=>this.functionCall('Search')}>
              <Icon name="search" size={30} color="#fff" />
           </TouchableOpacity>
           </View>
           <View style={{width:'20%',flexDirection:'row',padding:0, justifyContent:'center'}}> 
             <TouchableOpacity onPress={()=>this.functionCall('PostVideo')}>
               <Image style={{width:30,height:30}} source={require('../image/logowhite.png')} />
             </TouchableOpacity> 
           </View>
            <View style={{width:'20%',flexDirection:'row',padding:0, justifyContent:'center'}}> 
            <TouchableOpacity onPress={()=>this.functionCall('Notification')}>
               <Icon name="notifications" size={30} color="#fff" />
            </TouchableOpacity>
           </View>
           <View style={{width:'20%',flexDirection:'row',padding:0, justifyContent:'center'}}> 
             <TouchableOpacity onPress={()=>this.functionCall('Profile')}>
               <Icon name="person" size={30} color="#fff" />
             </TouchableOpacity> 
           </View>
         </View>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems:'center',       
    justifyContent:'center',       
  },
  footer: {
    position: 'absolute',
    flex:0.1,
    width:'100%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:'black',
    flexDirection:'row',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    height:70,
    alignItems:'center',
  },

});