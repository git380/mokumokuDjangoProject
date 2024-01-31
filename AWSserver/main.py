import subprocess

# notionサーバを実行
notion = subprocess.Popen(['../.venv/Scripts/python', 'notion.py'], start_new_session=True)

# チャットサーバを実行
chat = subprocess.Popen(['../.venv/Scripts/python', 'chat.py'], start_new_session=True)

# キャンバスサーバを実行
canvas = subprocess.Popen(['../.venv/Scripts/python', 'canvas.py'], start_new_session=True)

pseudo_lambda = subprocess.Popen(['../.venv/Scripts/python', 'pseudo_lambda.py'], start_new_session=True)

notion.wait()
chat.wait()
canvas.wait()
