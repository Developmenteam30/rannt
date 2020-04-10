import React, { Component } from 'react';
import {KeyboardAvoidingView,ActivityIndicator,Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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
export default class PostVideo extends Component {
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

   constructor(props) {
      super(props);
      this.state = {
        showIndicator: false ,
        VideoSource:'',
        VideoUrl:'',
        VideoDataNew:'',
        user_id: global.userdata.user_id,
        caption:'',
      screenType: 'contain',
      };
   } 

  functionCall = (screen) => {
      this.props.navigation.navigate(screen); 
  }

  go = () => {
     this.setState({showIndicator: false,})
     this.props.navigation.navigate('Home', { naveen: Math.random() }); 
  }

  selectVideo = () => {
    const options = {
       quality: 1.0,
       maxWidth: 300,
       maxHeight: 500,
       title: 'Select Video', 
       mediaType: 'video',
       videoQuality: "high",
       allowsEditing: true,
       durationLimit: 120,
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
          this.setState({
            VideoSource: source,
            VideoUrl: response.uri,
            VideoDataNew: response.data,
          });
          //console.log(response);
          const options = {
              width: 640,
              height: 300,
              saveToCameraRoll: false, // default is false, iOS only
              saveWithCurrentDate: true, // default is false, iOS only
              removeAudio: false, // default is false
          };
      }
    });    
  }

   uploadVideo = () => {
     this.setState({showIndicator: true,})
     RNFetchBlob.fetch('POST',global.baseurl+'upload.php', {
         'content-type': 'multipart/form-data',
         "Accept":"multipart/form-data",
        },[
        //the value of name depends on the key from server

        {name: 'video', filename: this.state.VideoUrl, data:  RNFetchBlob.wrap(this.state.VideoUrl.replace('file://', '')) },
        {name:'title',data:this.state.caption},
        {name:'id',data: String(this.state.user_id)},

      ]).then(response => response.json())
        .then(response => {
            console.log(response);
            this.setState({VideoUrl:''}) 
            this.go();
         })
         .catch((err) => {
           console.log(err);
            this.go();
        })
  }

   componentDidMount(){
    this.props.navigation.addListener(
      'willFocus', payload => {
        this.setState({
            VideoSource: '',
            VideoUrl: '',
            VideoDataNew: '',
        })
      this.selectVideo();
    });
   }
  
  post = () => {
    this.setState({VideoUrl:''}) 
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showIndicator ? 
          <View style={styles.loader}>
             <Text style={{color:'#fff',fontSize:18,textAlign:'center'}}>Uploading...</Text>
             <ActivityIndicator size="large" color="white" /> 
          </View> : null
        }
       {this.state.VideoUrl !== '' ? 
        <View style={styles.comment}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
             placeholder="Add a caption"
             placeholderTextColor = "#fff" 
             onChangeText={(TextInputValue) => this.setState({caption:TextInputValue})} />
          </View>
         <TouchableOpacity style={styles.button} onPress={()=>this.uploadVideo()}>
           <Text style={styles.send}>Send</Text>
         </TouchableOpacity>            
        </View>
        : null } 
        {this.state.VideoUrl !== '' ? 
          <View style={{marginVertical:0,width: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <Video
                playInBackground={false}
                isActive={false}
                paused={this.state.playvid}
                ref={(ref) => {this.state.videoPlayer = ref}}
                source={{ uri:this.state.VideoUrl }}
                style={{width:width, height:width}}
                resizeMode={this.state.screenType}
                volume={10}
                muted={true}
                repeat={true}
              />

          </View> :null
         }
       {this.state.VideoUrl === '' ? 
        <View style={styles.main}>
          <View style={styles.video}>
            <TouchableOpacity onPress={()=>this.selectVideo()}>
              <Text style={styles.videoText}> VIDEO </Text>
            </TouchableOpacity>
          </View> 
          <View style={styles.galary}>
            <TouchableOpacity onPress={()=>this.selectVideo()}>
              <Text style={styles.galaryText}> GALLERY </Text>
            </TouchableOpacity>
          </View> 
        </View> : null
       } 
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
    bottom:0,
    marginTop: 20,
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
    width:'50%',
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