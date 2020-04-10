import React, { Component } from 'react';
import {SafeAreaView,StyleSheet,ScrollView,View,Text,StatusBar} from 'react-native';
import {Header,LearnMoreLinks,Colors,DebugInstructions,ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MainScreen from './component/MainScreen';
import Login from './component/Login';
import SignUp from './component/SignUp';
import SignUp1 from './component/SignUp1';
import SignUp2 from './component/SignUp2';
import SignUp3 from './component/SignUp3';
import Reset from './component/Reset';
import ResetCode from './component/ResetCode';
import Home from './component/Home';
import Comment from './component/Comment';
import Likes from './component/Likes';
import Profile from './component/Profile';
import EditProfile from './component/EditProfile';
import following from './component/following';
import Notification from './component/Notification';
import Search from './component/Search';
import Privacy from './component/Privacy';
import Otherprofile from './component/Otherprofile';
import Post from './component/Post';
import PostVideo from './component/PostVideo';
import Report from './component/Report';
import Leagues from './component/Leagues';
import Hashtags from './component/Hashtags';
import RepostVideo from './component/RepostVideo';
import Favorite from './component/Favorite';
global.pageName = {};
global.baseurl = 'https://www.break2ru.com/rannt_api/';
global.userdata = {};//{"email": "9874", "name": "9874", "response": "true", "token": "9cb9247b322b2ea553008eff88de0e66", "user_id": "6", "push_notification": "1", "privacy": "1"};

console.disableYellowBox = true;

const MainNavigator = createStackNavigator(
  {
    MainScreen: {screen: MainScreen},
    Login: {screen: Login},
    SignUp: {screen: SignUp},
    SignUp1: {screen: SignUp1},
    SignUp2: {screen: SignUp2},
    SignUp3: {screen: SignUp3},
    Reset: {screen: Reset},
    ResetCode: {screen: ResetCode},
    Home: {screen: Home},
    Comment: {screen: Comment},
    Likes: {screen: Likes},
    Profile: {screen: Profile},
    EditProfile: {screen: EditProfile},
    Notification: {screen: Notification},
    Following: {screen: following},
    Search: {screen: Search},
    Privacy: {screen: Privacy},
    Otherprofile: {screen: Otherprofile},
    Post: {screen: Post},
    PostVideo: {screen: PostVideo},
    Report: {screen: Report},
    Leagues: {screen: Leagues},
    Hashtags: {screen: Hashtags},
    RepostVideo: {screen: RepostVideo},
    Favorite: {screen: Favorite},
  },
  {
    initialRouteName: 'MainScreen',
    unmountInactiveRoutes: true,
  }
);

const App = createAppContainer(MainNavigator);
export default App;
