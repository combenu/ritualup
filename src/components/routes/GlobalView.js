import React, { Component } from 'react'
import { StyleSheet, SectionList, SafeAreaView, StatusBar, Animated, Image, Text, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import PropTypes from 'prop-types';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import { autobind } from 'core-decorators';
import { inject, observer } from 'mobx-react'
import SectionHeader from '../widgets/SectionHeader';
import Card from '../widgets/Card';
import RenderCell from '../widgets/RenderCell';
import styles from '../../styles/routes/HomeViewStyles'
import eventData from '../../utils/events';

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

Date.prototype.minDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
}

@inject('appState')
@inject('events')
@observer
export default class GlobalView extends Component {
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
    isScrollEnabled: true,
    top: 20,
    left: 0,
    bottom: 200,
    activeCardId: null,
    events: [],
  }

  componentDidMount() {
    //this.state.events = this.makeEvents(this.props);
    const today = new Date();
    const dayDiff = 6;
    const data = {
      ts: today.minDays(dayDiff).toISOString().split("T")[0],
      te: today.addDays(dayDiff).toISOString().split("T")[0]
    }
    this.props.events.loadGlobalEvents(data, (resp) => {
      console.log('[Global events]: ', resp)
      this.state.events = this.makeEvents(resp)
    })
  }

  @autobind
  onCardOpenChange(item, isOpen) {
    this.setState({
      // Disable scroll to be extra safe if JS thread hangs.
      isScrollEnabled: !isOpen,
    });

    // AppStore hides the status bar and bottom tabs.
    StatusBar.setHidden(isOpen, 'slide');
    // this.props.navigator.toggleTabs({ to: isOpen ? 'hidden' : 'shown', animated: true });
    Navigation.mergeOptions(this.props.componentId, {
      bottomTabs: {
        visible: !isOpen,
        animate: true
      }
    });
    // Remove Safe area
    Animated.timing(this.top, { toValue: isOpen ? -this.state.top : 0, duration: 330 }).start();
    this.setState({
      activeCardId: item.id,
    });
  }

  @autobind
  onLayout(e) {
    const { layout } = e.nativeEvent;
    console.log('layout: ', layout);
    this.setState({
      top: layout.y,
      left: layout.x,
    });
  }

  groupEventsByDay(event) {
    //event.id = event.time;
    // return new Date(event.time).toISOString().substr(0, 10);
    return new Date(event.eventTime).toISOString().substr(0, 10);
  }

  keyExtractor(item) {
    // return item.id;
    return item.d
  }

  makeEvents(data) {
    // let events = get(eventData, 'allEvents', []);
    // events[0].time = format(new Date(), 'MM/dd/yyyy h:mm a');
    // const days = groupBy(events, this.groupEventsByDay);
    // return Object.entries(days).map(([time, data]) => ({
    //   data,
    //   time: new Date(time),
    // }));
    const days = groupBy(data, this.groupEventsByDay)
    return Object.entries(days).map(([time, data]) => ({
      data,
      time: new Date(time),
    }))
  }

  top = new Animated.Value(0);

  @autobind
  renderItem({ item, index }) {
    const { top, left } = this.state;
    const backgroundColor = index % 2 === 0 ? '#F79E02' : '#4478e9';
    return (
      <Card
        {...item}
        backgroundColor={backgroundColor}
        onOpenChange={this.onCardOpenChange}
        onAppPress={this.onAppPress}
        onAppPressIn={this.onAppPressIn}
        top={top}
        left={left}
      >
        <Text>{item.description}</Text>
      </Card>
    );
  }

  renderSectionHeader({ section }) {
    if (isToday(section.time)) {
      return (
        <SectionHeader
          title="Today"
          label={format(section.time, 'EEEE, MMMM d')}
        />
      );
    }

    return (
      <SectionHeader
        title={format(section.time, 'EEEE')}
        label={format(section.time, 'MMMM d')}
      />
    );
  }

  render() {
    const {
      events,
      top,
      bottom,
      isScrollEnabled,
      activeCardId,
    } = this.state;

    return (
      <View style={styles.flex} testID="GLOBAL_HOST_VIEW">
        <SafeAreaView style={StyleSheet.absoluteFill}>
          <View onLayout={this.onLayout} />
        </SafeAreaView>

        <SectionList
          style={styles.host}
          scrollEnabled={isScrollEnabled}
          contentContainerStyle={[styles.content, { paddingTop: top, paddingBottom: bottom }]}
          sections={events}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          keyExtractor={this.keyExtractor}
          stickySectionHeadersEnabled={false}
          extraData={this.state}
          CellRendererComponent={RenderCell}
          activeCardId={activeCardId}
        />

        <Animated.View
          style={[styles.top, { height: top, transform: [{ translateY: this.top }] }]}
          pointerEvents="none"
        />
      </View>
    );
  }
}
