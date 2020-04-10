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
       leagues: [],
       leag: [],
     };
  }

 next = () => {
    this.props.navigation.navigate('Home'); 
  }  
  nextnow = () => {
    console.log(global.userdata);
       var id = global.userdata.user_id;
       var data = new FormData();     
      data.append("data", JSON.stringify(this.state.leag));
      fetch(global.baseurl+'addleagues.php?id='+id, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.navigation.navigate('SignUp3'); 
       })
      .catch(function(error) {
        console.log(error);
      });
  }
  back = () => {
    this.props.navigation.navigate('SignUp1'); 
  }  
  componentDidMount = () =>{
      fetch(global.baseurl+'category_list.php', {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.response){
           this.setState({leagues: responseJson.response,showIndicator:false});
         }else{
            this.refs.hamaoToast.Default_Toast_Top_With_Different_Color(responseJson.response);
         }
       })
      .catch(function(error) {
        this.refs.hamaoToast.Default_Toast_Top_With_Different_Color('Network failure!');
      });

  }
  checkexist = (id)=>{
    if(this.state.leag.indexOf(id) == -1){
      return false;
    }else{
      return true;
    }
  }
  add=(x)=>{
    var leag = this.state.leag;
    if (leag.indexOf(x) == -1) {
      leag.push(x);
    }else{
      leag.splice(leag.indexOf(x), 1);
    }
    this.setState({leag:leag});
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
           <Text style={styles.privateText}>WHAT LEAGUES DO YOU LIKE?</Text>
         </View>
        <ScrollView style={{marginBottom:0}}>
         
         <View style={styles.mainContent}>
          {this.state.leagues.map((item,i)=> {
            return(
          <View style={styles.row}>
            <View style={styles.centerInfo}>
              <Text style={styles.centerText}>{item.name} </Text>
            </View>
            <View style={styles.righIcon}>
            {!this.checkexist(item.category_id) ?
             <TouchableOpacity onPress={()=> this.add(item.category_id)}>
              <Icon name="star-border" size={30} color="white" />
             </TouchableOpacity>
             :
             <TouchableOpacity onPress={()=> this.add(item.category_id)}>
              <Icon name="star" size={30} color="golden" />
             </TouchableOpacity>
            }
            </View>
          </View>  
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
            <TouchableOpacity onPress={()=>this.nextnow()} style={{flexDirection:'row'}}>
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
  mainContent:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:50,
    marginTop:15,
  },
  row:{
    width:'90%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    marginTop:10,
    flexDirection:'row',
  },
  centerInfo:{
    marginLeft:10,
    width:'80%',
  },
  centerText:{
    marginTop:5,
    color:'white',
    fontWeight:'bold',
    fontSize:15,
  },
  centerText2:{
    color:'white',
    fontSize:12,
  },
  rightIcon:{
    width:'20%',
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