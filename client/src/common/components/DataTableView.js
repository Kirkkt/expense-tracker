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

import CenterTextView from './CenterTextView';
import PaginationView from './PaginationView';

import Controller from './DataTableController';
import Styles from './DataTableStyles.css';

export default class DataTableView extends React.Component {

  static propTypes = {
    shouldClearDataTable: PropTypes.bool.isRequired,
    handleRowSelection: PropTypes.func.isRequired,
    tableData: PropTypes.array.isRequired,
    headerColumnTitles: PropTypes.array.isRequired,
    bodyColumnRenderers: PropTypes.array.isRequired,
    bodyColumnsShouldAddTooltip: PropTypes.array.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
  };

  state = {
    selected: [],
  };

  componentWillReceiveProps = (props) => {
    if (props.shouldClearDataTable) {
      this.setState({selected: []});
    }
  };

  handleRowSelection = (selectedRows) => {
    this.setState({
      selected: selectedRows,
    });
    this.props.handleRowSelection(Controller.convertSelectedRowsToArray(
      selectedRows,
      this.props.tableData.length
    ));
  };

  addTooltip = content => <span className={Styles.tooltip}>{content}</span>;

  getTableRows = () => this.props.tableData.map(
    (item, rowIndex) => (
      <TableRow selected={Controller.isSelected(this.state, rowIndex)} key={rowIndex}>
        {this.props.bodyColumnRenderers.map((renderer, columnIndex) => (
          <TableRowColumn key={columnIndex}>
            {Controller.addTooltipIfNecessary(this, columnIndex, renderer(item))}
          </TableRowColumn>
        ))}
      </TableRow>
    )
  );

  getHeaderColumns = () => this.props.headerColumnTitles.map((title, index) => (
    <TableHeaderColumn key={index}>{title}</TableHeaderColumn>
  ));

  renderWithoutContent = () => (
    <CenterTextView text="No records, please create some"/>
  );

  renderWithContent = () => (
    <div>
      <Table
        multiSelectable={true}
        onRowSelection={this.handleRowSelection}
      >
        <TableHeader displaySelectAll={false} >
          <TableRow>
            {this.getHeaderColumns()}
          </TableRow>
        </TableHeader>
        <TableBody deselectOnClickaway={false} >
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
