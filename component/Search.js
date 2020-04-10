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
const height = Dimensions.get('window').height;
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
     this.state = {
       showIndicator: true ,
       search: '',
       favdata: [],
       popular: [],
       userdata: [],
       user_id: global.userdata.user_id,
       type: 'user',
       tags: [],
     };
     this.gotorannt = this.gotorannt.bind(this);
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
  Redirect = (screen) => {
    this.props.navigation.navigate(screen); 
  }
  async getuserdata(id){
    var check = await this.apicall(global.baseurl+'get_popular_post.php');
    this.setState({ popular: check});
    var check = await this.apicall(global.baseurl+'get_fav_post.php?user_id='+id);
    this.setState({ favdata: check,showIndicator: false});
  }
  async getcontent(search){
    if(this.state.type == 'user'){
      var url = global.baseurl+'search_user.php?id='+search+'&limit=0';
    }else{
      var url = global.baseurl+'search_tag.php?id='+search+'&limit=0';
    }
    var check = await this.apicall(url);
    this.setState({ userdata: check});
  }  
  componentDidMount = () => {
    this.getuserdata(this.state.user_id);
  }
  gotorannt = (post_id) => {
    this.props.navigation.navigate('Post', {
      post_id: post_id,
    });
  }
  profile = (userid) => {
    this.props.navigation.navigate('Otherprofile', {
      user_id: userid,
    }); 
  }
  hashtag = (userid) => {
    this.props.navigation.navigate('Hashtags', {
      tag: userid,
    }); 
  }
  _onRefresh(type) {
    this.setState({'type': type, userdata: []}); 
    setTimeout(() => {this.getcontent(this.state.search), 200});
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showIndicator ? 
          <View style={styles.loader}>
             <ActivityIndicator size="large" color="white" /> 
          </View> : null
        }
        <View style={styles.divider}>
         <View style={styles.informationDivider}>
           <View style={styles.inputContainer}>
             <TextInput style={styles.inputs}
              placeholder="SEARCH"
              placeholderTextColor = "gray"
              onChangeText={(TextInputValue) => {this.setState({search:TextInputValue}); this.getcontent(TextInputValue);}}
              />
           </View>
         </View>
        </View>
        {this.state.search != '' &&
         <View style={styles.mainContent}>
           <TouchableOpacity style={this.state.type == 'user' ? styles.you : styles.following} onPress={()=> this._onRefresh('user')}>
             <Text style={styles.followingText}>Users</Text>
           </TouchableOpacity> 
           <TouchableOpacity style={this.state.rannt != 'user' ? styles.you : styles.following} onPress={()=> this._onRefresh('hashtags')}>
             <Text style={styles.youText}>Hashtags</Text>
           </TouchableOpacity> 
         </View>
        }

        <ScrollView style={styles.newcontent}>
        <View style={styles.bottomContent}>
          {this.state.search != '' && this.state.type == 'user' ? this.state.userdata.map((item,i)=> {
            return(
              <TouchableOpacity activeOpacity={0.8} style={styles.userInfo} onPress={()=>this.profile(item.user_id)}>
                <View style={styles.leftInfo}>
                  <Image style={styles.Images} source={{uri: item.thumb}} />  
                </View>
                <View style={styles.centerInfo}>
                  <Text style={styles.centerText}>@{item.name}:</Text>
                  <View style={styles.reply}>
                    <Text style={styles.replyText}>Followed by {item.followers}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )} ) 
            : null
          }
          {this.state.search != '' && this.state.type != 'user' ? this.state.userdata.map((item,i)=> {
            return(
              <TouchableOpacity activeOpacity={0.8} style={styles.userInfo} onPress={()=>this.hashtag(item.tag)}>
                <View style={styles.centerInfo}>
                  <Text style={styles.centerText}>#{item.tag}:</Text>
                </View>
              </TouchableOpacity>
            )} ) 
            : null
          }
          </View>
        </ScrollView>

        {this.state.search == '' &&
        <ScrollView>
            {this.state.popular.map((item,i)=> {
              return(
                <TouchableOpacity activeOpacity={0.8} style={styles.video} onPress={()=> this.gotorannt(item.post_id)}>
                  {i==0 ?
                    <Image style={styles.vid} source={{uri: item.image}} />  
                    : null
                  }
                </TouchableOpacity>                
              )
            })}
            {this.state.favdata.length>0 &&
              <Text style={styles.favorite}>FAVORITES</Text>
            }
            <ScrollView style={styles.hourshinecontent} horizontal={true} showsHorizontalScrollIndicator={false}>                
              {this.state.favdata.map((item,i)=> {
                return(
                <TouchableOpacity activeOpacity={0.8}  onPress={()=> this.gotorannt(item.post_id)}> 
                 <View  style={styles.topImage}>
                    <Image style={styles.img} source = {require('../image/post.jpg')} />
                 </View>
                </TouchableOpacity>
                )
              })}
           </ScrollView>

          <Text style={styles.popular}>POPULAR</Text>
          <View style={styles.mainGrid}>          
            {this.state.popular.map((item,i)=> {
              return(
                <TouchableOpacity activeOpacity={0.8} style={styles.gridContent} onPress={()=> this.gotorannt(item.post_id)}>
                   <Image style={styles.image}  source={{uri: item.image}} />
                </TouchableOpacity>
              )
            })}

 
          </View>
        </ScrollView>
      }
         {!this.state.showIndicator ? 
           <Footer parent={this.Redirect} /> : null
         }
     </View>
    );
  }
}

const styles = StyleSheet.create({
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
  newcontent: {
    width:'100%',
  },
  bottomContent:{
    marginTop:0,
    width:'100%',
    marginBottom:10,
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
  divider:{
    marginTop:10,
    width:'100%',
    borderTopWidth:2,
    borderColor:'#434343',
    alignItems:'center',
    justifyContent:'center',
    padding:0,
  },
  informationDivider:{
    marginTop:20,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  }, 
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor: '#363333',
    borderRadius:5,
    width:'90%',
    height:55,
    marginBottom:5,
    flexDirection: 'row',
  },
  inputs:{
    height:45,
    marginLeft:0,
    color:'#fff',
    width: '100%',
    textAlign: 'center'
  },
  video:{
    justifyContent: 'center',
    alignItems: 'center',    
    marginVertical:0,
  },
  vid:{
    width:width,
    height:width/2*3,
    borderRadius:0,  
  },
  favorite:{
    width:'100%',
    textAlign:'center',
    color:'white',
    fontWeight:'bold',
    fontSize:17
  },
  hourshinecontent: {
    flex:1,
    flexDirection:'row',
    marginTop:20,
    marginLeft:0,
    marginRight:10,
    marginBottom:0,
    padding:0,
  },
  fotitle: {
    paddingLeft: 5,
    marginTop:5,
    textAlign:'center',    
    alignItems:'center',
  },
  topImage:{
    width: 135, 
    height: 200,
    marginLeft: 10, 
    marginRight: 0, 
    borderRadius: 1,  
  },
  img:{
    width: 135, 
    height: 200,
    borderRadius: 1,  
  },
  popular:{
    marginTop:20,
    width:'100%',
    textAlign:'center',
    color:'white',
    fontWeight:'bold',
    fontSize:17,
  },
  mainGrid:{
    marginTop:5,
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
  Images:{
    borderWidth:2,
    borderColor:'#fff',
    width:40,
    height:40,
    borderRadius:100,    
  },


});