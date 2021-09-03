import React, { Component } from 'react'
import { View, Alert } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { inject, observer } from 'mobx-react'

import { goToHome } from '../../Screens'
import styles from '../../styles/routes/LoginViewStyles'
import LoginSubView from '../theme/LoginSubView'

@inject('user')
@observer
export default class LoginView extends Component {
  static options() {
    return {
      topBar: {
        title: {
          text: 'Sign In'
        }
      }
    }
  }

  constructor() {
    super()
    this.state = {
      loading: false
    }
  }

  onSubmit = (email, password) => {
    if (!email || !password) {
      Alert.alert('Enter valid email and password.')
      return
    }
    this.setState({ loading: true })
    this.props.user.login(email, password).then((resp) => {
      this.setState({ loading: false })
      if (resp) {
        Navigation.pop(this.props.componentId)
        goToHome()
      }
    })
  }

  onLoginWithGoogle = () => {
    this.setState({ loading: true })
    this.props.user.loginWithGoogle().then((resp) => {
      this.setState({ loading: false })
      if (resp) {
        Navigation.pop(this.props.componentId)
        goToHome()
      }
    })
  }

  onLoginWithFacebook = () => {
    this.setState({ loading: true })
    this.props.user.loginWithFacebook().then((resp) => {
      this.setState({ loading: false })
      if (resp) {
        Navigation.pop(this.props.componentId)
        goToHome()
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginSubView
          onSubmit={this.onSubmit}
          onLoginWithGoogle={this.onLoginWithGoogle}
          onLoginWithFacebook={this.onLoginWithFacebook}
          loading={this.state.loading} />
      </View>
    )
  }
}
