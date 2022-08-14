(async function () {
	const resp = await API.profile();
	const user = resp.data;
	if (!user) {
		alert('未登录，或登录已过期，点击确定跳转到登录界面');
		location.href = './login.html';
		return;
	}

	// dom元素
	const doms = {
		aside: {
			nickname: $('#nickname'),
			loginId: $('#loginId'),
		},
		close: $('.close'),
		chatContainer: $('.chat-container'),
		txtMsg: $('#txtMsg'),
		msgContainer: $('.msg-container'),
	};

	await loadHistory();
	setUserInfo();
  doms.close.addEventListener('click', loginOut);
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  }

	/**
	 * 填写用户信息
	 */
	function setUserInfo() {
		doms.aside.nickname.innerText = user.nickname;
		doms.aside.loginId.innerText = user.loginId;
	}

	/**
	 * 加载历史记录
	 */
	async function loadHistory() {
		const resp = await API.getHistory();
		for (const item of resp.data) {
			addChat(item);
		}
		scrollBottom();
	}

	/**
	 * 滚动到最下面
	 */
	function scrollBottom() {
		doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
	}

	/**
	 * 注销账号
	 */
	function loginOut() {
		API.loginOut();
		location.href = './login.html';
	}

	/**
	 * 格式化时间戳
	 * @param {时间戳} timestamp
	 */
	function formatDate(timestamp) {
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDay().toString().padStart(2, '0');
		const hour = date.getHours().toString().padStart(2, '0');
		const minute = date.getMinutes().toString().padStart(2, '0');
		const second = date.getSeconds().toString().padStart(2, '0');
		return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
	}

	/**
	 * 添加消息
	 * @param {消息数据} chatInfo
	 */
	function addChat(chatInfo) {
		const div = $$$('div');
		div.classList.add('chat-item');
		const img = $$$('img');
		img.classList.add('chat-avatar');
		if (chatInfo.from) {
			div.classList.add('me');
			img.src = './asset/avatar.png';
		} else {
			img.src = './asset/robot-avatar.jpg';
		}
		const content = $$$('div');
		content.classList.add('chat-content');
		content.innerText = chatInfo.content;
		const date = $$$('div');
		date.classList.add('chat-date');
		date.innerText = formatDate(chatInfo.createdAt);
		div.appendChild(img);
		div.appendChild(content);
		div.appendChild(date);
		doms.chatContainer.appendChild(div);
	}

	/**
	 * 发送消息
	 */
	async function sendChat() {
		const content = doms.txtMsg.value.trim();
		if (!content) {
			return;
		}
		addChat({
			from: user.loginId,
			to: null,
			createdAt: Date.now(),
			content,
    });
    doms.txtMsg.value = '';
		scrollBottom();
		const resp = await API.sendChat(content);
		addChat({
			from: null,
			to: user.loginId,
			...resp.data,
		});
		scrollBottom();
  }
 })();
