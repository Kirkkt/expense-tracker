import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import CenterTextView from './CenterTextView';

export default class DeleteDialogView extends React.Component {

  static propTypes = {
    count: PropTypes.number.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    titleText: PropTypes.string.isRequired,
  };

  getCancel = () => (
    <FlatButton
      label="Cancel"
      onTouchTap={() => {
        this.props.handleClose();
      }}
    />
  );

  getConfirm = () => (
    <FlatButton
      label="Delete"
      primary={true}
      onTouchTap={() => {
        this.props.handleConfirm();
        this.props.handleClose();
      }}
    />
  );

  render = () => (
    <Dialog
      title={this.props.titleText}
      actions={[this.getCancel(), this.getConfirm()]}
      modal={true}
      open={this.props.open}
      onRequestClose={this.props.handleClose}
    >
      <CenterTextView text={'Delete these ' + this.props.count + ' item(s)?'} />
    </Dialog>
  );

};

