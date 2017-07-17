const DateAndTimePickerController = {

  shouldDisableTimePicker: ({props: {allDay} = {}, state: {timeAndDateNow} = {}}) => !!allDay || !!timeAndDateNow,

  renderToggleIfNecessary: ({shouldShowToggle}, renderer) => shouldShowToggle ? renderer() : '',

};

export default DateAndTimePickerController;
