import React from 'react'
import PropTypes from 'prop-types'
import {throwError} from '../../utils'

class Container extends React.Component {
  getChildContext () {
    const {controller} = this.props
    if (!controller) {
      throwError('You are not passing controller to Container')
    }

    return {
      controller: controller
    }
  }
  render () {
    return this.props.children
  }
}

Container.propTypes = {
  controller: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
}
Container.childContextTypes = {
  controller: PropTypes.object.isRequired
}

export default Container
