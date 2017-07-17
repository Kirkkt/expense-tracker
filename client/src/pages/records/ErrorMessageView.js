import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorMessageView extends React.Component {

  static propTypes = {
    message: PropTypes.string.isRequired,
  };

  render = () => (
    <div style={{fontSize: 12, color: 'red'}}>
      {this.props.message}
    </div>
  );

};
