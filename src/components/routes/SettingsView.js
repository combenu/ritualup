import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import { inject, observer } from 'mobx-react'
import LinearGradient from 'react-native-linear-gradient'

import { goToAuth } from '../../Screens'
import styles from '../../styles/routes/SettingsViewStyles'

@inject('appState')
@inject('user')
@observer
export default class SettingsView extends Component {
  static options() {
    return {
      _statusBar: {
        backgroundColor: 'transparent',
        style: 'dark',
        drawBehind: true
      },
      topBar: {
        visible: false
      }
    }
  }

  state = {
    loading: false
  }

  onLogout = () => {
    this.setState({ loading: true })
    this.props.user.logout().then(() => {
      this.setState({ loading: false })
      Navigation.pop(this.props.componentId)
      goToAuth()
    })
  }

  render() {
    return (
      <View style={styles.bar}>
        <Text style={styles.footer}>Coming soon!</Text>
        <Button title='Logout' onPress={this.onLogout} loading={this.state.loading} />
      </View>
    )
  }
}
