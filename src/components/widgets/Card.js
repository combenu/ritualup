import React, { PureComponent } from 'react';
import { StyleSheet, Animated, View, Text, Dimensions, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import format from 'date-fns/format'

import { Icons } from '../../styles/theme'

// Transition helper method
const transition = (property, toValue, useNativeDriver = true) =>
  Animated.spring(property, { toValue, useNativeDriver });

// Layout animation config for width/height
const config = {
  ...LayoutAnimation.Presets.spring,
  duration: 700,
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.8,
  },
};

// Some static consts that may or may not be props.
const CARD_COLLAPSED_HEIGHT = 412;
const CARD_EXPANDED_HEIGHT = 492;

/**
 * Card component
 * This is a monster and some things need refactoring.
 * @todo Document what's going on.
 * @todo Split view into components.
 * @todo LayoutAnimation sucks.
 */
export default class Card extends PureComponent {

  static propTypes = {
    onOpenChange: PropTypes.func,
    backgroundColor: PropTypes.string,
    title: PropTypes.string,
    time: PropTypes.string,
    imgurl: PropTypes.string,
    children: PropTypes.node,
    top: PropTypes.number,
    left: PropTypes.number,
  }

  static defaultProps = {
    onOpenChange: undefined,
    backgroundColor: undefined,
    title: undefined,
    time: undefined,
    imgurl: undefined,
    children: undefined,
    top: 20,
    left: 0,
  }

  state = {
    isOpen: false,
    host: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  };

  @autobind
  onLayout() {
    if (!this.layout) {
      // TODO: Find out why onLayout doesn't give us any width or height
      // Hardcoded width for now.
      const { width } = Dimensions.get('window');
      this.layout = {
        width: width - 40,
        height: CARD_COLLAPSED_HEIGHT,
      };

      // Bug in React Native causes a scrollview to not
      // begin in it's Y position if contentInset.top is set.
      this.scrollRef._component.scrollTo({ // eslint-disable-line no-underscore-dangle
        y: -CARD_EXPANDED_HEIGHT,
        animated: false,
      });
    }
  }

  @autobind
  onPressIn() {
    if (this.state.isOpen) {
      return;
    }

    // Measure position of card in window
    this.hostRef.measureInWindow((x, y) => { // eslint-disable-line no-underscore-dangle
      const { width, height } = Dimensions.get('window');
      console.log('x:%d, y:%d, width:%d, height:%d', x, y, width, height)
      this.setState({
        host: {
          x, y, width, height,
        },
      });
    });

    // Show a little bouncy animation
    transition(this.scale, 0.95).start();
  }

  @autobind
  onPressOut() {
    // Go back to original
    transition(this.scale, 1).start();
  }

  @autobind
  onPress() {
    // Extract properties from state
    const isOpen = !this.state.isOpen;
    // Configure next width/height layout animation
    LayoutAnimation.configureNext(config);
    // Update isOpen state
    this.setState({ isOpen });
    // Start main animation
    transition(this.cursorNative, Number(isOpen)).start();
    // Start border radius animation (Can't animate borderRadius on native driver)
    transition(this.borderRadius, isOpen ? 0 : 16, false).start();
    if (!isOpen) {
      // Scroll card to top
      this.scrollRef._component.scrollTo({ // eslint-disable-line no-underscore-dangle
        y: -CARD_EXPANDED_HEIGHT,
        animated: true,
      });
    }
    // Call onOpenChange function
    this.props.onOpenChange(this.props, isOpen);
  }

  // Animation values
  cursorNative = new Animated.Value(0);
  borderRadius = new Animated.Value(16);
  scrollY = new Animated.Value(0);
  scale = new Animated.Value(1);

