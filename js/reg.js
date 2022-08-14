const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
	if (!val) {
		return '请输入账号';
	}
	const resp = await API.exists(val);
	if (resp.data) {
		return '该账号已存在';
	}
});

const nicknameValidator = new FieldValidator('txtNickname', function (val) {
	if (!val) {
		return '请输入用户名';
	}
});

const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
	if (!val) {
		return '请填写密码';
	}
});

const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function (val) {
	if (!val) {
		return '请填写确认密码';
	}
	if (val !== loginPwdValidator.input.value) {
		return '两次密码不一致';
	}
});

const form = $('.user-form');
form.onsubmit = async function (e) {
	e.preventDefault();
	const result = await FieldValidator.validate(loginIdValidator, nicknameValidator, loginPwdValidator, loginPwdConfirmValidator);
	if (!result) {
		return;
	}
	const fomrData = new FormData(form);
  const data = Object.fromEntries(fomrData.entries());
  const resp = await API.reg(data);
  if (resp.data === 0) {
    alert('注册成功，点击确定跳转到登录界面');
    location.href = ('./login.html')
  }
};
