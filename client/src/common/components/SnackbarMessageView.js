import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

import Config from '../Config';

export default class SnackbarMessageView extends React.Component {

  static propTypes = {
    message: PropTypes.string,
    onExpire: PropTypes.func.isRequired,
  };

  render = () => (
    <Snackbar
      open={!!this.props.message}
      message={this.props.message}
      autoHideDuration={Config.SNACKBAR_DURATION}
      onRequestClose={this.props.onExpire}
    />
  );

};
