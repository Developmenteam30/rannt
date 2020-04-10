import React, { Component } from 'react';
import { StyleSheet, View, Modal, Text, Button, Platform, Animated } from 'react-native';
import PropTypes from 'prop-types';

class CustomToast extends Component {
   constructor() {
      super();
      this.animateOpacityValue = new Animated.Value(0);
      this.state = { 
        ShowToast: false 
      }
      this.ToastMessage = '';
   }

   componentWillUnmount() {
      this.timerID && clearTimeout(this.timerID);
   }

   ShowToastFunction( message = "Custom React Native Toast", duration = 4000) {
         this.ToastMessage = message;
         this.setState({ ShowToast: true }, () =>
         {
               Animated.timing
               (
                  this.animateOpacityValue,
                  { 
                    toValue: 1,
                    duration: 500
                  }
               ).start(this.HideToastFunction(duration))
         });

   }

   HideToastFunction = (duration) =>
   {
      this.timerID = setTimeout(() =>
      {
            Animated.timing
            (
               this.animateOpacityValue,
               { 
                 toValue: 0,
                 duration: 500
               }
            ).start(() =>
            {
               this.setState({ ShowToast: false });
               clearTimeout(this.timerID);
            })
      }, duration);      
   }

   render() {
      if(this.state.ShowToast) {
         return(
            <Animated.View style = {[ styles.animatedToastView, { opacity: this.animateOpacityValue, top: (this.props.position == 'top') ? '10%' : '80%', backgroundColor: this.props.backgroundColor }]}>
               <Text numberOfLines = { 1 } style = {[ styles.ToastBoxInsideText, { color: this.props.textColor }]}>{ this.ToastMessage }</Text>
            </Animated.View>
        );
      }
      else
      {
         return null;
      }
   }
}
 
export default class Toast extends Component {
      Default_Toast_Bottom_With_Different_Color=()=>
      {
        this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction('Default Toast Bottom Message With Different Color.');
      }

      Default_Toast_Top_With_Different_Color=(jumanjii)=>
      {
        this.refs.defaultToastTopWithDifferentColor.ShowToastFunction(jumanjii);
      }
 
 render() {
   return (
      <View style={styles.MainContainer}>
          <CustomToast ref = "defaultToastBottomWithDifferentColor" backgroundColor='#ff0000' position = "top"/>
          <CustomToast ref = "defaultToastTopWithDifferentColor" backgroundColor='#3a393b' position = "top"/>
      </View>
   );
 }
}

CustomToast.propTypes = {
  backgroundColor: PropTypes.string,
  position: PropTypes.oneOf([
     'top',
     'bottom'
  ]),
  textColor: PropTypes.string
};

CustomToast.defaultProps =
{
  backgroundColor: '#666666',
  textColor: '#fff'
}
 
const styles = StyleSheet.create({
 
MainContainer :{
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,

},
MainContainers :{
   zIndex: 1,
},
animatedToastView:
{
   marginHorizontal: 30,
   paddingHorizontal: 25,
   paddingVertical: 10,
   borderRadius: 25,
   zIndex: 999,
   position: 'absolute',
   justifyContent: 'center'
},

ToastBoxInsideText:
{
   fontSize: 15,
   alignSelf: 'stretch',
   textAlign: 'center'
}
 
});