/* eslint-disable no-useless-escape */
export const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = number => {
  var re = /^[0-9]{10}$/;
  return re.test(String(number).toLowerCase());
};
