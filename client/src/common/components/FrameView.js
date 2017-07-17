import React from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import AppBar from 'material-ui/AppBar';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';

import LoginVerification from '../LoginVerification';
import LogInController from '../LogInController';
import Groups from '../Groups';

import Styles from './FrameStyles.css';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends React.Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
      className: PropTypes.string.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
          className={this.props.className}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

export default class FrameView extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    leftNavigationItemSelected: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
  }

  getUserListItem = () => LogInController.getGroup() === Groups.REGULAR_USER ? <div/> :
    (
      <ListItem
        primaryText="Users"
        value={2}
        onClick={() => browserHistory.push('/Users')}
      />
    );

  render() {
    return (
      <LoginVerification>
        <div className={Styles.wrapper} >
          <AppBar
            title="Expense tracker"
            showMenuIconButton={false}
          >
            <div className={Styles.logOutButtonWrapper}>
              <span className={Styles.userInfo}>{LogInController.getUsername()}</span>
              <span className={Styles.userInfo}>{Groups.groupToString(LogInController.getGroup())}</span>
              <FlatButton
                labelStyle={{color: 'white'}}
                label="Log out"
                onClick={LogInController.logOut}
              />
            </div>
          </AppBar>
          <div className={Styles.leftNavigationListAndContent}>
            <SelectableList
              className={Styles.leftNavigationList}
              defaultValue={this.props.leftNavigationItemSelected}
            >
              <ListItem
                primaryText="Records"
                value={1}
                onClick={() => browserHistory.push('/')}
              />
              {this.getUserListItem()}
              <ListItem
                primaryText="Summary"
                value={3}
                onClick={() => browserHistory.push('/Summary')}
              />
            </SelectableList>
            <div className={Styles.content}>
              {this.props.children}
            </div>
          </div>
        </div>
      </LoginVerification>
    );
  }
}
