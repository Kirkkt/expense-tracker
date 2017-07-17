import LogInController from '../../common/LogInController';
import Groups from '../../common/Groups';

const PageController = {

  getSelectedData: ({rowIndicesSelected, recordsData}) => rowIndicesSelected.map(
    indexSelected => recordsData[indexSelected]
  ),

};

export default PageController;
