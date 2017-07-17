const DataTableController = {

  isSelected: ({selected}, index) => selected.indexOf(index) !== -1,

  convertSelectedRowsToArray: (selectedRows, totalRowCount) => {
    if (selectedRows === 'all') {
      return [...Array(totalRowCount).keys()];
    }
    if (selectedRows === 'none') {
      return [];
    }
    return selectedRows;
  },

  addTooltipIfNecessary: ({props: {bodyColumnsShouldAddTooltip}, addTooltip}, columnIndex, content) => {
    if (bodyColumnsShouldAddTooltip[columnIndex]) {
      return addTooltip(content);
    } else {
      return content;
    }
  },

  render: ({props: {tableData}, renderWithoutContent, renderWithContent}) =>
    (!tableData || tableData.length === 0) ? renderWithoutContent() : renderWithContent(),

};

export default DataTableController;