  render() {
    // Extract needed properties from the class
    const {
      cursorNative,
      scale,
      state,
      layout,
    } = this;

    const {
      backgroundColor,
      // title,
      // time,
      children,
      top,
      left,
      // imgurl,
      artwork,
      date: {
        year,
        month,
        day,
        hour,
        minute,
        second,
      },
      aspect,
      planet1,
      planet2,
    } = this.props;

    const {
      isOpen,
      host,
    } = state;

    const animated = {
      host: {
        transform: [{
          translateY: cursorNative.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -host.y],
          }),
        }, {
          translateX: cursorNative.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -host.x],
          }),
        }, {
          scale,
        }],
      },

      card: {
        overflow: 'hidden',
        transform: [{
          translateY: this.scrollY.interpolate({
            inputRange: [-CARD_EXPANDED_HEIGHT, 0],
            outputRange: [0, -CARD_EXPANDED_HEIGHT],
            extrapolate: 'clamp',
          }),
        }],
      },

      image: {
        height: CARD_COLLAPSED_HEIGHT,
        borderRadius: this.borderRadius,
      },

      close: {
        opacity: cursorNative,
      },

      close__light: {
        opacity: 0.6,
      },

      close__dark: {
        opacity: this.scrollY.interpolate({
          inputRange: [-40, -30],
          outputRange: [0, 0.8],
          extrapolateRight: 'clamp',
        }),
      },

      content: {
        transform: [{
          translateY: cursorNative.interpolate({
            inputRange: [0, 1],
            outputRange: [-CARD_COLLAPSED_HEIGHT, 0],
          }),
        }, {
          scale: cursorNative.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        }],
      },

      content__offset: {
        transform: [{
          translateY: cursorNative.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.max(0, top - 20)],
          }),
        }, {
          translateX: cursorNative.interpolate({
            inputRange: [0, 1],
            outputRange: [0, left],
          }),
        }],
      },
    };

    if (layout) {
      // Wait until layout is calculated to set these dimensions
      animated.host.width = !isOpen ? layout.width : host.width;
      animated.host.height = !isOpen ? layout.height : host.height;
      animated.image.height = !isOpen ? CARD_COLLAPSED_HEIGHT : CARD_EXPANDED_HEIGHT;
    }

    // Toggle opacity of content view
    const opacity = layout ? 1 : 0;

    const displayTime = format(new Date(year, month, day, hour, minute, second), 'h:mm a');
    const title = aspect + ' ' + planet1 + '\n' + planet2;

    return (
      <View
        style={[styles.root]}
        ref={(ref) => { this.hostRef = ref; }}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.host, animated.host]}
        >
          <Animated.ScrollView
            ref={(ref) => { this.scrollRef = ref; }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
              { useNativeDriver: true },
            )}
            contentInset={{ top: CARD_EXPANDED_HEIGHT }}
            scrollEventThrottle={16}
            scrollEnabled={this.state.isOpen}
            style={[StyleSheet.absoluteFill, { opacity }]}
          >
            <Animated.View style={[styles.content, animated.content]}>
              {React.Children.map(children, child => React.cloneElement(child, {
                style: styles.content__text,
              }))}
            </Animated.View>
          </Animated.ScrollView>
          <TouchableWithoutFeedback
            onPressIn={this.onPressIn}
            onPressOut={this.onPressOut}
            onPress={this.onPress}
            style={StyleSheet.absoluteFill}
          >
            <View pointerEvents={isOpen ? 'box-none' : 'auto'}>
              <Animated.View style={[styles.card, animated.card]} pointerEvents="none">
              <Animated.Image
                  source={{ uri: artwork }}
                  resizeMode="cover"
                  style={[styles.image, { backgroundColor }, animated.image]}
                  onLayout={this.onLayout}
                />
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    styles.image__content,
                    isOpen && styles.image__content__open,
                  ]}
                >
                  <Animated.View style={animated.content__offset}>
                    {!isOpen && (
                      <Text style={[styles.legend]}>
                        {displayTime}
                      </Text>
                    )}
                    <Text style={[styles.title, isOpen && styles.dark]}>
                      {isOpen ? title.toLocaleUpperCase() : title}
                    </Text>
                  </Animated.View>
                </View>
              </Animated.View>
              <TouchableWithoutFeedback onPress={this.onPress} pointerEvents="auto">
                <Animated.View style={[styles.close, animated.close]}>
                  <Animated.Image
                    source={Icons.close}
                    style={[StyleSheet.absoluteFill, animated.close__light]}
                  />
                  <Animated.Image
                    source={Icons.closeBlack}
                    style={[StyleSheet.absoluteFill, animated.close__dark]}
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  root: {
    height: CARD_COLLAPSED_HEIGHT,
    marginBottom: 30,
  },

  flex: {
    flex: 1,
  },

  host: {
    position: 'absolute',
    height: CARD_COLLAPSED_HEIGHT,
    marginBottom: 30,

    borderRadius: 16,

    shadowOffset: { width: 0, height: 10 },
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOpacity: 0.25,
  },

  content: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  content__text: {
    fontFamily: 'SFProText-Regular',
    fontSize: 19,
    color: '#000000',
    letterSpacing: -0.49,
    marginBottom: 20,
  },

  close: {
    position: 'absolute',
    top: 20,
    right: 20,

    width: 30,
    height: 30,

    opacity: 0.6,
  },

  image: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: CARD_COLLAPSED_HEIGHT,
  },

  image__content: {
    padding: 20,
    paddingTop: 25,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },

  image__content__open: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  legend: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: -0.24,
    lineHeight: 22,
    backgroundColor: 'transparent',
    opacity: 0.8,
    marginBottom: 3,
  },

  title: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: 0.34,
    lineHeight: 34,
    maxWidth: 240,
    backgroundColor: 'transparent',
  },

  dark: {
    fontFamily: 'SFProDisplay-Heavy',
    fontSize: 48,
    lineHeight: 46,
    marginTop: 32,
    color: '#000000',
  },
});
