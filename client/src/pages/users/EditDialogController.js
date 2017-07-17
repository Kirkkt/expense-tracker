import Config from '../../common/Config';
import CreateAccountController from '../../common/components/CreateAccountController';

const EditDialogController = {

  getErrorTextForPasswordAgain: ({password, passwordAgain}) => password === passwordAgain ? '' :
    Config.ERROR_TEXT_FOR_UNMATCH_PASSWORDS,

  shouldDisableConfirm: state => CreateAccountController.getErrorTextForUsername(state) !== '' ||
    EditDialogController.getErrorTextForPasswordAgain(state) !== '' ||
    CreateAccountController.getErrorTextForGroup(state) !== '',

};

export default EditDialogController;
