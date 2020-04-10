import React, { Component } from 'react';
import {ActivityIndicator,Modal, TouchableHighlight, Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {StackActions, NavigationActions,createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';
import ImageView from 'react-native-image-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class Otherprofile extends Component {
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
             showIndicator: true ,
             data:[],
             user_id: global.userdata.user_id,
             id: 0,
             rannt: 'my',
             user: [],
             post: [],
             modalVisible: false,
             apost: null,
             ai: null,
             notfound: false,
             images : [
                    {
                        source: {
                            uri: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                        },
                        title: '',
                        width: 806,
                        height: 720,
                    },
                ],
             isImageViewVisible: false,     
     }
  }
  showimage = (img) =>{
    var hamara = [
              {
                  source: {
                      uri: img,
                  },
                  title: '',
                  width: 806,
                  height: 720,
              },
          ];
    this.setState({ images : hamara, isImageViewVisible : true })
  } 

  back = (screen) => {//console.log(screen);
     this.props.navigation.navigate(screen);
  }
  
  Redirect = (screen) => {
    this.props.navigation.navigate(screen); 
  }
  EditProfile = () => {
    this.props.navigation.navigate('EditProfile'); 
  }
  following = () => {
    global.pageName = {page: 'Otherprofile'};
    this.props.navigation.navigate('Following', {
      user_id: this.state.id,
    }); 
  }
  getinfo = (user_id) => {
    fetch(global.baseurl+'user_details.php?user_id='+user_id+"&myid="+global.userdata.user_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      if(responseJson.length>0){
        this.setState({
           id: user_id,
           user: responseJson,
           showIndicator:false,
        });
      }
    });
    fetch(global.baseurl+'get_my_post.php?user_id='+user_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      if(responseJson.length>0){
        this.setState({
           post: responseJson,
        });
      }
    });

  }  
  gotorannt = (post_id) => {
    this.props.navigation.navigate('Post', {
      post_id: post_id,
    });
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  _onLongPressButton = (post, i) => {
    this.setModalVisible(true);
    this.setState({apost: post, ai: i});
  }
  deleterannt = (x, i) => {
    this.props.navigation.navigate('Report', {
      post_id: x.post_id,
    });
  }
  componentDidMount = () => {
    this.props.navigation.addListener(
      'willFocus', payload => {
      var id = this.props.navigation.state.params;
      if(id){
        if(id.user_id){
          this.setState({
             id: id.user_id,
          })
          this.getinfo(id.user_id);
        }else if(id.user_name){
          fetch(global.baseurl+'get_user_id.php?user_id='+id.user_name,{
           method:"GET",
          })
          .then((response) => response.json())
          .then((responseJson) => { 
            if(responseJson.response==1){
              this.setState({
                 id: responseJson.user_id,
              })
              this.getinfo(responseJson.user_id);
            }else{
              this.setState({
                 showIndicator:false,
                 notfound: true,
              })
            }
          });
        }else{
          this.setState({
             notfound: true,
             showIndicator:false,
          })
        }
      }else{
          this.setState({
             id: global.userdata.user_id,
          })
        this.getinfo(global.userdata.user_id);
      }
    });
  }
  setrannt = (type) => {
        this.setState({
           rannt: type,
        })
  }
  follow = (v) => {
    this.setState({
       showIndicator:true,
    });
    var url;
    if(v == 'follow'){
      url = global.baseurl+'add_follow.php?user_id='+this.state.id+"&myid="+global.userdata.user_id;
    }else{
      url = global.baseurl+'add_unfollow.php?user_id='+this.state.id+"&myid="+global.userdata.user_id;
    }
    fetch(url,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
        fetch(global.baseurl+'user_details.php?user_id='+this.state.id+"&myid="+global.userdata.user_id,{
         method:"GET",
        })
        .then((response) => response.json())
        .then((responseJson) => { 
          if(responseJson.length>0){
            this.setState({
               user: responseJson,
               showIndicator:false,
            });
          }
        });
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
                  this.deleterannt(this.state.apost, this.state.ai);
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.buttontext}>Report this rannt.</Text>
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
        <ScrollView>
          {!this.state.notfound ? this.state.user.map((item,i)=> {
            return(
              <View>
              <View style={styles.userInfo}>
                <View style={styles.leftInfo}>
                {this.state.id != 0 && this.state.id != this.state.user_id ?
                   <TouchableOpacity onPress={()=>this.back(global.pageName.page)} style={{marginHorizontal:20,flexDirection:'row'}}>
                      <Icon name="keyboard-arrow-left" size={40} color="white" />
                      <Text style={{fontWeight:'bold',fontSize:16,marginLeft:0,margin:7,color:'#FFF'}}>BACK</Text>
                   </TouchableOpacity>
                   :
                   <TouchableOpacity onPress={()=>this.EditProfile()}>
                     <Icon name="settings" size={30} color="white" />
                   </TouchableOpacity>
                }
                </View>
                <View style={styles.rightInfo}>
                  <TouchableOpacity>
                    <Icon name="cancel" size={30} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.userInfo2}>
                <View style={styles.leftInfo2}>
                 <TouchableOpacity onPress={()=>this.following()} activeOpacity={0.6}>
                   <Text style={styles.followers}>{item.followers} FOLLOWERS</Text>
                 </TouchableOpacity>
                </View>
                <View style={styles.centerInfo2}>
                   <Text style={styles.userName}>{item.name}</Text>
                   <TouchableOpacity onPress={()=>this.showimage(item.image)}>
                       <Image style={styles.centerInfoImg} source ={{uri:item.image}} />
                   </TouchableOpacity>
                </View>
                <View style={styles.rightInfo2}>
                 <TouchableOpacity onPress={()=>this.following()} activeOpacity={0.6}>
                   <Text style={styles.following}>{item.followings} FOLLOWING</Text>
                 </TouchableOpacity>
                </View>
              </View>
            {item.follow.map((items,i)=> {
              return(
                <View>
                {global.userdata.user_id != item.user_id &&
                   <TouchableOpacity style={styles.bucont} activeOpacity={0.6} onPress={()=> this.follow('unfollow')}>
                      <Text style={styles.follow}>Un-Follow</Text>
                   </TouchableOpacity>
                }
               </View>
             )})}
                {global.userdata.user_id != item.user_id && item.follow.length<1 ?
                   <TouchableOpacity style={styles.bucont} activeOpacity={0.6} onPress={()=> this.follow('follow')}>
                      <Text style={styles.follow}>Follow</Text>
                   </TouchableOpacity>
                   : null
                }

              <View style={styles.userInfo3}>
                <View style={styles.leftInfo3}>
                 <TouchableOpacity activeOpacity={0.6} onPress={()=> this.setrannt('my')}>
                    <Text style={this.state.rannt == 'my' ? styles.rannt : styles.rerannt}>MY RANNTS</Text>
                 </TouchableOpacity>
                </View>
                <View style={styles.centerInfo3}>
                   <Text style={styles.line}> </Text>         
                </View>
                <View style={styles.rightInfo3}>
                 <TouchableOpacity activeOpacity={0.6} onPress={()=> this.setrannt('rerannt')}>
                   <Text style={this.state.rannt != 'my' ? styles.rannt : styles.rerannt}>RE-RANNTS</Text>
                 </TouchableOpacity>
                </View>
              </View>

              <View style={styles.userInfo4}>
                <View style={styles.leftInfo4}>
                   <Text style={styles.myRannt}>{this.state.rannt != 'my' ? 'RE-RANNTS' : 'MY RANNTS'}</Text>
                </View>
                <View style={styles.rightInfo4}>
                   <Text style={styles.myRerannt}> </Text>         
                </View>
              </View>
              {(item.privacy == '0' || global.userdata.user_id == item.user_id) || (global.userdata.user_id != item.user_id && item.follow.length > 0 && item.follow[0].follow_status == 'follow') ?
                 <View style={styles.mainGrid}>
                  {this.state.post.map((items,it)=> {
                    return(
                      <View>
                      {items.origin_post_id == '0' && this.state.rannt == 'my' ?
                         <TouchableOpacity activeOpacity={0.6} style={styles.gridContent} onPress={()=> this.gotorannt(items.post_id)} onLongPress={() => this._onLongPressButton(items, it)}>
                           <Image style={styles.image} source ={{uri:items.image}} />
                         </TouchableOpacity>
                         : null
                      }
                      {items.origin_post_id != '0' && this.state.rannt != 'my' ?
                         <TouchableOpacity activeOpacity={0.6} style={styles.gridContent} onPress={()=> this.gotorannt(items.post_id)} onLongPress={() => this._onLongPressButton(items, it)}>
                           <Image style={styles.image} source ={{uri:items.image}} />
                         </TouchableOpacity>
                         : null
                      }
                    </View>
                    )
                  })}
                  </View>
                  : 
                 <View style={styles.mainGrid}>
                   <View>
                    <Icon name="lock" size={50} color="white" />
                   </View>
                   <Text style={styles.myRannt}>This account is private</Text>
                   <Text style={styles.myRannt}>{item.follow.length > 0 ? 'Waiting for acceptance.' : 'Follow to see their rannt.'}</Text>         
                 </View>              
               }
              </View>
            )
          })
          : 
            <View>
              <View style={styles.userInfo}>
                <View style={styles.leftInfo}>
                   <TouchableOpacity onPress={()=>this.back(global.pageName.page)} style={{marginHorizontal:20,flexDirection:'row'}}>
                      <Icon name="keyboard-arrow-left" size={40} color="white" />
                      <Text style={{fontWeight:'bold',fontSize:16,marginLeft:0,margin:7,color:'#FFF'}}>BACK</Text>
                   </TouchableOpacity>
                </View>

              </View>
                <View style={styles.container}>
                  <View style={{alignItems:'center', alignContent:'center'}}>
                    <Icon name="favorite" size={100} color="white" />
                    <Text style={{fontSize: 20, color: 'white'}}>Profile not found.</Text>
                  </View>
                </View>
            </View>
        }
        </ScrollView >
         {!this.state.showIndicator ? 
           <Footer parent={this.Redirect} /> : null
         }
             <ImageView
                images={this.state.images}
                imageIndex={0}
                isVisible={this.state.isImageViewVisible}
                onClose={() => this.setState({isImageViewVisible: false})}
                renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
            />
     </View>
    );
  }
}

