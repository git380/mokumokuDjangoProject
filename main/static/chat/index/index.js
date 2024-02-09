const users = {};

// ローディング
document.querySelector('.spinner').style.display = 'block';

// WebSocket
const webSocket = new WebSocket('ws://localhost:8766');
// WebSocketの接続が開いたときの処理
webSocket.onopen = () => {
    console.log('WebSocketが開かれました。');
    // オンラインステータス送信
    webSocket.send(JSON.stringify({
        'data_type': 'user_info',
        'data': [document.getElementById('uuid').value, document.getElementById('idInput').value, document.getElementById('name').value, true]
    }));
    // グループ情報受け取り
    fetch('http://127.0.0.1:5000/load', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: 'group_info'
    })
        .then(response => response.json())
        .then(groupInfo => {
            const data = groupInfo[document.getElementById('uuid').value][0];
            for (const key in data) {
                users[key] = data[key][0];
                if (data[key][1] && !document.getElementById(`userid-${key}`)) {
                    const user = document.createElement('p');
                    user.id = `userid-${key}`;
                    user.textContent = data[key][0];
                    document.getElementById('modal-body').appendChild(user);
                }
            }
            // json履歴受け取り
            return fetch('http://127.0.0.1:5000/load', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: 'chat_history'
            });
        })
        .then(response => response.json())
        .then(chatHistory => {
            chatHistory[document.getElementById('uuid').value].forEach(data => {
                displayMessages(data[0], data[1]);
            });
            // ローディング非表示
            document.querySelector('.loading').style.display = 'none';
            document.getElementById('loaded').style.display = 'block';
        })
        .catch(error => {
            console.error('エラー:', error);
            // ローディング非表示
            document.querySelector('.loading').style.display = 'none';
            document.getElementById('loaded').style.display = 'block';
        });
};
// メッセージを受信したときの処理
webSocket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data['data_type'] === 'user_info') {
        if (data['data'][0] !== document.getElementById('uuid').value) return;
        if (data['data'][3]) {
            users[data['data'][1]] = data['data'][2];
            const user = document.createElement('p');
            user.id = `userid-${data['data'][1]}`;
            user.textContent = data['data'][2];
            document.getElementById('modal-body').appendChild(user);
        } else {
            const existingUser = document.getElementById(`userid-${data['data'][1]}`);
            if (existingUser) existingUser.remove();
        }
    } else {
        if (data[0] === document.getElementById('uuid').value) displayMessages(data[1], data[2]);
    }
};
// WebSocketの接続が閉じたときの処理
webSocket.onclose = () => console.log('WebSocketが閉じられました。');

// メッセージを表示する関数
function displayMessages(id, message) {
    // divタグの作成
    const div = document.createElement('div');
    // divタグにchat-messageを追加
    div.classList.add('chat-message');
    //ユーザー名の要素を作成し追加
    const usernameElement = document.createElement('span');
    usernameElement.classList.add('message-sender');
    usernameElement.innerText = users[id] + ': ';
    // テキストコンテンツにメッセージを追加
    div.textContent = message;
    div.insertBefore(usernameElement, div.firstChild);
    // chatMessagesの中身を表示する。
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.appendChild(div);
}

// 送信ボタンがクリックされたときの処理
function sendMessage() {
    const inputElement = document.getElementById('message');
    const message = inputElement.value.trim();

    if (!message) return;

    // JavaScriptオブジェクトをJSONへ変換して送信
    webSocket.send(JSON.stringify([
        document.getElementById('uuid').value,
        document.getElementById('idInput').value,
        message
    ]));

    inputElement.value = ''; // 入力欄をクリア
}

// エンターキーが押されたときの処理
document.getElementById('message').addEventListener('keyup', function (event) {
    // エンターキーが押されたら送信ボタンをクリックする
    if (event.key === 'Enter') document.querySelector('.send-button').click();
});

// ページが閉じられる前に実行
window.addEventListener('beforeunload', () => {
    // オンラインステータス送信
    webSocket.send(JSON.stringify({
        'data_type': 'user_info',
        'data': [document.getElementById('uuid').value, document.getElementById('idInput').value, document.getElementById('name').value, false]
    }));
});