import React, { Component } from 'react';
import {Modal, TouchableHighlight, ActivityIndicator, Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';
import Inview from 'react-native-inview';
import Video from 'react-native-video';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Favorite extends Component {
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
      count   : 0,
      post_data : [],
      screenType: 'cover',
      vp: '',
      buffer: true,
      user_id: global.userdata.user_id,
      username: global.userdata.name,
      d: '',
      x: null,
      index: '',
      modalVisible: false,
      showme: false,
      pet: '',
      tags: [],
    }
     this.manavverstop=this.manavverstop.bind(this);
     this.manavver=this.manavver.bind(this);
     this.likeme = this.likeme.bind(this);
  }

  Redirect = (screen) => {
    if(screen=='Post'){
      this.props.navigation.navigate('PostVideo'); 
    }else{
      this.props.navigation.navigate(screen); 
    }
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  Comment = (post_id) => {
    global.pageName = {page: 'Home'};
    this.props.navigation.navigate('Comment', {
      post_id: post_id,
    });
  }

  Likes = (post_id) => {
    global.pageName = {page: 'Home'};
    this.props.navigation.navigate('Likes', {
      post_id: post_id,
    }); 
  }
  likeme(x, i){
    var dada = this.state.post_data;
    if(dada[i].liked != null){
        dada[i].liked = null;
        dada[i].like--;
    }else{
        dada[i].liked = 1;
        dada[i].like++;
    }
    this.setState({
       post_data: dada,
    })
    fetch(global.baseurl+'addfav.php?id='+global.userdata.user_id+'&post_id='+x.post_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      var data = responseJson; 
    })
  }
  deleterannts(x, index){
    var dada = this.state.post_data;
    dada.splice(index, 1);
    this.setState({
       post_data: dada,
    });
    fetch(global.baseurl+'deleterannt.php?post_id='+x.post_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      var data = data.data; 
    });
  }

  deleterannt(x, index){
    if(x.user_id == global.userdata.user_id){
      if(x.origin_post_id=='0'){
        var deletemsg = 'Delete this rannt';
      }else{
        var deletemsg = 'Un-Rerannt this Rerannt';
      }
    }else{
        var deletemsg = 'Report this rannt';
    }
    this.setState({
       d: deletemsg,
       x: x,
       index: index,
    });
    this.setModalVisible(true);
  }
  action = () => {
    if(this.state.x.user_id == global.userdata.user_id){
      this.deleterannts(this.state.x, this.state.index);
    }else{
      this.props.navigation.navigate('Report', {
        post_id: this.state.x.post_id,
      });
    }
  }
  profile = (userid) => {
    global.pageName = {page: 'Home'};
    this.props.navigation.navigate('Otherprofile', {
      user_id: userid,
    }); 
  }

  getPosts(){
    console.log(this.state.pet);
    fetch(global.baseurl+'get_fav_post.php?id='+global.userdata.user_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.length>0){
        var dada = this.state.post_data;
        for(var i = 0; i<responseJson.length; i++){
          responseJson[i].playvid = true;
          dada.push(responseJson[i]);
        }
        this.setState({
           post_data: dada,
           count: this.state.count+1,
           showme: true,
           showIndicator: false,               
        })
      }else{
        this.setState({showIndicator:false})
      }
    })
    this.setState({
       count: this.state.count+1,
    })
  }
  checkload({layoutMeasurement, contentOffset, contentSize}){
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
  }
  manavverstop(i){
      var jadu = this.state.post_data;
      if(jadu[i].playvid == false){
        jadu[i].playvid = true;
        this.setState({
           post_data: jadu,
           buffer: true,
        })
      }
  }
  manavver(invews, i){
    if(invews){
      var jadu = this.state.post_data;
      if(jadu[i].playvid == true){
        jadu[i].playvid = false;
        this.setState({
           post_data: jadu,
        })
      }
    }
  }
  componentDidMount = () => {
    this.props.navigation.addListener(
      'didBlur', payload => {
        this.setState({
           post_data: [],
        })
    });
    this.props.navigation.addListener(
      'willFocus', payload => {
        this.setState({
           showIndicator: true,
        })
        this.getPosts();
    });

  }
  sendhash = (data) => {
    this.setState({
       pet: data,
       showIndicator: true,
       count: 0,
       post_data: []
    })
    setTimeout(() => {this.getPosts(), 200});
  }
  gotorannt = (post_id) => {
    this.props.navigation.navigate('Post', {
      post_id: post_id,
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
       
       <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          >
          <View style={{marginTop: 22, flex: 1,position: 'absolute',width:'100%',left: 0,right: 0,bottom: 0,}}>
            <View>
              <TouchableHighlight style={styles.buttontext}
                onPress={() => {
                  this.action();
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.buttontext}>{this.state.d}</Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.buttontext}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.buttontext}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        {this.state.post_data.length < 1  ?
         <View style={styles.mainContent}>
          <View style={{alignItems:'center', alignContent:'center'}}>
            <Icon name="favorite" size={100} color="white" />
            <Text style={{fontSize: 20, color: 'white'}}>Welcome {this.state.username}</Text>
            <Text style={{fontSize: 20, color: 'white'}}>Follow peoples to explore rannt.</Text>
          </View>
         </View>
         : null
        }

        <ScrollView style={{marginBottom:70}} nestedScrollEnabled={true} onMomentumScrollEnd={({nativeEvent})=>{
                    if(this.checkload(nativeEvent)){
                       this.getPosts();
                    }
               }}>
            {this.state.post_data.map((item,i)=> {
              return(
                  <View style={styles.mainContent}>
                  <View style={styles.userInfo}>
                    <TouchableOpacity style={styles.leftInfo} onPress={()=>this.profile(item.user_id)}>
                      <Image style={{borderWidth:2,borderColor:'#fff',width:50,height:50,borderRadius:100}} source={{uri:item.user_image}} />  
                    </TouchableOpacity>
                    <View style={styles.centerInfo}>
                      <Text style={styles.centerText} onPress={()=>this.profile(item.user_id)}>@{item.name}</Text>
                      <Text style={styles.centerText}></Text>
                    </View>
                  </View>
                  <View style={styles.video}>
                      <Inview onChange={(inView) => {if(inView){ this.manavver(inView, i); }else{ this.manavverstop(i); } }}>
                        {this.state.buffer ?
                         <View style={styles.loaders}>
                           <ActivityIndicator size="small" color="white" /> 
                         </View> : null
                        }
                        <TouchableOpacity onPress={()=>this.gotorannt(item.post_id)}>
                          <Video
                              playInBackground={false}
                              isActive={false}
                              paused={item.playvid}
                              ref={(ref) => {this.videoPlayer = ref}}
                              resizeMode={this.state.screenType}
                              source={{ uri:item.video }}
                              style={{width:width, height:400}}
                              repeat={true}
                              volume={10}
                            />
                          </TouchableOpacity>
                      </Inview>
                  </View>
                    <View style={styles.divider}>
                      <Text> </Text>
                    </View>
                  </View>
                )} ) 
              }
         </ScrollView>
         {!this.state.showIndicator ? 
           <Footer parent={this.Redirect} /> : null
         }
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'black',
    flex: 1,
  },
  content:{
    color: 'white',
    fontSize: 20,
    padding: 8,
    marginBottom: 10,
  },
  contents:{
    color: 'blue',
    fontSize: 20,
    padding: 8,
    marginBottom: 10,
  },
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
  mainContent:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginVertical:10,
  },
  userInfo:{
    flexDirection:'row'
  },
  leftInfo:{
    width:'10%'
  },
  centerInfo:{
    marginHorizontal:25,
    width:'60%',
  },
  loaders: {
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
  },
  centerText:{
    color:'white',
    fontWeight:'bold',
    fontSize:15,
  },
  rightInfo:{
    width:'10%',
    marginVertical:15,
  },
  video:{
    marginVertical:20,
  },
  divider:{
    width:'100%',
    borderBottomWidth:2,
    borderColor:'#4f5250',
  },
  social: {
    width:'100%',
    flexDirection:'row',
    marginLeft:10,
    paddingTop:0,       
  },
  buttontext:{
    width: '100%',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'black',
    color: 'white',
    alignItems:'center',       
    justifyContent:'center',       
  },
  icon:{
    paddingLeft:30,
  },
  likes:{
    width:'100%',
    color:'gray',
    fontSize:13,
    marginLeft:70,
    padding:5
  },
  titles:{
    width:'100%',
    color:'white',
    fontSize:17,
    marginLeft:70,
    padding:5
  },
  hastags:{
    color:'blue',
    fontSize:17,
    marginLeft:70,
    padding:5
  }
});