const styles = StyleSheet.create({
  bucont: {
    width: '100%', 
    flex: 1,
    marginTop: 10,
    flexDirection:'column', 
    alignContent: 'center', 
    alignItems: 'center',
  },
  follow: {
    color: 'white',
    padding: 10,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 25,
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
  allcontent: {
    height: height,
  },
  container: {
    backgroundColor:'black',
    flex: 1,
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
  userInfo4:{
    marginTop:10,
    width:'100%',
    flexDirection:'row'
  },
  leftInfo4:{
    width:'30%',
    alignItems:'center',
    justifyContent:'center'
  },
  rightInfo4:{
    width:'65%',
    marginLeft:10,
  },
  myRannt:{
    fontWeight:'bold',
    padding:5,
    marginTop:20,
    color:'#fff',
    fontSize:16,
    borderBottomWidth:0,
    borderBottomColor:'#fff',
    flexDirection: 'column',
  },
  myRerannt:{
    padding:5,
    marginTop:5,
    color:'white',
    fontSize:16,
    borderBottomWidth:2,
    borderBottomColor:'gray'
  },
  userInfo3:{
    padding:0,
    marginTop:10,
    width:'100%',
    flexDirection:'row'
  },
  leftInfo3:{
    width:'30%',
    alignItems:'center',
    justifyContent:'center'
  },
  centerInfo3:{
    width:'40%',
    alignItems:'center',
    marginTop:20,
  },
  line:{
    height:30,
    color:'#fff',
    borderRightWidth:2,
    borderRightColor:'#fff'
  },
  rightInfo2:{
    justifyContent:'center',
    width:'30%',
  },
  rannt:{
    padding:5,
    marginTop:20,
    color:'#fff',
    fontSize:16,
    borderBottomWidth:2,
    borderBottomColor:'#fff'
  },
  rerannt:{
    padding:5,
    marginTop:20,
    color:'gray',
    fontSize:16,
  },
  userInfo2:{
    padding:0,
    marginTop:0,
    width:'100%',
    flexDirection:'row',
  },
  leftInfo2:{
    width:'30%',
    alignItems:'center',
    justifyContent:'center'
  },
  centerInfo2:{
    width:'40%',
    alignItems:'center'
  },
  userName:{
    color:'#fff',
    fontSize:18,
    fontWeight:'bold',
    padding:10
  },
  centerInfoImg:{
    width:120,
    height:120,
    borderRadius:100,
  },
  rightInfo2:{
    justifyContent:'center',
    width:'30%',
  },
  followers:{
    marginTop:20,
    color:'#fff',
    fontSize:14,
  },
  following:{
    marginTop:20,
    color:'white',
    fontSize:14
  },
  userInfo:{
    padding:20,
    marginTop:10,
    width:'100%',
    flexDirection:'row'
  },
  leftInfo:{
    width:'50%',
    alignItems:'flex-start',
  },
  rightInfo:{
    width:'50%',
    alignItems:'flex-end',
  },
  mainGrid:{
    marginTop:15,
    marginBottom:70,
    width:'100%',
    flexDirection:'row',
    flexWrap:'wrap',
    padding:10,
  },
  gridContent:{
    alignItems:'center',
    justifyContent:'center',
    padding:5,
    width:width/3-7,
  },
  image:{
    width:'100%',
    height:width/2-25,
    borderRadius:10
  },
  foote: {
      marginBottom: '30%',
  }
});