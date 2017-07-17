import React from 'react';
import PropTypes from 'prop-types';

import ActionButtonView from '../../common/components/ActionButtonView';
import Styles from './FilterButtonStyles.css';

export default class FilterButtonView extends React.Component {

  static propTypes = {
    isFiltering: PropTypes.bool.isRequired,
    onClickReset: PropTypes.func.isRequired,
    onClickFilter: PropTypes.func.isRequired,
  };

  renderFilterButton = () => (
    <ActionButtonView
      label="Filter"
      primary={true}
      onClick={this.props.onClickFilter}
    />
  );

  renderResetButton = () => (
    <ActionButtonView
      label="Reset"
      secondary={true}
      onClick={this.props.onClickReset}
    />
  );

  render = () => (
    <div className={Styles.buttonWrapper}>
      {this.props.isFiltering ? this.renderResetButton() : this.renderFilterButton()}
    </div>
  );

};
