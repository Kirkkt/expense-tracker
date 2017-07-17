const DataTableController = {

  render: ({props: {tableData}, renderWithoutContent, renderWithContent}) =>
    (!tableData || tableData.length === 0) ? renderWithoutContent() : renderWithContent(),

};

export default DataTableController;
