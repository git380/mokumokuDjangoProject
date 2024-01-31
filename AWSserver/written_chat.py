import json

# 元チャットデータ
with open('json/chat_history.json', 'r', encoding='utf-8') as json_data:
    chat_history = json.load(json_data)

# 元チャット履歴
with open('json/chat_history_log.json', 'r', encoding='utf-8') as json_data:
    chat_history_log = json.load(json_data)

# チャットデータをチャット履歴に追加
chat_history_log.update(chat_history)

# 新チャット履歴出力
with open("json/chat_history_log.json", "w") as json_data:
    json.dump(chat_history_log, json_data, indent=4)

# 元チャットデータ削除
with open('json/chat_history.json', 'w') as json_data:
    json.dump({}, json_data, indent=4)

##################

# 元グループデータ
with open('json/group_info.json', 'r', encoding='utf-8') as json_data:
    group_info = json.load(json_data)

# 元グループ履歴
with open("json/group_info_log.json", 'r', encoding='utf-8') as json_data:
    group_info_log = json.load(json_data)

# ステータス情報削除
for uuid, info in group_info.items():
    # chat_historyにuuidがない場合保存しない
    if uuid in chat_history:
        for key, name in info[0].items():
            info[0][key] = name[0]
        group_info_log[uuid] = info


# 新グループデータ出力
with open("json/group_info_log.json", "w") as json_data:
    json.dump(group_info_log, json_data, indent=4)

# 元グループデータ削除
with open('json/group_info.json', 'w') as json_data:
    json.dump({}, json_data, indent=4)
