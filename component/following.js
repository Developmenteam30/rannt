import React, { Component } from 'react';
import {ActivityIndicator,Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {StackActions, NavigationActions,createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';

const width = Dimensions.get('window').width;
export default class Following extends Component {
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
       followers: [],
       userdata: [],
       following: [],
       rannt: 'follower',
       fone: 0,
     }
     this.apicall = this.apicall.bind(this);
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
  async getuserdata(id){
    var check = await this.apicall(global.baseurl+'user_details.php?user_id='+id);
    this.setState({ userdata: check,showIndicator: false,});
  }
  async getfollowers(id){
    if(this.state.search){
      var check = await this.apicall(global.baseurl+'get_followers.php?id='+id+'&page='+this.state.fone+"&search="+this.state.search);
    }else{
      var check = await this.apicall(global.baseurl+'get_followers.php?id='+id+'&page='+this.state.fone+"&search=");
    }
    this.setState({ followers: check});
  }
  async getfollowing(id){
    var check = await this.apicall(global.baseurl+'get_following.php?id='+id+'&page='+this.state.fone+"&search="+this.state.search);
    this.setState({ following: check});
  }
/*  async delete(follower_id){
    var check = await this.apicall(global.baseurl+'delete_follow.php?follower_id='+follower_id);
    this.setState({ followers: check});
  }
  async accept(x){
    x.follow_status == 'follow';
    var check = await this.apicall(global.baseurl+'accept_follow.php?follower_id='+x.follower_id);
    this.setState({ followers: check});
  }*/

  componentDidMount = () => {
    this.props.navigation.addListener(
      'willFocus', payload => {
      var id = this.props.navigation.state.params;
      this.setState({
         id: id.user_id,
      });
      this.getuserdata(id.user_id);
      this.getfollowers(id.user_id);
      this.getfollowing(id.user_id);
    });
   
  }

  back = (screen) => {console.log(screen);
     this.props.navigation.navigate(screen);
  }

  Redirect = (screen) => {
    this.props.navigation.navigate(screen); 
  }
  setrannt = (type) => {
    if(type && type == 'following'){
        this.setState({
           rannt: 'following',
        })
    }else{
        this.setState({
           rannt: 'follower',
        })
    }
  }
  profile = (userid) => {
    global.pageName = {page: 'Following'};
    this.props.navigation.navigate('Otherprofile', {
      user_id: userid,
    }); 
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.user_id) {
      this.setState({
         user: [],
         followers: [],
         userdata: [],
         following: [],
      })
      this.componentDidMount();
    }
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
           <TouchableOpacity onPress={()=>this.back(global.pageName.page)} style={{marginHorizontal:20}}>
              <Icon name="keyboard-arrow-left" size={40} color="white" />
           </TouchableOpacity>
           <Text style={{fontWeight:'bold',fontSize:16,margin:7,marginLeft:0,color:'#FFF'}}>Back</Text>
         </View>
        {this.state.userdata.map((item,i)=> {
          return(
         <View style={styles.mainContent}>
           <TouchableOpacity style={this.state.rannt == 'follower' ? styles.you : styles.following} onPress={()=> this.setrannt('follower')}>
             <Text style={styles.followingText}>{item.followers}</Text>
             <Text style={styles.followingText}>Followers</Text>
           </TouchableOpacity> 
           <TouchableOpacity style={this.state.rannt != 'follower' ? styles.you : styles.following} onPress={()=> this.setrannt('following')}>
             <Text style={styles.followingText}>{item.followings}</Text>
             <Text style={styles.youText}>Following</Text>
           </TouchableOpacity> 
         </View>
          )
        })}

         <View style={styles.informationDivider}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="SEARCH"
              placeholderTextColor = "gray"
              onChangeText={(email) => this.setState({email})} />
           </View>
         </View>
              <View>
              {this.state.rannt == 'follower' && this.state.followers.length < 1 ?
                <View style={{width: '100%'}}>
                  <View style={{alignItems:'center', alignContent:'center'}}>
                    <Icon name="favorite" size={100} color="white" />
                    <Text style={{fontSize: 20, color: 'white'}}>Welcome</Text>
                    <Text style={{fontSize: 20, color: 'white'}}>No Follower.</Text>
                  </View>
                </View>
                : null
              }
              </View>
              <View>
              {this.state.rannt != 'follower' && this.state.following.length < 1 ?
                <View style={{width: '100%'}}>
                  <View style={{alignItems:'center', alignContent:'center'}}>
                    <Icon name="favorite" size={100} color="white" />
                    <Text style={{fontSize: 20, color: 'white'}}>Welcome</Text>
                    <Text style={{fontSize: 20, color: 'white'}}>No Followings</Text>
                  </View>
                </View>
                : null
              }
              </View>

        <ScrollView>
          <View style={styles.bottomContent}>
          {this.state.rannt == 'follower' ? this.state.followers.map((item,i)=> {
            return(
            <TouchableOpacity style={styles.userInfo} onPress={()=>this.profile(item.user_id)}>
              <View style={styles.leftInfo}>
                <Image style={styles.Image} source={{uri: item.thumb}} />  
              </View>
              <View style={styles.centerInfo}>
                <Text style={styles.centerText}>@{item.name}:</Text>
                <View style={styles.reply}>
                  <Text style={styles.replyText}>Followed by {item.followers}</Text>
                </View>
              </View>
               <TouchableOpacity style={styles.button} activeOpacity={0.6}>
                 <Text style={styles.accept}>ACCEPTED</Text>
               </TouchableOpacity>
            </TouchableOpacity>
            )} ) 
          : this.state.following.map((item,i)=> {
            return(

            <TouchableOpacity style={styles.userInfo} onPress={()=>this.profile(item.user_id)}>
              <View style={styles.leftInfo}>
                <Image style={styles.Image} source={{uri: item.thumb}} />  
              </View>
              <View style={styles.centerInfo}>
                <Text style={styles.centerText}>@{item.name}:</Text>
                <View style={styles.reply}>
                  <Text style={styles.replyText}>Followed by {item.followers}</Text>
                </View>
              </View>
               <TouchableOpacity style={styles.button} activeOpacity={0.6}>
                 <Text style={styles.accept}>ACCEPTED</Text>
               </TouchableOpacity>
            </TouchableOpacity>
          )} ) 
        }


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
  following:{
    width:'50%',
    alignItems:'center',
    justifyContent:'center'
  },
  followingText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:14
  },
  Image:{
    borderWidth:2,
    borderColor:'#fff',
    width:40,
    height:40,
    borderRadius:100,    
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
  informationDivider:{
    marginTop:30,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  }, 
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor: '#363333',
    borderRadius:10,
    width:'90%',
    height:45,
    marginBottom:5,
    flexDirection: 'row',
  },
  inputs:{
    height:45,
    marginLeft:0,
    color:'#fff',
  },
  bottomContent:{
    marginTop:0,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:100,
  },
  userInfo:{
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    marginTop:30,
  },
  leftInfo:{
    width:'15%'
  },
  centerInfo:{
    padding:0,
    width:'50%',
  },
  centerText:{
    color:'white',
    fontWeight:'bold',
    fontSize:13,
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
    color:'gray',
    fontSize:12,
    paddingTop:5,
  },
  rightInfo:{
    width:'30%',
    marginVertical:0,
  },
  button:{
    marginTop:0,
    height:30,
    borderWidth:1,
    borderColor:'#fff',
    backgroundColor:'#292828',
    borderRadius:100,
    paddingHorizontal:12,
    justifyContent:'center',
  },
  accept:{
    color:'#fff',
    fontSize:10,
    paddingTop:0,
  },


});