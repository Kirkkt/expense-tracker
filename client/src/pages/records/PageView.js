import React from 'react';

import Config from '../../common/Config';
import DateAndTime from '../../common/DateAndTime';
import SnackbarMessageView from '../../common/components/SnackbarMessageView';
import DataTableView from '../../common/components/DataTableView';
import FrameView from '../../common/components/FrameView';
import LogInController from '../../common/LogInController';
import Utils from '../../common/Utils';

import Styles from './PageStyles.css';
import ActionBarView from './ActionBarView';
import Controller from './PageController';

export default class PageView extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this.queryRecordsData();
  };

  getDefaultState = () => {
    return {
      snackbarMessage: '',
      rowIndicesSelected: [],
      recordsData: [],
      shouldClearDataTable: false,
      fromUnixTime: '',
      toUnixTime: '',
      minAmount: undefined,
      maxAmount: undefined,
      pageNumber: 1,
      pageCount: 0,
    };
  };

  queryRecordsData = () => {
    fetch(Config.API_URL_PREFIX + 'GetRecords', {
      method: 'POST',
      body: 'token=' + LogInController.getToken() +
        '&pageNumber=' + this.state.pageNumber +
        '&pageSize=' + Config.PAGE_SIZE +
        (this.state.fromUnixTime ? '&from=' + this.state.fromUnixTime : '') +
        (this.state.toUnixTime ? '&to=' + this.state.toUnixTime : '') +
        (this.state.minAmount ? '&min=' + this.state.minAmount : '') +
        (this.state.maxAmount ? '&max=' + this.state.maxAmount : ''),
    })
    .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          this.setState({
            recordsData: responseJson.records.map(record => {
              record.date = new Date(record.dateAndTime);
              record.time = new Date(record.dateAndTime);
              record.amount = Number.parseFloat(record.amount);
              delete record.dateAndTime;
              return record;
            }),
            pageCount: responseJson.pageCount,
            shouldClearDataTable: true,
          }, () => {
            if (this.state.recordsData.length === 0 && this.state.pageNumber > 1) {
              this.setState({
                shouldClearDataTable: false,
                pageNumber: this.state.pageNumber - 1
              }, this.queryRecordsData);
            } else {
              this.setState({shouldClearDataTable: false});
            }
          });
        } else {
          this.setState({snackbarMessage: responseJson.error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  handleCreate = ({username, date, time, description, amount, comment}) => {
    const body = 'dateAndTime=' + DateAndTime.dateAndTimeObjectToString({date, time}) +
      '&username=' + username +
      '&description=' + description +
      '&amount=' + Number.parseFloat(amount).toFixed(2) +
      '&comment=' + comment +
      '&token=' + LogInController.getToken();
    fetch(Config.API_URL_PREFIX + 'CreateRecord', {
      method: 'POST',
      body,
    })
    .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          this.setState({rowIndicesSelected: []}, this.queryRecordsData);
        } else {
          this.setState({snackbarMessage: responseJson.error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  handleEdit = ({date, time, description, amount, comment, username, id}) => {
    const body = 'dateAndTime=' + DateAndTime.dateAndTimeObjectToString({date, time}) +
      '&description=' + description +
      '&amount=' + Number.parseFloat(amount).toFixed(2) +
      '&comment=' + comment +
      '&username=' + username +
      '&id=' + id +
      '&token=' + LogInController.getToken();
    fetch(Config.API_URL_PREFIX + 'UpdateRecord', {
      method: 'POST',
      body,
    })
    .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          this.setState({rowIndicesSelected: []}, this.queryRecordsData);
        } else {
          this.setState({snackbarMessage: responseJson.error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  handleDelete = ids => {
    const body = 'ids=' + JSON.stringify(ids) +
      '&token=' + LogInController.getToken();
    fetch(Config.API_URL_PREFIX + 'DeleteRecords', {
      method: 'POST',
      body,
    })
    .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          this.setState({rowIndicesSelected: []}, this.queryRecordsData);
        } else {
          this.setState({snackbarMessage: responseJson.error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  handleFilter = ({fromUnixTime, toUnixTime, minAmount, maxAmount}) => {
    this.setState(
      {
        fromUnixTime,
        toUnixTime,
        minAmount,
        maxAmount,
        pageNumber: 1,
      },
      this.queryRecordsData
    );
  };

  render = () => {
    return (
      <FrameView leftNavigationItemSelected={1} >
        <div className={Styles.mainContentWraper}>
          <ActionBarView
            selectedData={Controller.getSelectedData(this.state)}
            handleCreate={this.handleCreate}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            handleFilter={this.handleFilter}
            reset={() => this.setState(this.getDefaultState(), this.queryRecordsData)}
          />
          <DataTableView
            tableData={this.state.recordsData}
            handleRowSelection={rowIndicesSelected => this.setState({rowIndicesSelected})}
            shouldClearDataTable={this.state.shouldClearDataTable}
            headerColumnTitles={Utils.conditionalPrepend(LogInController.amIAdmin(), 'Username', [
              'Description',
              'Amount',
              'Comment',
              'Date',
              'Time',
            ])}
            bodyColumnsShouldAddTooltip={Utils.conditionalPrepend(LogInController.amIAdmin(), true, [
              true,
              false,
              true,
              true,
              true,
            ])}
            bodyColumnRenderers={Utils.conditionalPrepend(LogInController.amIAdmin(), ({username}) => username, [
              ({description}) => description,
              ({amount}) => Number.parseFloat(amount).toFixed(2),
              ({comment}) => comment,
              ({date}) => date.toLocaleDateString('en-us'),
              ({time}) => time.toLocaleTimeString('en-us'),
            ])}
            pageNumber={this.state.pageNumber}
            pageCount={this.state.pageCount}
            onPageChange={pageNumber => this.setState({pageNumber}, this.queryRecordsData)}
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
