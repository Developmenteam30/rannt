import React, { Component } from 'react';
import {ActivityIndicator,RefreshControl,FlatList,Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {StackActions, NavigationActions,createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';

const width = Dimensions.get('window').width;
export default class Likes extends Component {
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
      page : 0,
      post_id : 0,
      likes : [],
      page:global.pageName.page,
      user_id: global.userdata.user_id,
      refreshing: false,
    }
  }

  back=(screen) => {
     this.props.navigation.navigate(screen);
  }
 
  profile = (userid) => {
    this.props.navigation.navigate('Otherprofile', {
      user_id: userid,
    }); 
  }
 
  Redirect = (screen) => {
    this.props.navigation.navigate(screen); 
  }
  getpostlikebyid = (url, id) => {
    fetch(global.baseurl+url+'.php?id='+id+'&page='+this.state.page,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
        if(responseJson.length == 0){
          this.setState({
             likes: responseJson,
          })
        }else{
          var i = 0;
          var data = this.state.likes;
          while(i < responseJson.length){
            data.push(responseJson[i]);
            i++;
          }
          this.setState({
             likes: data,
          })
        }
       this.setState({showIndicator: false})  
    });
    this.state.page++;
  }  
  componentDidMount = () => {
    var id = this.props.navigation.state.params;
    if(id.post_id){
      this.getpostlikebyid('get_post_likes',id.post_id);
    }else{
      this.getpostlikebyid('get_comment_likes',id.comment_id);
    }
  }
  _onRefresh = () => {
      this.setState({
        refreshing: true
      });
        setTimeout(() => {
          this.setState({
            refreshing: false
          })
        }, 500);
   } 

  render() {
    return (
      <View style={styles.container}>
         {this.state.showIndicator ? 
            <View style={styles.loader}>
               <ActivityIndicator size="large" color="white" /> 
            </View> : null
          }
        <ScrollView >
         <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
           <TouchableOpacity onPress={()=>this.back(global.pageName.page)} style={{marginHorizontal:20}}>
              <Icon name="keyboard-arrow-left" size={40} color="white" />
           </TouchableOpacity>
           <Text style={{fontWeight:'bold',fontSize:16,margin:7,marginLeft:0,color:'#FFF'}}>LIKES</Text>
         </View>
         <View style={{marginTop:30,marginBottom:60}}>
              <FlatList
                refreshControl={
                 <RefreshControl
                   refreshing={this.state.refreshing}
                   onRefresh={this._onRefresh}
                  />
                }

                data={this.state.likes}
                onEndReached={() => this.componentDidMount}
                onEndReachedThreshold={0.5}
                renderItem={({ item}) => (

                  <View style={styles.mainContent}>
                    <View style={styles.userInfo}>
                      <View style={styles.leftInfo}>
                       <TouchableOpacity onPress={()=>this.profile(item.user_id)} style={styles.leftInfo}>
                         <Image style={{borderWidth:2,borderColor:'#fff',width:50,height:50,borderRadius:100}} source={{uri:item.thumb}} />  
                       </TouchableOpacity>
                      </View>
                      <View style={styles.centerInfo}>
                        <Text onPress={()=>this.profile(item.user_id)} style={styles.centerText}>@{item.name}</Text>
                        <View style={styles.reply}>
                          <Text style={styles.replyText}>{item.timestamp} </Text>
                        </View>
                      </View>
                    </View>
                  </View>        
                )}
                keyExtractor={(item, index) => index.toString()}
             />
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
  mainContent:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  userInfo:{
    flexDirection:'row',
    paddingTop:0,
    padding:40,
  },
  leftInfo:{
    width:'10%'
  },
  centerInfo:{
    marginHorizontal:30,
    width:'80%',
  },
  centerText:{
    color:'white',
    fontWeight:'bold',
    fontSize:15,
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
    color:'white',
    fontSize:15,
    paddingTop:10,
  },
  rightInfo:{
    width:'20%',
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
  icon:{
    paddingLeft:30,
  },
  likes:{
    width:'100%',
    color:'gray',
    fontSize:20,
    marginLeft:70,
    padding:5
  },
  comment:{
    width:'100%',
    flexDirection:'row',
    marginBottom:50,
  },
  inputContainer: {
    borderTopWidth:2,
    borderBottomWidth:0,
    borderTopColor: '#827c7c',
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


});