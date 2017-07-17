import React from 'react';
import PropTypes from 'prop-types';

import ActionBarController from '../../common/components/ActionBarController';
import ActionButtonView from '../../common/components/ActionButtonView';
import DeleteDialogView from '../../common/components/DeleteDialogView';
import CreateEditDialogView from './CreateEditDialogView';
import FilterButtonView from './FilterButtonView';
import FilterDialogView from './FilterDialogView';

const SHOULD_SHOW_NO_DIALOG = Symbol();
const SHOULD_SHOW_CREATE_DIALOG = Symbol();
const SHOULD_SHOW_EDIT_DIALOG = Symbol();
const SHOULD_SHOW_DELETE_DIALOG = Symbol();
const SHOULD_SHOW_FILTER_DIALOG = Symbol();

export default class ActionBarView extends React.Component {

  static propTypes = {
    reset: PropTypes.func.isRequired,
    selectedData: PropTypes.array.isRequired,
    handleCreate: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleFilter: PropTypes.func.isRequired,
  };

  state = {
    shouldShowDialog: SHOULD_SHOW_NO_DIALOG,
    isFiltering: false,
  };

  handleEdit = recordData => this.props.handleEdit(Object.assign({id: this.props.selectedData[0].id}, recordData));

  render = () => (
    <div>
      <ActionButtonView
        label="New"
        primary={true}
        onClick={() => this.setState({shouldShowDialog: SHOULD_SHOW_CREATE_DIALOG})}
      />
      <ActionButtonView
        label="Edit"
        disabled={ActionBarController.shouldDisableEditButton(this.props)}
        onClick={() => this.setState({shouldShowDialog: SHOULD_SHOW_EDIT_DIALOG})}
      />
      <ActionButtonView
        label="Delete"
        disabled={ActionBarController.shouldDisableDeleteButton(this.props)}
        onClick={() => this.setState({shouldShowDialog: SHOULD_SHOW_DELETE_DIALOG})}
      />
      <FilterButtonView
        onClickFilter={() => this.setState({shouldShowDialog: SHOULD_SHOW_FILTER_DIALOG})}
        onClickReset={() => this.setState({isFiltering: false}, this.props.reset)}
        isFiltering={this.state.isFiltering}
      />
      <CreateEditDialogView
        handleClose={() => this.setState({shouldShowDialog: SHOULD_SHOW_NO_DIALOG})}
        handleConfirm={this.props.handleCreate}
        open={this.state.shouldShowDialog === SHOULD_SHOW_CREATE_DIALOG}
        confirmButtonText="Create"
        titleText="New record"
      />
      <CreateEditDialogView
        handleClose={() => this.setState({shouldShowDialog: SHOULD_SHOW_NO_DIALOG})}
        handleConfirm={this.handleEdit}
        open={this.state.shouldShowDialog === SHOULD_SHOW_EDIT_DIALOG}
        currentRecordData={this.props.selectedData[0]}
        confirmButtonText="Update"
        titleText="Edit record"
      />
      <DeleteDialogView
        handleClose={() => this.setState({shouldShowDialog: SHOULD_SHOW_NO_DIALOG})}
        handleConfirm={() => this.props.handleDelete(this.props.selectedData.map(({id}) => id))}
        open={this.state.shouldShowDialog === SHOULD_SHOW_DELETE_DIALOG}
        count={this.props.selectedData.length}
        titleText="Delete record(s)"
      />
      <FilterDialogView
        handleClose={() => this.setState({shouldShowDialog: SHOULD_SHOW_NO_DIALOG})}
        handleConfirm={filterData => this.setState({isFiltering: true}, () => this.props.handleFilter(filterData))}
        open={this.state.shouldShowDialog === SHOULD_SHOW_FILTER_DIALOG}
      />
    </div>
  );

}
