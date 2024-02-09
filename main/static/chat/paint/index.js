const webSocket = new WebSocket('ws://localhost:8124');
// WebSocketの接続が開いたときの処理
webSocket.onopen = () => {
    console.log('WebSocketが開かれました。');
    // json履歴受け取り
    fetch('http://127.0.0.1:5000/load', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: 'canvas_history'
    })
        .then(response => response.json())
        .then(notionHistory => {
            notionHistory[document.getElementById('uuid').value].forEach(msg => {
                drawLine(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5]);
            });
        })
        .catch(error => console.error('エラー:', error));
};
// サーバからのメッセージを受信したときのイベントハンドラ
webSocket.onmessage = function (event) {
    const msg = JSON.parse(event.data); // 受信データをJSONオブジェクトに変換
    if (msg[0] !== document.getElementById('uuid').value) return;
    // クリアイベントの処理
    if (msg[1] === 'clear') context.clearRect(0, 0, canvas.width, canvas.height);
    // 通常の描画データの処理
    else drawLine(msg[1], msg[2], msg[3], msg[4], msg[5], msg[6]);
};
// WebSocketの接続が閉じたときの処理
webSocket.onclose = () => console.log('WebSocketが閉じられました。');

// canvas要素の取得と2Dコンテキストの初期化
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// 初期描画色、描画状態フラグ、最後の座標を定義
let drawColor = 'rgb(0, 0, 0)'; // 初期色は黒
let drawing = false; // 描画中かどうかのフラグ
let lastX = 0; // 最後のX座標
let lastY = 0; // 最後のY座標

// 色選択エリアの設定
document.querySelectorAll('li').forEach(function (elem) {
    elem.addEventListener('click', function () {
        drawColor = this.style.backgroundColor; // 選択された色を現在の描画色に設定
    });
});

// キャンバス上でのmousedownイベントハンドラ
canvas.addEventListener('mousedown', function (e) {
    lastX = e.offsetX; // クリックされたX座標
    lastY = e.offsetY; // クリックされたY座標
    drawing = true; // 描画開始
});

// キャンバスでのmousemoveイベントハンドラ
canvas.addEventListener('mousemove', function (e) {
    if (!drawing) return; // 描画中でなければ何もしない
    // スライダーの要素を取得
    const penThicknessInput = document.getElementById('penThickness').value;
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    // 線を描画
    drawLine(drawColor, penThicknessInput, lastX, lastY, currentX, currentY);
    // 描画データをサーバに送信
    webSocket.send(JSON.stringify([document.getElementById('uuid').value, drawColor, penThicknessInput, lastX, lastY, currentX, currentY]));
    lastX = currentX; // 現在の座標を更新
    lastY = currentY; // 現在の座標を更新
});

// キャンバスでのmouseupイベントハンドラ
canvas.addEventListener('mouseup', function () {
    drawing = false; // 描画終了
});

// キャンバスでのmouseoutイベントハンドラ
canvas.addEventListener('mouseout', function () {
    drawing = false; // 描画終了
});

// 線を描画する関数
function drawLine(color, lineWidth, fromX, fromY, toX, toY) {
    context.strokeStyle = color; // 線の色を設定
    context.lineWidth = lineWidth; // 線の太さを設定
    context.beginPath(); // 新しいパスを開始
    context.moveTo(fromX, fromY); // パスの開始座標を設定
    context.lineTo(toX, toY); // パスの終了座標を設定
    context.stroke(); // 線を描画
    context.closePath(); // パスを閉じる
}

// キャンバスをクリアする関数
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
    webSocket.send(JSON.stringify([document.getElementById('uuid').value, 'clear'])); // クリアイベントをサーバに送信
}

// キャンバスの内容を画像として保存する関数
function saveCanvas() {
    const link = document.createElement('a'); // リンク要素を作成
    link.href = canvas.toDataURL("image/png"); // キャンバスの内容を画像URLに変換
    link.download = "canvas-image.png"; // ダウンロードファイル名を設定
    link.click(); // リンクをクリックして画像をダウンロード
}