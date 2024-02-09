// ローディング
document.querySelector('.spinner').style.display = 'block';

// チャット履歴
let chatHistory;

fetch('http://127.0.0.1:5000/load', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: 'group_info_log'
})
    .then(response => response.json())
    .then(groupInfo => {
        // グループ一覧作成
        Object.keys(groupInfo).forEach((uuid) => {
            // 自分の所属しているuuid出ない場合、実行しない
            if (!groupInfo[uuid][0].hasOwnProperty(document.getElementById('client_id').value)) return;
            // 1グループ作成
            const chatRoom = document.createElement('div');
            chatRoom.className = 'chat-room';
            // メッセージ作成
            chatRoom.onclick = function () {
                // メッセージをHTMLに変換して表示
                document.getElementById('chatContent').innerHTML = chatHistory[uuid].map(data =>
                    `<div class="message-container"><strong>${data[0]}:</strong> ${data[1]}</div>`
                ).join('');
            };
            chatRoom.innerHTML = `<i class="bi bi-chat-dots"></i>${groupInfo[uuid][2]}`;
            document.getElementById('chatList').appendChild(chatRoom);
        });
        // json履歴受け取り
        return fetch('http://127.0.0.1:5000/load', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: 'chat_history_log'
        });
    })
    .then(response => response.json())
    .then(data => {
        chatHistory = data;
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