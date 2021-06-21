export const handleEmail = (e) => {
  const { name, email } = e.target;

  this.setState({
    email,
    validEmail: true,
    emailErrMsg: "",
    emailAlrExist: "",
  });

  if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
    this.setState({
      validEmail: false,
      emailErrMsg: "This email is invalid",
    });
  }

  if (email.length === 0) {
    this.setState({
      validEmail: false,
      emailErrMsg: "",
    });
  }
};

export const handleUsername = (e) => {
  const { name, username } = e.target;
  let minUsrLen = 5;

  this.setState({
    username,
    validUsername: true,
    usernameErrMsg: "",
    usernameLenErrMsg: "",
    usernameAlrExist: "",
  });

  if (0 < username.length && username.length < minUsrLen) {
    this.setState({
      validUsername: false,
      usernameLenErrMsg: `Username must be at least ${minUsrLen} chars`,
    });
  }
  if (!/^[a-zA-Z0-9]*$/.test(username)) {
    this.setState({
      validUsername: false,
      usernameErrMsg: "Username must be alphanumeric",
    });
  }
  if (username.length === 0) {
    this.setState({
      validUsername: false,
    });
  }
};

export const handlePassword = (e) => {
  let { name, password } = e.target;
  let minPwdLen = 8;
  this.setState({ password, validPwd: true, pwdLenErrMsg: "" });
  if (0 < password.length && password.length < minPwdLen) {
    this.setState({
      pwdLenErrMsg: `Password must be at least ${minPwdLen} chars`,
      validPwd: false,
    });
  }
  if (password.length === 0) {
    this.setState({
      validPwd: false,
    });
  }
};
