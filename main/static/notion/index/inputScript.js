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
                inputContentControl(key, data[0], data[1], data[2], data[3]);
            }
        })
        .catch(error => console.error('エラー:', error));
};
// メッセージを受信したときの処理
webSocket.onmessage = event => {
    const data = JSON.parse(event.data);
    inputContentControl(data[0], data[1], data[2], data[3], data[4]);
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
    document.getElementById('input-title').value = '';
    document.getElementById('input-link').value = '';
    closeInputArea();
}

// ユーザーアイコン、投稿内容、投稿画像を含む投稿アイテムを作成する
function inputContentControl(id, userid, title, link, tag) {
    // ユーザーアイコンを作成し追加
    const userIcon = document.createElement('div');
    userIcon.classList.add('user-icon');
    // ユーザーアイコンの画像要素を作成し追加
    const iconImage = document.createElement('img');
    iconImage.src = 'path/to/your/user-icon.jpg';
    userIcon.appendChild(iconImage);
    // ユーザー名の要素を作成し追加
    const usernameElement = document.createElement('div');
    usernameElement.classList.add('username');
    usernameElement.innerText = userid;
    userIcon.appendChild(usernameElement);

    // タイトルにリンク付きの要素を作成
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.target = '_blank'; // '_blank'はリンクを新しいタブで開くための処理
    linkElement.textContent = title;

    // タグを表示する要素を作成
    const tagElement = document.createElement('div');
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`; // タグの先頭に '#' を追加する
    tagElement.classList.add('post-tag');
    tagElement.innerText = formattedTag;

    // タグとリンクから投稿内容を作成し追加
    const postContentDiv = document.createElement('div');
    postContentDiv.classList.add('post-content');
    postContentDiv.appendChild(tagElement); // タグを先に追加
    postContentDiv.appendChild(linkElement);

    // コンテナを作成し、post-itemというクラスを指定（CSSでも使っている）
    const postItem = document.createElement('div');
    postItem.classList.add('post-item');
    postItem.appendChild(userIcon);
    postItem.appendChild(postContentDiv); // 投稿内容にリンクとタイトルを追加

    // post-containerは投稿要素を表示するためのコンテナ
    const postContainer = document.getElementById('post-container');
    // 投稿の都度、一番上の要素に追加
    postContainer.insertBefore(postItem, postContainer.firstChild);
}

// 送信ボタンが押されると、入力された文字を送る
function sendMessage() {
    const userid = document.getElementById('idInput').value;
    const tagElement = document.getElementById('input-tag');
    const inputTitleElement = document.getElementById('input-title');
    const inputLinkElement = document.getElementById('input-link');

    //trimは空白文字改行を削除するメソッド
    const title = inputTitleElement.value.trim();
    const link = inputLinkElement.value.trim();

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

    // JavaScriptオブジェクトをJSONへ変換して送信
    webSocket.send(JSON.stringify([
        Date.now(),
        userid,
        title,
        link,
        tagElement.value
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
    postItems.forEach(postItem => {
        // 投稿が検索キーワードを含んでいれば表示し、それ以外は非表示にする
        postItem.style.display = postItem.querySelector('.post-content').textContent.toLowerCase().includes(document.getElementById('searchInput').value.toLowerCase()) ? 'flex' : 'none';
    })
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