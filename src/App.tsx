import React, { useState } from "react";
import {
  PickerProps,
  PickerItemProps,
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState
} from "react-native";
import logo from "./logo.svg";
import "./App.css";

class PickerDialogItem extends React.Component<PickerItemProps> {
  render() {
    return <Animated.Text>{this.props.label}</Animated.Text>;
  }
}

class PickerDialog extends React.Component<
  PickerProps,
  { selectedIdx: number }
> {
  state = {
    selectedIdx: 0
  };
  _panX = new Animated.Value(0);
  _panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now
    },
    onPanResponderMove: Animated.event(
      [
        null, // raw event arg ignored
        { dx: this._panX }
      ], // gestureState arg
      {
        listener: (
          event: GestureResponderEvent
          // gestureState: PanResponderGestureState
        ) => console.log(event)
      } // Optional async listener
    ),
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    }
  });

  componentWillMount() {
    React.Children.forEach<any>(this.props.children, (child, index) => {
      if (child.props.value.includes(this.props.selectedValue)) {
        this.setState({
          selectedIdx: index
        });
      }
    });
  }

  static Item = PickerDialogItem;

  render() {
    return (
      <View style={styles.container}>
        {React.Children.toArray(this.props.children).map((item, idx) => {
          return <View key={idx}>{item}</View>;
        })}
      </View>
    );
  }
}

const App = () => {
  const [value, setValue] = useState("js");
  return (
    <PickerDialog
      selectedValue={value}
      onValueChange={setValue}
      itemStyle={styles.itemContainer}
    >
      <PickerDialog.Item label="Java" value="java" />
      <PickerDialog.Item label="JavaScript" value="js" />
    </PickerDialog>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 100,
    borderWidth: 1,
    paddingTop: 20
  },
  itemContainer: {
    backgroundColor: "#888888"
  }
});

export default App;
