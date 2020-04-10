import React, { Component } from 'react';
import {ActivityIndicator,Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import Toast from './Toast';
import Footer from './Footer';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Video from 'react-native-video';

const width = Dimensions.get('window').width;
export default class RepostVideo extends Component {
  static navigationOptions = {
    title: (<Image resizeMode='stretch' style={{width:120,height:25 }} source={require('../image/rant.png')} />),
    headerShown:false  
  };

  constructor(props){
      super(props);
      this.state={
         showIndicator: false ,
         VideoUrl:'',
         VideoDataNew: '',
         data: '',
         VideoSource: '',
         caption:'',
         user_id: global.userdata.user_id,
         video: null,
         screenType: 'cover',
      }
  }

  functionCall = (screen) => {
      this.props.navigation.navigate(screen); 
  }

  go = () => {
      this.setState({showIndicator: false,})
      this.props.navigation.navigate('Home', { naveen: Math.random() }); 
  }


   componentDidMount(){
    var id = this.props.navigation.state.params;
    this.setState({
       video: JSON.parse(id.video),
    })
   }
  post = () => {
    this.setState({VideoUrl:''}) 
  }
  uploadVideo = () => {
    this.setState({showIndicator: true,})
    fetch(global.baseurl+'repost.php?id='+global.userdata.user_id+'&post_id='+this.state.video.post_id+'&content='+encodeURIComponent(this.state.video.title),{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      this.go();
    });
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.showIndicator ? 
          <View style={styles.loader}>
             <Text style={{color:'#fff',fontSize:18,textAlign:'center'}}>Re-Rennting...</Text>
             <ActivityIndicator size="large" color="white" /> 
          </View> : null
        }
        {this.state.video ? 
          <View style={{marginVertical:0,width: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <Video
                playInBackground={false}
                isActive={false}
                paused={this.state.playvid}
                ref={(ref) => {this.state.videoPlayer = ref}}
                source={{ uri:this.state.video.video }}
                style={{width:width, height:width/2*3}}
                volume={10}
                muted={true}
                repeat={true}
                resizeMode={this.state.screenType}
              />
          </View> :null
         }
       {this.state.video ? 
        <View style={styles.comment}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputs}
             >{this.state.video.title}
             </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={()=>this.uploadVideo()}>
            <Text style={styles.send}>Send</Text>
          </TouchableOpacity>            
        </View> : null } 
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
             <TouchableOpacity>
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
    flex:1,
    backgroundColor:'black',
  },
  loader: {
    backgroundColor:'black',
    opacity:0.6,
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
  main:{
    width:'100%',
    flexDirection:'row',
    position:'absolute',
    bottom:100,
  },
  comment:{
    width:'100%',
    flexDirection:'row',
    position:'absolute',
    bottom:50,
  },
  inputContainer: {
    borderTopWidth:2,
    borderBottomWidth:2,
    borderTopColor: '#827c7c',
    borderBottomColor: '#827c7c',
    backgroundColor: '#4a4747',
    width:'100%',
    height:70,
    marginBottom:20,
  },
  inputs:{
    height:60,
    color:'#fff',
    padding:20,
    borderWidth:0,
    borderColor:'red'
  },
  button:{
    margin:5,
    width:60,
    height:60,
    backgroundColor:'#d42643',
    borderRadius:100,
    justifyContent:'center',
    position:'absolute',
    right:0,
  },
  send:{
    textAlign:'center',
    color:'#fff',
    fontSize:16,
    fontWeight:'bold',
  },
  video:{
    borderRightWidth:2,
    borderRightColor:'#fff',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  videoText:{
    fontSize:18,
    textAlign:'center',
    color:'white',
  },
  galary:{
    width:'50%',
    alignItems:'center',
    justifyContent:'center',
  },
  galaryText:{
    fontSize:18,
    textAlign:'center',
    color:'white',
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