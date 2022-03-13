import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { View } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import axios from 'axios';
import { serverUri } from '../constants';
import { IDefaultScreenProps } from '../types'

const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
function checkEmailErrors(state : any): any {
  if (!state.login) {
    return { ...state, loginError: 'Email can\'t be empty' }
  }

  if (!emailRegExp.test(state.login)) {
    return { ...state, loginError: 'invalid email' }
  }

  if (state.loginError) {
    return { ...state, loginError: '' }
  }

  return state
}

export default function LoginScreen({ navigation }: IDefaultScreenProps) {
  const [state, setState] = useState({
    login: '',
    loginError: '',
    password: '',    
    passwordError:''
  })

  return (<View style={styles.container}>
    <Text>Login:</Text>
    <Input
      placeholder='Email'
      value={state.login}
      errorMessage={state.loginError}
      onChangeText={(value) => {
        setState(checkEmailErrors({...state, login:value}))
      }}
      leftIcon={{ type: 'font-awesome', name: 'user' }} />
    <Text>Password:</Text>
    <Input
      placeholder='Password'
      secureTextEntry={true}
      onChangeText={(value) => {
        setState({...state, password:value})
      }}
      leftIcon={{ type: 'font-awesome', name: 'key' }}
      errorMessage={state.passwordError} />
    <Button
      onPress={async() => {
        if (state.loginError) return

        try {
          const result = await axios.post(`${serverUri}/login`, state)
          
          if (result.status === 200) {
            setState({...state, passwordError: ''})
            navigation.navigate('Root')
            return
          }
          setState({...state, passwordError: result.data})
        } catch (e: any) {
          // TODO display Error
          console.log(e.response)          
          setState({...state, passwordError: e?.response?.data || e.toString()})
        }
      }}
      icon={
        <Icon tvParallaxProperties={{}} name="sign-in" type="font-awesome" iconStyle={{ marginRight: 10 }}/>
      }
      title="Login"
    />
    <Button
      onPress={() => {
        navigation.navigate('Registration')
      }}
      icon={
        <Icon tvParallaxProperties={{}} name="user-plus" type="font-awesome" iconStyle={{ marginRight: 10 }}/>
      }
      title="Registration"
    />
  </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }  
});


