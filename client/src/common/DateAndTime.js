const DateAndTime = {

  dateAndTimeObjectToString: ({date, time}) => {
    return date.toLocaleDateString('en-us') + ', ' + time.toLocaleTimeString('en-us');
  },

  getUnixTime: ({date, time}) => {
    return Date.parse(new Date(DateAndTime.dateAndTimeObjectToString({date, time})));
  },

  isRangeValid: ({fromDate, fromTime, toDate, toTime}) => {
    return DateAndTime.getUnixTime({date: fromDate, time: fromTime}) <=
      DateAndTime.getUnixTime({date: toDate, time: toTime});
  },

};

export default DateAndTime;
