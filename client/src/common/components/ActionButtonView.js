import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import Styles from './ActionButtonStyles.css';

export default class ActionButtonView extends React.Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  render = () => (
    <RaisedButton
      disabled={!!this.props.disabled}
      label={this.props.label}
      primary={!!this.props.primary}
      secondary={!!this.props.secondary}
      className={Styles.actionButton}
      onClick={this.props.onClick}
    />
  );
};
