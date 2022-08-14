// 用户登录和注册的验证的通用代码
class FieldValidator {
	constructor(txtId, validatorFunc) {
		this.input = $('#' + txtId);
		this.p = $('#' + txtId).nextElementSibling;
		this.validatorFunc = validatorFunc;
		this.input.onblur = () => {
			this.validator();
		};
	}
	async validator() {
		const err = await this.validatorFunc(this.input.value);
		if (err) {
			this.p.innerText = err;
			return false;
		} else {
			this.p.innerText = '';
			return true;
		}
	}
	static async validate(...validators) {
    const proms = validators.map((v) => v.validator());
    const result = await Promise.all(proms);
    return result.every(r => r);
	}
}

