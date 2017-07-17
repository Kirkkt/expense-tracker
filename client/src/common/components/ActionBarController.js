const ActionBarController = {

  shouldDisableDeleteButton: ({selectedData}) => !selectedData || selectedData.length === 0,

  shouldDisableEditButton: ({selectedData}) => !selectedData || selectedData.length !== 1,

};

export default ActionBarController;
