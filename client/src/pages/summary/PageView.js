import React from 'react';

import Config from '../../common/Config';
import Groups from '../../common/Groups';
import ActionButtonView from '../../common/components/ActionButtonView';
import SnackbarMessageView from '../../common/components/SnackbarMessageView';
import FrameView from '../../common/components/FrameView';
import LogInController from '../../common/LogInController';

import Styles from './PageStyles.css';
import DataTableView from './DataTableView';
import Controller from './PageController';

export default class PageView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      summaryData: [],
      snackbarMessage: '',
      pageNumber: 1,
      pageCount: 0,
    };
    this.querySummaryData();
  };

  querySummaryData = () => {
    fetch(Config.API_URL_PREFIX + 'GetSummary', {
      method: 'POST',
      body: 'token=' + LogInController.getToken() +
        '&pageNumber=' + this.state.pageNumber +
        '&pageSize=' + Config.PAGE_SIZE,
    })
    .then(response => response.json())
      .then(({success, error, summary, pageCount}) => {
        if (success) {
          this.setState({
            summaryData: summary.map(({weekStartDate, total}) => {
              return {
                week: Controller.getWeek(weekStartDate),
                total: Number.parseFloat(total).toFixed(2),
                dailyAverage: (Number.parseFloat(total) / 7).toFixed(2),
              };
            }),
            pageCount,
          });
        } else {
          this.setState({snackbarMessage: error.message});
        }
      })
      .catch(({message}) => this.setState({snackbarMessage: message}));
  };

  handlePrint = () => {
    this.setState({isPrinting: true}, () => {
      print();
      setTimeout(this.setState({isPrinting: false}), 1);
    });
  };

  renderWithFrame = () => (
    <FrameView leftNavigationItemSelected={3} >
      <div className={Styles.mainContentWraper}>
        <ActionButtonView
          label="Print"
          primary={true}
          onClick={this.handlePrint}
        />
        {this.renderDataTable()}
      </div>
      <SnackbarMessageView
        message={this.state.snackbarMessage}
        onExpire={() => this.setState({snackbarMessage: ''})}
      />
    </FrameView>
  );

  renderDataTable = () => (
    <DataTableView
      tableData={this.state.summaryData}
      pageNumber={this.state.pageNumber}
      pageCount={this.state.pageCount}
      onPageChange={pageNumber => this.setState({pageNumber}, this.querySummaryData)}
    />
  );

  render = () => Controller.render(this);

}
