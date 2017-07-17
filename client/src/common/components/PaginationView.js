import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'material-ui-pagination';

import Styles from './PaginationStyles.css';

const PAGINATION_DISPLAY = 5;

export default class PaginationView extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
  };

  render = () => (
    <div className={Styles.pagination} >
      <Pagination
        total={this.props.pageCount}
        current={this.props.pageNumber}
        display={PAGINATION_DISPLAY}
        onChange={this.props.onChange}
      />
    </div>
  );
};
