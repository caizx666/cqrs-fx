import Account from './Account';

export default class UserAccount extends Account {
  contactPhone;
  contactAddress;

  static create({
    userName,
    password,
    ...others}) {
    if (!userName) {
      throw Error('用户名不能为空');
    }
    if (!password || password.length < 5) {
      throw Error('密码不能少于5位');
    }
    let userAccount = new UserAccount;
    userAccount.raiseEvent('accountCreated', {
      userName,
      password,
      ...others
    });
    return userAccount;
  }

  when({
    name,
    data
  }) {
    console.log('when', name, JSON.stringify( data));
  }

  accountCreated({
    contactPhone,
    userName,
    password,
    displayName,
    email,
    ...contactAddress
  }) {
    this.userName = userName;
    this.password = password;
    this.displayName = displayName;
    this.email = email;
    this.contactPhone = contactPhone;
    this.contactAddress = contactAddress;
  }
}
