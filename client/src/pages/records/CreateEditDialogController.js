import Config from '../../common/Config';
import LogInController from '../../common/LogInController';

const CreateEditDialogController = {

  shouldDisableConfirm: (state) => !!state.amountErrorText ||
    !state.date ||
    !state.time ||
    !state.description ||
    !state.amount ||
    !state.username,

  getErrorTextForDescription: ({description}) => description ?
    '' :
    Config.ERROR_TEXT_FOR_REQUIRED_FIELD,

  getErrorTextForUsername: ({username}) => username ?
    '' :
    Config.ERROR_TEXT_FOR_REQUIRED_FIELD,

  renderUsernameInputIfNeccessary: (renderUsernameInput, defaultValue) => {
    if (LogInController.amIAdmin()) {
      return renderUsernameInput();
    } else {
      return defaultValue;
    }
  },

};

export default CreateEditDialogController;
