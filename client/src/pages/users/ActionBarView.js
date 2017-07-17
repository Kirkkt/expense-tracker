import React from 'react';
import PropTypes from 'prop-types';

import ActionBarController from '../../common/components/ActionBarController';
import ActionButtonView from '../../common/components/ActionButtonView';
import DeleteDialogView from '../../common/components/DeleteDialogView';
import DateAndTime from '../../common/DateAndTime';

import CreateDialogView from './CreateDialogView';
import EditDialogView from './EditDialogView';

const SHOULD_SHOW_NO_DIALOG = Symbol();
const SHOULD_SHOW_CREATE_DIALOG = Symbol();
const SHOULD_SHOW_EDIT_DIALOG = Symbol();
const SHOULD_SHOW_DELETE_DIALOG = Symbol();

export default class ActionBarView extends React.Component {

  static propTypes = {
    reset: PropTypes.func.isRequired,
    selectedData: PropTypes.array.isRequired,
    handleCreate: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
  };

  state = {
    shouldShowDialog: SHOULD_SHOW_NO_DIALOG,
  };

  handleEdit = userData => {
    const selectedData = this.props.selectedData || [];
    this.props.handleEdit(
      Object.assign(
        {
          usernameOriginal: selectedData[0] && selectedData[0].username
        },
        userData
      )
    );
  };

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
      <CreateDialogView
        handleClose={() => this.setState({shouldShowDialog: SHOULD_SHOW_NO_DIALOG})}
        handleConfirm={this.props.handleCreate}
        open={this.state.shouldShowDialog === SHOULD_SHOW_CREATE_DIALOG}
        confirmButtonText="Create"
        titleText="New user"
      />
      <EditDialogView
        handleClose={() => this.setState({shouldShowDialog: SHOULD_SHOW_NO_DIALOG})}
        handleConfirm={this.handleEdit}
        open={this.state.shouldShowDialog === SHOULD_SHOW_EDIT_DIALOG}
        currentUserData={this.props.selectedData[0]}
        confirmButtonText="Update"
        titleText="Edit user"
      />
      <DeleteDialogView
        handleClose={() => this.setState({shouldShowDialog: SHOULD_SHOW_NO_DIALOG})}
        handleConfirm={() => this.props.handleDelete(this.props.selectedData.map(({username}) => username))}
        open={this.state.shouldShowDialog === SHOULD_SHOW_DELETE_DIALOG}
        count={this.props.selectedData.length}
        titleText="Delete user(s)"
      />
    </div>
  );

}
