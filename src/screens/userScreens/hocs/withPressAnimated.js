import React, { useRef } from 'react'
import {
  View as AnimatableView,
  initializeRegistryWithDefinitions
} from 'react-native-animatable'
import { throttle } from 'lodash'
import { ANIMATIONS } from '../animations'

export default function (WrappedComponent) {
  return ({ onPress, delay = 800, duration = 1000, animation = ANIMATIONS.ZOOM_IN_OUT, ...rest }) => {
    const compEl = useRef(null)
    const onPressAnimatedDelayed = throttle((event) => {
      console.log('TESTING ONPRESS')
      onPress && onPress(event)
      compEl.current.animate(animation, duration)
    }, delay, { 'trailing': false })

    return (
      <AnimatableView ref={compEl}>
        <WrappedComponent
          onPress={onPressAnimatedDelayed}
          {...rest}
        />
      </AnimatableView>
    )
  }
}
