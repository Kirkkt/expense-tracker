const PageController = {

  // no test
  getWeek: (weekStartDate) => {
    const saturday = new Date(weekStartDate);
    saturday.setDate(saturday.getDate() + 6);
    return weekStartDate + ' - ' + saturday.toLocaleDateString('en-us');
  },

  render: ({state: {isPrinting}, renderWithFrame, renderDataTable}) => {
    if (isPrinting) {
      return renderDataTable();
    } else {
      return renderWithFrame();
    }
  },

};

export default PageController;
