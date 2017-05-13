import Account from './Account';

export default class AdminAccount extends Account {
  isAdmin;

  static create({
    userName,
    password,
    ...others
  }) {
    if (!userName) {
      throw Error('用户名不能为空');
    }
    if (!password || password.length < 5) {
      throw Error('密码不能少于5位');
    }
    let userAccount = new AdminAccount;
    userAccount.raiseEvent('accountCreated', {
      userName,
      password,
      ...others
    });
    return userAccount;
  }

  accountCreated({userName, password, displayName, email}) {
    this.userName = userName;
    this.password = password;
    this.displayName = displayName;
    this.email = email;
    this.isAdmin = true;
  }

  doCreateSnapshot() {
    return {userName: this.userName, password: this.password, displayName: this.displayName, email: this.email};
  }

  doBuildFromSnapshot({userName, password, displayName, email}) {
    this.userName = userName;
    this.password = password;
    this.displayName = displayName;
    this.email = email;
    this.isAdmin = true;
  }
}
