import React, { Component } from 'react'
import { Alert, Text, View, TouchableOpacity } from 'react-native'
import { Agenda } from 'react-native-calendars'
import { inject, observer } from 'mobx-react'

import styles from '../../styles/routes/ToolsViewStyles'

@observer
export default class ToolsView extends Component {
  static options() {
    return {
      _statusBar: {
        backgroundColor: 'transparent',
        style: 'dark',
        drawBehind: true
      },
      topBar: {
        visible: false,
        drawBehind: true
      }
    }
  }

  state = {
    items: {}
  }

  loadItems(day) {
    setTimeout(() => {
      let tmpItems = {}
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!tmpItems[strTime]) {
          tmpItems[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            tmpItems[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(tmpItems).forEach(key => {newItems[key] = tmpItems[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <TouchableOpacity 
        style={[styles.item, {height: item.height}]} 
        onPress={() => Alert.alert(item.name)}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate} />
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  render() {
    return (
      <View style={styles.container}>
        <Agenda
          // The list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key kas to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={this.state.items}
          // Callback that gets called when items for a certain month should be loaded (month became visible)
          loadItemsForMonth={this.loadItems.bind(this)}
          // Initially selected day
          selected={'2020-01-16'}
          // Specify how each item should be rendered in agenda
          renderItem={this.renderItem.bind(this)}
          // Specify your item comparison function for increased performance
          rowHasChanged={this.rowHasChanged.bind(this)}
          style={{flex:1}}
        />
      </View>
    )
  }
}
