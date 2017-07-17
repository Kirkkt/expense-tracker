import React from 'react';
import PropTypes from 'prop-types';

export default class CenterTextView extends React.Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  render = () => (
    <div style={{fontSize: 18, margin: 30, textAlign: 'center'}}>
      {this.props.text}
    </div>
  );

};
