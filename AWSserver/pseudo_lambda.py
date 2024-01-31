from flask import Flask, request
from flask_cors import CORS

import json

app = Flask(__name__)
CORS(app)


@app.route('/make_chat', methods=['POST'])
def receive_json():
    # POSTリクエストからJSONデータを取得
    data = request.get_json()

    uuid = data[0]
    chat_name = data[1]
    chat_date = data[2]
    # JSONのチャット履歴を追加
    with open('json/group_info.json', 'r', encoding='utf-8') as json_file_r:
        group_info = json.load(json_file_r)
    # JSONチャット履歴を辞書に追加(キーはStringに変換)
    group_info[uuid] = [{}, chat_name, chat_date]
    # チャット履歴をJSONで保存
    with open('json/group_info.json', 'w', encoding='utf-8') as json_file_w:
        json.dump(group_info, json_file_w, ensure_ascii=False, indent=4)

    # 応答を返す（オプション）
    return ''


@app.route('/load', methods=['POST'])
def load():
    # JSONのチャット履歴を追加
    with open(f'json/{request.data.decode('utf-8')}.json', 'r', encoding='utf-8') as json_file_r:
        return json_file_r.read()


if __name__ == '__main__':
    app.run(debug=True)
