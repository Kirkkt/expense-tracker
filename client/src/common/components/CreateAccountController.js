import Config from '../Config';

const CreateAccountController = {

  getErrorTextForUsername: ({username}) => {
    if (!username) {
      return Config.ERROR_TEXT_FOR_REQUIRED_FIELD;
    } else if (username.indexOf(' ') !== -1) {
      return Config.ERROR_TEXT_FOR_SPACE_IN_PASSWORD;
    } else {
      return '';
    }
  },

  getErrorTextForPassword: ({password}) => password ? '' : Config.ERROR_TEXT_FOR_REQUIRED_FIELD,

  getErrorTextForPasswordAgain: ({password, passwordAgain}) => {
    if (!passwordAgain) {
      return Config.ERROR_TEXT_FOR_REQUIRED_FIELD;
    }
    if (password !== passwordAgain) {
      return Config.ERROR_TEXT_FOR_UNMATCH_PASSWORDS;
    } else {
      return '';
    }
  },

  getErrorTextForGroup: ({group}) => group ? '' : Config.ERROR_TEXT_FOR_REQUIRED_FIELD,

  getGroupFromSelectFieldValue: value => Number.parseInt(value) + 1,

  shouldDisableConfirm: state => CreateAccountController.getErrorTextForUsername(state) !== '' ||
    CreateAccountController.getErrorTextForPassword(state) !== '' ||
    CreateAccountController.getErrorTextForPasswordAgain(state) !== '' ||
    CreateAccountController.getErrorTextForGroup(state) !== '',

};

export default CreateAccountController;
