import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { View } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import axios from 'axios';
import { serverUri } from '../constants';
import { IDefaultScreenProps } from '../types'

function checkPasswordErrors(state : any): any {
  if (state.password1 !== state.password2) {
    return { ...state, passwordError: 'Different password' }
  }

  if (!state.password1) {
    return { ...state, passwordError: 'Password can\'t be empty' }
  }

  if (state.passwordError) {
    return { ...state, passwordError: '' }
  }

  return state
}

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

export default function RegistrationScreen({ navigation }: IDefaultScreenProps) {
  const [state, setState] = useState({
    login: '',
    loginError: '',
    password1: '',
    password2: '',
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
        setState(checkPasswordErrors({...state, password1:value}))
      }}
      leftIcon={{ type: 'font-awesome', name: 'key' }} />
    <Input
      placeholder='Confirm password'
      secureTextEntry={true}
      onChangeText={(value) => {
        setState(checkPasswordErrors({...state, password2:value}))
      }}
      errorMessage={state.passwordError}
      leftIcon={{ type: 'font-awesome', name: 'key' }} />
    <Button
      onPress={async () => {
        let nstate = checkPasswordErrors(state)
        nstate = checkEmailErrors(nstate)
        
        if (nstate.loginError || nstate.passwordError) {
          setState(nstate)
          return
        }
        try {
          const result = await axios.post(`${serverUri}/register`, {
            login: state.login,
            password: state.password1
          })

          if (result.status === 200) {
            navigation.navigate('Login')
            return
          }
        } catch (e: any) {
          // TODO display Error
          setState({...state, passwordError: e?.response?.data || e.toString()})
        }
      }}
      icon={
        <Icon tvParallaxProperties={{}} name="user-plus" type="font-awesome" iconStyle={{ marginRight: 10 }}/>
      }
      title="Register"
    />
    <Button
      onPress={() => {
        navigation.navigate('Login')
      }}
      icon={
        <Icon tvParallaxProperties={{}} name="sign-in" type="font-awesome" iconStyle={{ marginRight: 10 }}/>
      }
      title="return to login"
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


