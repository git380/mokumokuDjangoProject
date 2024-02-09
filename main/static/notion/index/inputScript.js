// ローディング
document.querySelector('.spinner').style.display = 'block';

// WebSocket
const webSocket = new WebSocket('ws://localhost:8765');
// WebSocketの接続が開いたときの処理
webSocket.onopen = () => {
    console.log('WebSocketが開かれました。');
    // json履歴受け取り
    fetch('http://127.0.0.1:5000/load', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: 'notion_history'
    })
        .then(response => response.json())
        .then(notionHistory => {
            for (const key in notionHistory) {
                const data = notionHistory[key];
                inputContentControl(key, data[0], data[1], data[2], data[3], data[4], data[5]);
            }
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
    // イイねボタン処理
    if (data['data_type'] === 'like') {
        const existingMessage = document.getElementById(`post-item-${data['data'][0]}`);
        const checking = data['data'][1].includes(userid);
        existingMessage.querySelector('.checkbox').checked = checking;
        existingMessage.querySelector('.checkbox-span').textContent = checking ? '♥' : '♡';
        existingMessage.querySelector('.like-count').textContent = data['data'][1].length;
    }
    //notion投稿処理
    else inputContentControl(data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
};
// WebSocketの接続が閉じたときの処理
webSocket.onclose = () => console.log('WebSocketが閉じられました。');


//入力フォームを表示する関数
function openInputArea() {
    //入力フォームにflex要素を与えて表示
    document.getElementById('input-form').style.display = 'flex';
    //背景を表示
    document.getElementById('overlay').style.display = 'flex';
    //入力フォームが開いている間、ボディのスクロールを無効にする
    document.body.style.overflow = 'hidden';
}


//戻るボタンが押されたときの処理を行う関数
function goBack() {
    //確認画面をアラートで表示
    const confirmation = confirm('入力内容が破棄されます');

    //アラートの「キャンセル」ボタンを押した際の処理
    if (!confirmation) return;

    //入力内容をリセットして閉じる
    document.getElementById('input-tag').value = '';
    document.getElementById('input-title').value = '';
    document.getElementById('input-link').value = '';
    closeInputArea();
}

// ユーザーアイコン、投稿内容、投稿画像を含む投稿アイテムを作成する
function inputContentControl(id, in_userid, fullname, title, link, tag, like) {
    // ユーザーアイコンを作成し追加
    const userIcon = document.createElement('div');
    userIcon.classList.add('user-icon');
    // ユーザー名の要素を作成し追加
    const usernameElement = document.createElement('div');
    usernameElement.classList.add('username');
    usernameElement.id = `userid-${in_userid}`;
    usernameElement.innerText = fullname;
    userIcon.appendChild(usernameElement);

    // タイトルにリンク付きの要素を作成
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.target = '_blank'; // '_blank'はリンクを新しいタブで開くための処理
    linkElement.textContent = title;

    // タグを表示する要素を作成
    const tagElement = document.createElement('div');
    tagElement.classList.add('post-tag');
    tagElement.innerText = tag;

    // タグとリンクから投稿内容を作成し追加
    const postContentDiv = document.createElement('div');
    postContentDiv.classList.add('post-content');
    postContentDiv.appendChild(tagElement); // タグを先に追加
    postContentDiv.appendChild(linkElement);

    // コンテナを作成し、post-itemというクラスを指定（CSSでも使っている）
    const postItem = document.createElement('div');
    postItem.id = `post-item-${id}`; // idを指定
    postItem.classList.add('post-item');
    postItem.appendChild(userIcon);
    postItem.appendChild(postContentDiv); // 投稿内容にリンクとタイトルを追加

    // 自分のイイね状況取得
    const checking = like.includes(userid);

    // チェックボックスを作成
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.className = 'checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = checking;
    label.appendChild(checkbox);

    // span要素を作成
    const span = document.createElement('span');
    span.className = 'checkbox-span';
    span.textContent = checking ? '♥' : '♡';
    label.appendChild(span);

    const likes = document.createElement('span');
    likes.className = 'like-count';
    likes.textContent = like.length;
    label.appendChild(likes);

    // チェックボックスが変更されたときの処理
    checkbox.addEventListener('change', () => {
        label.querySelector('.checkbox-span').textContent = checkbox.checked ? '♥' : '♡';
        // JSONに戻してチェックボックスの状態をサーバへ送信
        webSocket.send(JSON.stringify({
            'data_type': 'like',
            'data': [
                id,
                userid,
                checkbox.checked
            ]
        }));
    });
    postItem.appendChild(label);

    // post-containerは投稿要素を表示するためのコンテナ
    const postContainer = document.getElementById('post-container');
    // 投稿の都度、一番上の要素に追加
    postContainer.insertBefore(postItem, postContainer.firstChild);
}

// 送信ボタンが押されると、入力された文字を送る
function sendMessage() {
    const tagElement = document.getElementById('input-tag');
    const inputTitleElement = document.getElementById('input-title');
    const inputLinkElement = document.getElementById('input-link');

    //trimは空白文字改行を削除するメソッド
    const title = inputTitleElement.value.trim();
    const link = inputLinkElement.value.trim();
    const tag = tagElement.value.trim(); // タグを取得してトリムする

    //エラー処理
    if (!title) {
        window.alert('タイトルが未入力です');
        return;
    }
    //includesは文字列内に指定した要素が含まれているか確認するメソッド
    if (!link.startsWith('https://') || !link.includes('notion.site')) {
        window.alert('有効なNotionのURLを入力してください。');
        return;
    }

    // タグが空でなければ '#' を付ける
    const formattedTag = tag ? (tag.startsWith('#') ? tag : `#${tag}`) : '';

    // JavaScriptオブジェクトをJSONへ変換して送信
    webSocket.send(JSON.stringify([
        Date.now(),
        userid,
        fullname,
        title,
        link,
        formattedTag,
        []
    ]));

    //投稿フォーム内の情報を削除
    tagElement.value = '';
    inputTitleElement.value = '';
    inputLinkElement.value = '';
    closeInputArea();
}

// 検索キーワードに基づいて投稿をフィルタリングおよび表示する関数
function searchPosts() {
    const postItems = document.getElementById('post-container').getElementsByClassName('post-item');
    // 各投稿をループし、検索キーワードが含まれているか確認
    Array.from(postItems).forEach(postItem => {
        // 投稿が検索キーワードを含んでいれば表示し、それ以外は非表示にする
        postItem.style.display = postItem.querySelector('.post-content').textContent.toLowerCase().includes(document.getElementById('searchInput').value.toLowerCase()) ? 'flex' : 'none';
    });
}

//入力フォームを非表示にする関数
function closeInputArea() {
    //入力フォームを非表示
    document.getElementById('input-form').style.display = 'none';
    //背景を非表示
    document.getElementById('overlay').style.display = 'none';
    //スクロールを有効にする
    document.body.style.overflow = 'auto';
}

// キーが押されたときの処理
document.getElementById('searchInput').addEventListener('keydown', function (event) {
    // エンターキーが押されたら実行
    if (event.key === 'Enter') {
        event.preventDefault(); // デフォルトの動作を防止
        searchPosts(); // 検索
    }
});