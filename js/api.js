var API = (function () {
	const BASE_URL = 'https://study.duyiedu.com';
	const TOKEN_KEY = 'token';

	function get(path) {
		const headers = {};
		const token = localStorage.getItem(TOKEN_KEY);
		if (token) {
			headers.authorization = `Bearer ${token}`;
		}
		return fetch(BASE_URL + path, { headers });
	}

	function post(path, bodyobj) {
		const headers = { 'Content-Type': 'application/json' };
		const token = localStorage.getItem(TOKEN_KEY);
		if (token) {
			headers.authorization = `Bearer ${token}`;
		}
		return fetch(BASE_URL + path, { headers, method: 'POST', body: JSON.stringify(bodyobj) });
	}

	/**
	 * 注册账号
	 * @param {用户信息} userInfo
	 */
	async function reg(userInfo) {
		const resp = await post('/api/user/reg', userInfo);
		return await resp.json();
	}

	/**
	 * 登录账号
	 * @param {登录信息} loginInfo
	 */
	async function login(loginInfo) {
		const resp = await post('/api/user/login', loginInfo);
		const body = await resp.json();
		if (body.code === 0) {
			const token = resp.headers.get('authorization');
			localStorage.setItem(TOKEN_KEY, token);
		}
		return body;
	}

	/**
	 * 验证账号是否存在
	 * @param {账号} login
	 */
	async function exists(login) {
		const resp = await get('/api/user/exists?loginId=' + login);
		return await resp.json();
	}

	/**
	 * 当前登录用户信息
	 */
	async function profile() {
		const resp = await get('/api/user/profile');
		return await resp.json();
	}

	/**
	 * 发送聊天信息
	 * @param {聊天内容} content
	 */
	async function sendChat(content) {
		const resp = await post('/api/chat', { content });
		return await resp.json();
	}

	/**
	 * 获取聊天记录
	 */
	async function getHistory() {
		const resp = await get('/api/chat/history');
		return await resp.json();
	}

	/**
	 * 退出登录
	 */
	function loginOut() {
		localStorage.removeItem(TOKEN_KEY);
  }
  
  return {
		reg,
		login,
		exists,
		profile,
		sendChat,
		getHistory,
		loginOut,
  };
})();
