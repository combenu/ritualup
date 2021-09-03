import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Navigation } from 'react-native-navigation'
import LinearGradient from 'react-native-linear-gradient'
import Button from '../theme/ButtonView'
import { Images } from '../../styles/theme'
import styles from '../../styles/routes/WelcomeViewStyles'

@inject('appState')
@observer
export default class WelcomeView extends Component {
  static options() {
    return {
      _statusBar: {
        backgroundColor: 'transparent',
        style: 'dark',
        drawBehind: true
      }
    }
  }

  render() {
    return (
      <View style={styles.bar}>
        <LinearGradient
          colors={['#fac0fa', '#ffdea6', '#b9ecaf']}
          locations={[0.15, 0.48, 1]}
          style={styles.root}
        >
          <Text style={styles.h1}>RitualUp</Text>
          <Button title='Log in' onPress={this.onClickPush('App.Login')} />
          <Button title='Sign Up' onPress={this.onClickPush('App.Register')} />
        </LinearGradient>
      </View>
    )
  }

  onClickPush = link => async () => {
    await Navigation.push(this.props.componentId, {
      component: {
        name: link,
        options: {
          topBar: {
            visible: true,
            animate: true
          }
        }
      }
    })
  }
}
