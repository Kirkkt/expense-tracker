import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import PaginationView from '../../common/components/PaginationView';
import CenterTextView from '../../common/components/CenterTextView';
import Controller from './DataTableController';

export default class DataTableView extends React.Component {

  static propTypes = {
    tableData: PropTypes.array.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
  };

  state = {
  };

  getTableRows = () => this.props.tableData.map(
    (item, rowIndex) => (
      <TableRow key={rowIndex}>
        <TableRowColumn>{item.week}</TableRowColumn>
        <TableRowColumn>{item.dailyAverage}</TableRowColumn>
        <TableRowColumn>{item.total}</TableRowColumn>
      </TableRow>
    )
  );

  renderWithoutContent = () => (
    <CenterTextView text="No records"/>
  );

  renderWithContent = () => (
    <div>
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Week</TableHeaderColumn>
            <TableHeaderColumn>Daily average</TableHeaderColumn>
            <TableHeaderColumn>Total</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} >
          {this.getTableRows()}
        </TableBody>
      </Table>
      <PaginationView
        pageCount={this.props.pageCount}
        pageNumber={this.props.pageNumber}
        onChange={this.props.onPageChange}
      />
    </div>
  );

  render = () => Controller.render(this);

}
