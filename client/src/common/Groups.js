const Groups = {
  ADMIN: 1,
  USER_MANAGER: 2,
  REGULAR_USER: 3,

  groupToString: (group) => {
    return [
      '',
      'Admin',
      'User Manager',
      'Regular User'
    ][Number.parseInt(group)];
  },

};

export default Groups;
