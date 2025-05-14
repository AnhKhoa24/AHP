# from connection import get_database
# from Services.upsert_cache import upsert_cache
# from datetime import datetime, timedelta, timezone

# db = get_database()
# collection = db["session_cache"]
# collection.create_index("expireAt", expireAfterSeconds=0)

# _id = upsert_cache(
#     _id="",
#     data={"name": "OnlyName"},
#     key="listsv",
#     expire_at=datetime.now(timezone.utc) + timedelta(minutes=30),
#     collection=collection
# )

# print("Inserted ID:", _id)

import requests
import json
url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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"
}

# payload = {
#     # "model": "meta-llama/llama-4-scout-17b-16e-instruct",
#     "model": "deepseek-r1-distill-llama-70b",
#     "messages": [
#         {
#             "role": "user",
#             "content": "Tôi muốn bạn tạo cho tôi ma trận 3x3 trong AHP sao cho nó có CR thấp hơn 0.1, trả về cho tôi kết quả là json, tôi chỉ cần json ma trận, không cần phải giải thích gì thêm"
#         }
#     ]
# }
payload = {
   "model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "messages": [
        {
            "role": "user",
            "content": """Bạn là một công cụ JSON Generator.
Hãy tạo một ma trận 3x3 dùng trong AHP, sao cho chỉ số CR < 0.1.
Chỉ trả về JSON định dạng [[a11, a12, a13], [a21, a22, a23], [a31, a32, a33]].
Không được giải thích, không được viết thêm bất cứ chữ nào khác ngoài JSON."""
        }
    ]
}


response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    data = response.json()
    content = data['choices'][0]['message']['content']
    try:
        matrix = json.loads(content)
        print("Ma trận AHP:", matrix)
    except Exception as e:
        print("Lỗi khi parse JSON:", e)
        print("Nội dung:", content)
else:
    print("Lỗi:", response.status_code)
    print(response.text)

