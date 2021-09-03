import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import styles from '../../styles/routes/LoginViewStyles'
import {inject, observer} from 'mobx-react'
import SignupSubView from '../theme/SignupSubView'
import { Navigation } from 'react-native-navigation'

@inject ('user')
@observer
export default class Register extends Component {
  static options() {
    return {
      topBar: {
        title: {
          text: 'Create new account',
        },
      }
    };
  }

  constructor() {
    super();
    this.state = {
      loading: false,
    }
  }

  onSubmit = (email, password) => {
    if (!email || !password) {
      Alert.alert('Enter valid email and password.')
      return
    }
    this.setState({ loading: true })
    this.props.user.register(email, password).then(() => {
      this.setState({ loading: false })
      Navigation.pop(this.props.componentId)
    })
  }
  
  render() {
    return (
      <View style={styles.container}>
        <SignupSubView onSubmit={this.onSubmit} loading={this.state.loading}/>
	    </View>
    );
  }
}