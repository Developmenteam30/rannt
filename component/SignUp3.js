import React, { Component } from 'react';
import {ActivityIndicator,Dimensions,AsyncStorage,Platform,StatusBar,ImageBackground,Text,TextInput, View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Footer from './Footer';
import logo_back from '../image/logo_back.jpg';
import logos from '../image/logo.png';
import rant from '../image/rant.png';
import post from '../image/post.jpg';
import Toast from './Toast';

const width = Dimensions.get('window').width;
export default class SignUp2 extends Component {
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
       teams: [],
       pet: '',
       team: []
     };
  }

  next = () => {
    this.props.navigation.navigate('Home'); 
  }  

  back = () => {
    this.props.navigation.navigate('SignUp2'); 
  }  
  componentDidMount = () =>{
      fetch(global.baseurl+'team_list.php?id='+global.userdata.user_id, {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson){
           this.setState({teams: responseJson,showIndicator:false});
            if(responseJson.length>0){
                this.state.pet = responseJson[0].name;
            }
            console.log(this.state.pet);
         }else{
            this.refs.hamaoToast.Default_Toast_Top_With_Different_Color(responseJson.response);
         }
       })
      .catch(function(error) {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
      });

  }
  checkexist = (id)=>{
    if(this.state.team.indexOf(id) == -1){
      return false;
    }else{
      return true;
    }
  }
  add=(x)=>{
    var team = this.state.team;
    if (team.indexOf(x) == -1) {
      team.push(x);
    }else{
      team.splice(team.indexOf(x), 1);
    }
    this.setState({team:team});
  }
  nextnow = () => {
       var id = global.userdata.user_id;
       var data = new FormData();     
      data.append("data", JSON.stringify(this.state.team));
      fetch(global.baseurl+'login.php?id='+id, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.navigation.navigate('Home'); 
       })
      .catch(function(error) {
        console.log(error);
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
         
        <View style={styles.private}>
          <Text style={styles.privateText}>WHAT TEAMS DO YOU LIKE?</Text>
        </View>
         
          <View style={styles.mainContent}>
            <View style={styles.row}>
              <View style={styles.rowInner}>
                <TouchableOpacity style={styles.Icon}>
                  <Icon name="star" size={40} color="yellow" />
                </TouchableOpacity>
              </View>
              {this.state.teams.map((item,i)=> {
                return(
                  <View style={styles.rowInner}>
                    <TouchableOpacity style={styles.Icon} onPress={()=> this.setState({pet: item.name})}>
                      <Image style={styles.cateImg} source={{uri: item.image}} /> 
                      <Text style={styles.category}>{item.short}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
         
            </View>
           </View>
        <ScrollView style={{marginBottom:0}}>
        
            <View style={styles.row2}>
          {this.state.teams.map((item,i)=> {
            return(
                item.name == this.state.pet && item.teams.map((items,is)=> {
                  return(
                    <View style={styles.rowInner2}>
                          <TouchableOpacity style={styles.Icon2} onPress={()=>this.add(items.team_id)}>
                          {!this.checkexist(items.team_id) ?
                            <Image style={styles.cateImg2} source={{uri: items.image}} /> 
                            :
                            <Image style={styles.cateImg3} source={{uri: items.image}} /> 
                          }
                          </TouchableOpacity>
                    </View>
                  )
                })
            )
          })}
         
           </View>
        </ScrollView>
           
            <View style={styles.mainBottom}>
             <View style={styles.bottom}>
              <View style={styles.back}>
                <TouchableOpacity onPress={()=>this.back()} style={{flexDirection:'row'}}>
                  <Icon name="keyboard-arrow-left" size={40} color="white" />
                  <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>             
              </View>
       
              <View style={styles.back}>
                <TouchableOpacity onPress={()=>this.next()} style={{flexDirection:'row'}}>
                  <Text style={styles.backText}>SKIP</Text>
                  <Icon name="keyboard-arrow-right" size={40} color="white" />
                </TouchableOpacity>             
              </View>
       
              <View style={styles.back}>
                <TouchableOpacity onPress={()=>this.next()} style={{flexDirection:'row'}}>
                  <Text style={styles.backText}>NEXT</Text>
                  <Icon name="keyboard-arrow-right" size={40} color="white" />
                </TouchableOpacity>             
              </View>
             </View> 
            </View>
         
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
  hidden: {
    width: 0,
    height: 0,
  },
  private:{
    marginTop:30,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  privateText:{
    textAlign:'center',
    width:'90%',
    color:'white',
    fontWeight:'bold',
    fontSize:20,
    borderBottomWidth:2,
    borderBottomColor:'#fff',
    paddingBottom:10,
  },
  mainContent:{
    width:'100%',
    marginBottom:10,
    marginTop:10,
  },
  row:{
    textAlign:'left',
    paddingTop:0,
    padding:20,    
    width:'100%',
    marginBottom:0,
    marginTop:0,
    flexDirection:'row',
  },
  rowInner:{
    width:'18%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    marginTop:10,
    marginLeft:10,
    flexDirection:'row',
  },
  icon:{
    width:20,
    padding:0
  },
  cateImg:{
   marginTop:10,
   width:40,
   height:40,
   borderRadius:100, 
  },
  category:{
    color:'#fff',
    fontSize:15,
    textAlign:'center',
    paddingTop:6,
    borderBottomColor:'#fff',
    borderBottomWidth:2,
  }, 
  row2:{
    paddingTop:0,
    padding:20,
    width:'100%',
    marginBottom:10,
    marginTop:40,
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  rowInner2:{
    width:'25%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    marginTop:10,
  },
  icon2:{
    width:0,
    padding:0
  },
  cateImg2:{
   marginTop:10,
   width:60,
   height:60,
   borderRadius:100,
   margin:0, 
  },
  cateImg3:{
   marginTop:10,
   width:60,
   height:60,
   borderRadius:100,
   opacity: 0.4, 
   margin:0, 
  },
   mainBottom:{
    backgroundColor:'black',
    width:'100%',
    borderTopWidth:1,
    borderTopColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    position:'absolute',
    bottom:0,
  },
  bottom:{
    width:'100%',
    flexDirection:'row',
    marginLeft:25,
  },
  back:{
    width:'33%',
    padding:10,
  },
  backText:{
    color:'#fff',
    fontSize:16,
    marginTop:8,
  },
 
  
});