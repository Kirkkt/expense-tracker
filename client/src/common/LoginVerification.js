import React from 'react';
import PropTypes from 'prop-types';

import Controller from './LogInController';

export default class LogInVerification extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    Controller.navigateToLogInPageIfNecessary();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

