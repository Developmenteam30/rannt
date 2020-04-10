import React, { Component } from 'react';
import {ActivityIndicator,Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';

const width = Dimensions.get('window').width;
export default class Notification extends Component {
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
      notifications: [],
      rannt: 'you',
    }
  }

  back = (screen) => {
     this.props.navigation.navigate(screen);
  }
  
  Redirect = (screen) => {
    this.props.navigation.navigate(screen); 
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
  async getuserdata(type){
    var check = await this.apicall(global.baseurl+'get_notifications.php?id='+this.state.user_id+'&type='+type);
    this.setState({ notifications: check,showIndicator: false});
    console.log(check);
  }
  async accept(x){
    x.follow_status = 'follow';
    var check = await this.apicall(global.baseurl+'accept_follow.php?follower_id='+x.follower_id);
    this.setState({ notifications: check});
  }
  async block(x){
    x.follow_status = 'block';
    var check = await this.apicall(global.baseurl+'block_follow.php?follower_id='+x.follower_id);
    this.setState({ notifications: check});
  }

  componentDidMount = () => {
    this.getuserdata('you');
  }
  setrannt = (type) => {
        this.setState({
           rannt: type,
           showIndicator: true
        })
    this.getuserdata(type);
  }
  profile = (userid) => {
    global.pageName = {page: 'Notification'};
    this.props.navigation.navigate('Otherprofile', {
      user_id: userid,
    }); 
  }
  goto = (url) => {
    this.props.navigation.navigate(url); 
  }

  render() {
    return (
      <View style={styles.container}>
         {this.state.showIndicator ? 
            <View style={styles.loader}>
               <ActivityIndicator size="large" color="white" /> 
            </View> : null
          }
          <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
           <TouchableOpacity onPress={()=>this.back('Home')} style={{marginHorizontal:20}}>
              <Icon name="keyboard-arrow-left" size={40} color="white" />
           </TouchableOpacity>
           <Text style={{fontWeight:'bold',fontSize:16,margin:7,marginLeft:0,color:'#FFF'}}>Back</Text>
         </View>
         <View style={styles.mainContent}>
           <TouchableOpacity style={this.state.rannt != 'you' ? styles.you : styles.following} onPress={()=> this.setrannt('following')}>
             <Text style={styles.followingText}>Following</Text>
           </TouchableOpacity> 
           <TouchableOpacity style={this.state.rannt == 'you' ? styles.you : styles.following} onPress={()=> this.setrannt('you')}>
             <Text style={styles.youText}>You</Text>
           </TouchableOpacity> 
         </View>
        {this.state.notifications.length < 1 ?
         <View style={styles.bottomContent}>
          <View style={{alignItems:'center', alignContent:'center'}}>
            <Icon name="favorite" size={100} color="white" />
            <Text style={{fontSize: 20, color: 'white'}}>Welcome {this.state.username}</Text>
            <Text style={{fontSize: 20, color: 'white'}}>You have no pending notifications.</Text>
          </View>
        </View>
        : null
        }

        <ScrollView>
         <View style={styles.bottomContent}>
          {this.state.rannt == 'you' ? (this.state.notifications.map((item,i)=> {
           return(
             <View>
            {item.notification_type != 'follow' &&
            <View style={styles.userInfo}>
              <TouchableOpacity style={styles.leftInfo}  onPress={()=>this.profile(item.other_user_id)}>
                <Image style={{borderWidth:2,borderColor:'#fff',width:40,height:40,borderRadius:100}} source={{uri: item.thumb}} />  
              </TouchableOpacity>
              <View style={styles.centerInfo}>
                <Text style={styles.centerText}><Text  onPress={()=>this.profile(item.other_user_id)}>@{item.other_user_name} </Text> <Text onPress={()=>this.goto(item.url)}>{item.text}</Text></Text>
                <View style={styles.reply}>
                  <Text style={styles.replyText}>{item.time_stamp} </Text>
                </View>
                <View style={styles.centerimage}>
                {item.image!=''&&
                  <Image style={{width:60,height:85,borderRadius:10}} source={{uri: item.image}} />  
                }
                </View>
              </View>
            </View>
              }
           </View>
            )}))
             : this.state.notifications.map((item,i)=> {
            return(
            <View>
            {item.notification_type == 'follow' &&
             <View style={styles.userInfo}>
              <TouchableOpacity style={styles.leftInfo}  onPress={()=>this.profile(item.other_user_id)}>
                <Image style={{borderWidth:2,borderColor:'#fff',width:40,height:40,borderRadius:100}} source={{uri: item.thumb}} />  
              </TouchableOpacity>
              <View style={styles.centerInfo}>
                <Text style={styles.centerText}> <Text onPress={()=>this.profile(item.other_user_id)}>{item.text}</Text></Text>
                <View style={styles.reply}>
                  <Text style={styles.replyText}>{item.time_stamp} </Text>
                </View>
                
               {item.follow.map((items,it)=> {
                return(
                  <View style={styles.centerimage}>
                    {items.follow_status == 'follow' ?
                      <TouchableOpacity style={styles.button} >
                        <Text style={styles.accept}>Accepted </Text>
                      </TouchableOpacity> : null
                    }
                    {(items.follow_status == 'requested' && this.state.private == '0') ?
                      <TouchableOpacity style={styles.button}  onPress={()=>this.accept(items, it)}>
                        <Text style={styles.accept}>Follow Back </Text>
                      </TouchableOpacity> : null
                    }
                    {items.follow_status == 'requested' && this.state.private != '0' ?
                     <View>
                       <TouchableOpacity style={styles.button}  onPress={()=>this.accept(items, it)}>
                         <Text style={styles.accept}>Accept </Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.button}  onPress={()=>this.accept(items, it)}>
                         <Text style={styles.accept}>Decline </Text>
                       </TouchableOpacity>
                     </View> : null
                    }                 
                    {items.follow_status == 'block' && 
                      <TouchableOpacity style={styles.leftInfo} >
                       <Text style={styles.replyText}>Blocked </Text>
                      </TouchableOpacity>
                    }

                  </View>                
                )})}

              </View>
            </View>
            }
            </View>
          )})}

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
  button:{
    borderWidth:2,
    borderColor:'#fff',
    backgroundColor:'#292828',
    borderRadius:100,
    paddingHorizontal:8,
  },
  accept:{
    color:'#fff',
    fontSize:16,
    fontWeight:'bold',
    padding:5,
  },
  mainContent:{
    marginTop:10,
    width:'100%',
    flexDirection:'row'
  },
  centerimage:{
    width:'80%',
    alignItems:'center',
    justifyContent:'center',
    marginTop:5
  },
  following:{
    width:'50%',
    alignItems:'center',
    justifyContent:'center'
  },
  followingText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
  },
  you:{
    width:'50%',
    alignItems:'center',
    justifyContent:'center',
    borderBottomWidth:2,
    borderBottomColor:'#fff',
  },
  youText:{
    padding:5,
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
  },
  bottomContent:{
    marginTop:20,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:100,
  },
  userInfo:{
    flexDirection:'row',
    paddingTop:30,
    paddingLeft:40,
    paddingRight:40,
  },
  leftInfo:{
    width:'20%'
  },
  centerInfo:{
    marginHorizontal:15,
    width:'80%',
  },
  centerText:{
    color:'white',
    fontWeight:'bold',
    fontSize:15,
  },
  centerText2:{
    color:'gray',
    fontSize:12,
  },
  reply:{
    flexDirection:'row',
    width:'100%',   
  },
  replyText:{
    color:'white',
    fontSize:14,
    paddingTop:5,
    paddingLeft:25,
  },
  rightInfo:{
    width:'20%',
    marginVertical:15,
  },


});