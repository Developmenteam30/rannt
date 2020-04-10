import React, { Component } from 'react';
import {KeyboardAvoidingView,ActivityIndicator,RefreshControl,FlatList,Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {StackActions, NavigationActions,createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';
import Toast from './Toast';

const width = Dimensions.get('window').width;
export default class Comment extends Component {
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
      comments : [],
      user_id: global.userdata.user_id,
      refreshing: false,
      reply: false,
      comment_id: 0,
      reply_content: '',
      commenting:'',
    }
  }

  back=(screen) => {
     this.props.navigation.navigate(screen);
  }

  getpostlikebyid = (id) => {
   setTimeout(() => { 
    fetch(global.baseurl+'get_all_comments.php?id='+id+'&user_id='+global.userdata.user_id+'&page='+this.state.page,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
        var i = 0;
        var data = this.state.comments;
        while(i < responseJson.length){
          data.push(responseJson[i]);
          i++;
        }
        this.setState({
          comments: data,
          showIndicator: false,               
        })
    });
     this.state.page++;
   })
  }
  
  Redirect = (screen) => {
    this.props.navigation.navigate(screen); 
  }
  
  componentDidMount = () => {
    var id = this.props.navigation.state.params;
    this.setState({
       post_id: id.post_id,
    })
    if(id.post_id){
      this.getpostlikebyid(id.post_id);
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
  delete = (x, index) => {
    var data = this.state.comments;
    data.splice(index, 1);
    this.setState({
       comments: data,
    });
    fetch(global.baseurl+'delete_comment.php?id='+x.comment_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      var data = responseJson; 
    });
  }
  deletes = (x, index, i) => {
    var data = this.state.comments;
    data[index].recomment.splice(i, 1);
    this.setState({
       comments: data,
    });
    fetch(global.baseurl+'delete_comment.php?id='+x.comment_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      var data = responseJson; 
    });
  }
  active_input = (x) => {
    this.state.reply = true;
    this.state.comment_id = x.comment_id;
    this.state.reply_content = x.comment;
  }
  comment_likeme = (x, index) => {
    var data = this.state.comments;
    if(data[index] && data[index].liked){
        data[index].liked = false;
        data[index].like--;
    }else if(data[index] && !data[index].liked){
        data[index].liked = true;
        data[index].like++;
    }
    this.setState({
       comments: data,
    });
    var id = this.state.user_id;
    fetch(global.baseurl+'addcommentfav.php?id='+id+'&comment_id='+data[index].comment_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      var data = responseJson; 
    });

  }
  comment_likemes = (x, index, i) => {
    var data = this.state.comments;
    if(data[index] && data[index].recomment[i].liked){
        data[index].recomment[i].liked = false;
        data[index].recomment[i].like--;
    }else if(data[index] && !data[index].recomment[i].liked){
        data[index].recomment[i].liked = true;
        data[index].recomment[i].like++;
    }
    this.setState({
       comments: data,
    });
    var id = this.state.user_id;
    fetch(global.baseurl+'addcommentfav.php?id='+id+'&comment_id='+data[index].recomment[i].comment_id,{
     method:"GET",
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      var data = responseJson; 
    });

  }
  profile = (userid) => {
    this.props.navigation.navigate('Otherprofile', {
      user_id: userid,
    }); 
  }
  gotolike = (comment_id) => {
    this.props.navigation.navigate('Likes', {
      comment_id: comment_id,
    }); 
  }
  unsetreply(){
    this.setState({
     reply: false,
     reply_content: "",
    });
  }
  comment = () => {
    if(this.state.commenting == ''){
      this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Please Type Something..!');
    }else{
      this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Processing..!');
      var id = this.state.user_id;
      if(this.state.reply){
          var url = global.baseurl+'add_comment.php?id='+this.state.post_id+"&user_id="+id+"&comment_id="+this.state.comment_id+"&comment="+encodeURIComponent(this.state.commenting);
      }else{
          var url = global.baseurl+'add_comment.php?id='+this.state.post_id+"&user_id="+id+"&comment="+encodeURIComponent(this.state.commenting);
      }  
      fetch(url,{
       method:"GET",
      })
      .then((response) => response.json())
      .then((responseJson) => { 
        this.setState({commenting: ''});
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Comment added successfully..!');
        var data = responseJson; 
        var comments = this.state.comments;
        if(this.state.reply){
          for(var i=0; i<this.state.comments.length; i++){
            if(this.state.comments[i].comment_id == this.state.comment_id){
              comments[i].recomment.push(data.comment);
            }
          }
        }else{
          data.comment.recomment = [];
          comments.push(data.comment);
        }
        this.setState({
           reply: false,
           commenting: '',
           comments: comments,
        });
      });
    }
  }
  gotouser= (user_id) => {
    this.props.navigation.navigate('Otherprofile', {
      user_name: user_id,
    }); 
  }
  sendhash = (data) => {
    this.props.navigation.navigate('Hashtags', {
      tag: data,
    }); 
  }

  settextcomment = (item) => {
    return (
      item.split().map((items,i)=> {
        if(items.indexOf('@') == -1){
          return(
            <Text>{items}</Text>
          )
        }else if(items.indexOf('#') != -1){
          return(
            <Text onPress={()=>this.sendhash(items)}>{items}</Text>
          )
        }else{
          return(
            <Text onPress={()=>this.gotouser(items)}>{items}</Text>
          )
        }
      })
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <Toast ref = "hamaoToast"/>
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
           <Text style={{fontWeight:'bold',fontSize:16,margin:7,color:'#FFF'}}>COMMENTS</Text>
      
         </View>
         <View style={{marginTop:30}}>
              <FlatList
                refreshControl={
                 <RefreshControl
                   refreshing={this.state.refreshing}
                   onRefresh={this._onRefresh}
                  />
                }

                data={this.state.comments}
                onEndReached={() => this.componentDidMount}
                onEndReachedThreshold={0.5}
                renderItem={({ item, index}) => (

                    <View style={item.delete ? styles.mainContent : styles.mainContent}>
                      <View style={styles.userInfo}>
                        <TouchableOpacity onPress={()=>this.profile(item.user_id)} style={styles.leftInfo}>
                          <Image style={{borderWidth:2,borderColor:'#fff',width:50,height:50,borderRadius:100}} source={{uri: item.thumb}} />  
                        </TouchableOpacity>
                        <View style={styles.centerInfo}>
                          <Text style={styles.centerText}><Text onPress={()=>this.profile(item.user_id)}>@{item.name}</Text>:{this.settextcomment(item.comment)} </Text>
                          <View style={styles.reply}>
                            <Text style={styles.replyText}>{item.timestamp}  </Text>
                            <TouchableOpacity onPress={()=>this.active_input(item)}>
                              <Icon name="reply" size={25} color="white" />
                              <Text style={styles.replyText}> </Text>
                            </TouchableOpacity>
                            {this.state.user_id == item.user_id &&
                              <TouchableOpacity onPress={()=>this.delete(item, index)}>
                                <Icon name="delete" size={25} color="white" />
                                <Text style={styles.replyText}> </Text>
                              </TouchableOpacity>
                            }
                          </View>
                          {item.like && item.like>0 ?
                            <Text style={styles.replyTexts} onPress={()=>this.gotolike(item.comment_id)}>{item.like} likes  </Text>
                            : null
                          }
                        </View>
                        {!item.liked ?
                          <TouchableOpacity onPress={()=>this.comment_likeme(item, index)}>
                            <Icon name="favorite-border" size={30} color="white" />
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={()=>this.comment_likeme(item, index)}>
                            <Icon name="favorite" size={30} color="white" />
                          </TouchableOpacity>
                        }
                      </View>
                        {item.recomment.map((items,i)=> {
                          return(
                            <View style={styles.userInfos}>
                              <TouchableOpacity style={styles.leftInfo} onPress={()=>this.profile(items.user_id)}>
                                <Image style={{borderWidth:2,borderColor:'#fff',width:50,height:50,borderRadius:100}} source={{uri: items.thumb}} />  
                              </TouchableOpacity>
                              <View style={styles.centerInfo}>
                                <Text style={styles.centerText}><Text onPress={()=>this.profile(items.user_id)}>@{items.name}</Text>:{this.settextcomment(items.comment)} </Text>
                                <View style={styles.reply}>
                                  <Text style={styles.replyText}>{items.timestamp} </Text>
                                  <TouchableOpacity onPress={()=>this.active_input(item)}>
                                    <Icon name="reply" size={25} color="white" />
                                    <Text style={styles.replyText}> </Text>
                                  </TouchableOpacity>
                                  {this.state.user_id == items.user_id &&
                                    <TouchableOpacity onPress={()=>this.deletes(items, index, i)}>
                                      <Icon name="delete" size={25} color="white" />
                                      <Text style={styles.replyText}> </Text>
                                    </TouchableOpacity>
                                  }
                                </View>
                                {item.like && item.like>0 ?
                                  <Text style={styles.replyTexts} onPress={()=>this.gotolike(items.comment_id)}>{items.like} likes  </Text>
                                  : null
                                }
                              </View>
                              {!items.liked ?
                                <TouchableOpacity onPress={()=>this.comment_likemes(items, index,i)}>
                                  <Icon name="favorite-border" size={30} color="white" />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=>this.comment_likemes(items, index, i)}>
                                  <Icon name="favorite" size={30} color="white" />
                                </TouchableOpacity>
                              }
                            </View>
                          )} ) 
                        }
                    </View>        
                )}
                keyExtractor={(item, index) => index.toString()}
             />
          </View>
        </ScrollView>
        {this.state.reply &&
          <View style={styles.comment}>
              <Text style={{color: 'white'}}>{this.state.reply_content}</Text>
          </View>
        }
         <KeyboardAvoidingView behavior="padding" enabled>
          <View style={styles.comment}>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
               placeholder="Add a comment"
               placeholderTextColor = "#fff"
               returnKeyType='next'
               value={this.state.commenting} 
               onChangeText={(TextInputValue) => this.setState({commenting:TextInputValue})} />
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>this.comment()}>
              <Text style={styles.send}>Send</Text>
            </TouchableOpacity>            
          </View>
        </KeyboardAvoidingView>
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
  deleteContent: {
    height: 0,
    opacity: 0,
  },
  userInfo:{
    flexDirection:'row',
    paddingTop:0,
    padding:40,
  },
  userInfos:{
    flexDirection:'row',
    paddingTop:0,
    padding:40,
    marginLeft: 50,
  },
  leftInfo:{
    width:'10%'
  },
  centerInfo:{
    marginHorizontal:30,
    width:'70%',
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
    paddingTop:5,
  },
  replyTexts:{
    flex: 1,
    color:'white',
    fontSize:15,
    paddingTop:5,
    width: '80%',
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
    marginBottom:47,
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