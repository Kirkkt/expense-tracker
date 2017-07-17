import React from 'react';

import Config from '../../common/Config';
import Groups from '../../common/Groups';
import DateAndTime from '../../common/DateAndTime';
import DataTableView from '../../common/components/DataTableView';
import SnackbarMessageView from '../../common/components/SnackbarMessageView';
import FrameView from '../../common/components/FrameView';
import LogInController from '../../common/LogInController';

import Styles from './PageStyles.css';
import ActionBarView from './ActionBarView';

export default class PageView extends React.Component {

  constructor(props) {
    super(props);
    this.state = Object.assign(
      {snackbarMessage: ''},
      this.getDefaultState()
    );
    this.queryUsersData();
  };

  getDefaultState = () => {
    return {
      rowIndicesSelected: [],
      usersData: [],
      shouldClearDataTable: false,
      pageNumber: 1,
      pageCount: 0,
    };
  };


  queryUsersData = () => {
    fetch(Config.API_URL_PREFIX + 'GetUsers', {
      method: 'POST',
      body: 'token=' + LogInController.getToken() +
        '&pageNumber=' + this.state.pageNumber +
        '&pageSize=' + Config.PAGE_SIZE,
    })
    .then(response => response.json())
      .then(({success, error, users, pageCount}) => {
        if (success) {
          this.setState({
            usersData: users.map(user => {
              user.group = Number.parseInt(user.group);
              return user;
            }),
            pageCount,
            shouldClearDataTable: true,
          }, () => {
            if (this.state.usersData.length === 0 && this.state.pageNumber > 1) {
              this.setState({
                shouldClearDataTable: false,
                pageNumber: this.state.pageNumber - 1
              }, this.queryUsersData);
            } else {
              this.setState({shouldClearDataTable: false});
            }
          });
        } else {
          this.setState({snackbarMessage: error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  handleCreate = ({username, password, group}) => {
    const body = 'username=' + username +
      '&password=' + password +
      '&group=' + group;
    fetch(Config.API_URL_PREFIX + 'CreateAccount', {
      method: 'POST',
      body,
    })
    .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          this.setState({rowIndicesSelected: []}, this.queryUsersData);
        } else {
          this.setState({snackbarMessage: responseJson.error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  handleEdit = ({usernameOriginal, username, password, group}, apiName) => {
    const body = 'usernameOriginal=' + usernameOriginal +
      '&username=' + username +
      (password ? ('&password=' + password) : '') +
      '&group=' + group +
      '&token=' + LogInController.getToken();
    fetch(Config.API_URL_PREFIX + 'UpdateUser', {
      method: 'POST',
      body,
    })
    .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          if (usernameOriginal === LogInController.getUsername()) {
            LogInController.logOut();
          }
          this.setState({rowIndicesSelected: []}, this.queryUsersData);
        } else {
          this.setState({snackbarMessage: responseJson.error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  handleDelete = usernames => {
    const body = 'usernames=' + JSON.stringify(usernames) +
      '&token=' + LogInController.getToken();
    fetch(Config.API_URL_PREFIX + 'DeleteUsers', {
      method: 'POST',
      body,
    })
    .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          this.setState({rowIndicesSelected: []}, this.queryUsersData);
        } else {
          this.setState({snackbarMessage: responseJson.error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  render = () => {
    return (
      <FrameView leftNavigationItemSelected={2} >
        <div className={Styles.mainContentWraper}>
          <ActionBarView
            selectedData={this.state.rowIndicesSelected.map(indexSelected => this.state.usersData[indexSelected])}
            handleCreate={this.handleCreate}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            reset={() => this.setState(this.getDefaultState(), this.queryUsersData)}
          />
          <DataTableView
            tableData={this.state.usersData}
            handleRowSelection={rowIndicesSelected => this.setState({rowIndicesSelected})}
            shouldClearDataTable={this.state.shouldClearDataTable}
            headerColumnTitles={[
              'Username',
              'Group',
            ]}
            bodyColumnsShouldAddTooltip={[
              false,
              false,
            ]}
            bodyColumnRenderers={[
              ({username}) => username,
              ({group}) => Groups.groupToString(group),
            ]}
            pageNumber={this.state.pageNumber}
            pageCount={this.state.pageCount}
            onPageChange={pageNumber => this.setState({pageNumber}, this.queryUsersData)}
          />
        </div>
        <SnackbarMessageView
          message={this.state.snackbarMessage}
          onExpire={() => this.setState({snackbarMessage: ''})}
        />
      </FrameView>
    );
  };

}
