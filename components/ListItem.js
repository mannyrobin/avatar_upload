import React, { Component } from "react";
import { Animated, Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state={
            animatePress: new Animated.Value(1)
        }
    }

    animateIn() {
        Animated.timing(this.state.animatePress, {
            toValue: 1.3, 
            duration: 200
        }).start()
    }

    animateOut() {
        Animated.timing(this.state.animatePress, {
            toValue: 1, 
            duration: 200
        }).start()
    }

    render() {
        const { itemWidth } = this.props;
        return (
            <TouchableWithoutFeedback
                onPressIn={()=> this.animateIn()}
                onPressOut={()=> this.animateOut()}
            >
                <Animated.Image 
                    style={{
                        margin: 5,
                        width: itemWidth,
                        height: 100,
                        transform: [
                            {
                                scale: this.state.animatePress
                            }
                        ]
                    }}
                    source={this.props.image}
                    resizeMethod={'resize'}
                />
            </TouchableWithoutFeedback>
        )
    }
}