import asyncio
import json

import websockets

# クライアントの管理用のセット
clients = set()


# クライアントからのメッセージを受信するコルーチン
async def handle_client(websocket):  # 接続が確立された
    print('chat-クライアントが接続しました。')
    try:
        # 新しいクライアントのWebSocket接続をclientsセットに追加
        clients.add(websocket)

        async for message in websocket:
            # 受信したJSONデータをPythonオブジェクトに変換
            data = json.loads(message)
            if isinstance(data, list):
                uuid = data[0]
                client_id = data[1]
                received_message = data[2]
                # JSONのチャット履歴を追加
                with open('json/chat_history.json', 'r', encoding='utf-8') as json_file_r:
                    chat_history = json.load(json_file_r)
                # JSONチャット履歴を辞書に追加(キーはStringに変換)
                if uuid in chat_history:
                    chat_history[uuid].append([client_id, received_message])
                else:
                    chat_history[uuid] = [[client_id, received_message]]
                # チャット履歴をJSONで保存
                with open('json/chat_history.json', 'w', encoding='utf-8') as json_file_w:
                    json.dump(chat_history, json_file_w, ensure_ascii=False, indent=4)
            else:
                uuid = data.get('data', '')[0]
                client_id = data.get('data', '')[1]
                name = data.get('data', '')[2]
                status = data.get('data', '')[3]
                # JSONのチャット履歴を追加
                with open('json/group_info.json', 'r', encoding='utf-8') as json_file_r:
                    group_info = json.load(json_file_r)
                # JSONチャット履歴を辞書に追加(キーはStringに変換)
                group_info[uuid][0][client_id] = [name, status]
                # チャット履歴をJSONで保存
                with open('json/group_info.json', 'w', encoding='utf-8') as json_file_w:
                    json.dump(group_info, json_file_w, ensure_ascii=False, indent=4)
            # クライアントからのメッセージをすべてのクライアントにブロードキャスト
            for client in clients:
                await client.send(message)

    finally:  # クライアントが切断された
        print('chat-接続が切断されました。')
        # クライアントのWebSocket接続をclientsセットから削除
        clients.remove(websocket)


# WebSocketサーバーを起動
start_server = websockets.serve(handle_client, 'localhost', 8766)
print('chat-サーバー起動中...')

# イベントループの開始
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
