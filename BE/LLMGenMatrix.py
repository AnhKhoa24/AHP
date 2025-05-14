import requests
import json

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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"
}

# === HÀM TẠO PROMPT DYNAMIC CHO AHP n x n ===
def generate_prompt(n):
    return f"""You are a JSON generator that creates pairwise comparison matrices for the Analytic Hierarchy Process (AHP).

Your task is to randomly generate a {n}x{n} AHP matrix with valid values, such that the Consistency Ratio (CR) is strictly less than 0.1.

Each matrix element a_ij must be a string selected from the set:
["1/9", "1/8", "1/7", "1/6", "1/5", "1/4", "1/3", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

The matrix must be:
- Consistent enough to satisfy CR < 0.1
- Reciprocal: a_ji = inverse of a_ij (e.g., if a_12 = "5" then a_21 = "1/5")

⚠️ Output only the raw JSON array (a list of lists of strings), no explanation, no markdown, no comments.
⚠️ Randomize the matrix as long as CR < 0.1 is satisfied.

Return only JSON, for example:
[
  ["1", "3", "4"],
  ["1/3", "1", "2"],
  ["1/4", "1/2", "1"]
]
"""

# def generate_prompt(n):
#     return f"""Bạn là một công cụ JSON Generator.
# Hãy tạo duy nhất một ma trận {n}x{n} sử dụng cho AHP, đảm bảo chỉ số CR < 0.1.
# Mỗi phần tử a_ij trong ma trận phải nằm trong tập sau: 
# ['1/9', '1/8', '1/7', '1/6', '1/5', '1/4', '1/3', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9'].
# Kết quả trả về phải là JSON hợp lệ: danh sách lồng dạng [[a11, a12, ..., a1{n}], ..., [a{n}1, ..., a{n}{n}]].
# Không giải thích, không thêm chữ nào ngoài JSON."""

# def generate_prompt(n):
#     return f"""You are a JSON generator.

# Generate exactly one {n}x{n} pairwise comparison matrix used in the Analytic Hierarchy Process (AHP) such that the Consistency Ratio (CR) is less than 0.1.

# Each element a_ij must be selected from the following fixed set of string values:
# ["1/9", "1/8", "1/7", "1/6", "1/5", "1/4", "1/3", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

# The output must be valid JSON: a nested list of strings with shape {n}x{n}, e.g., [["1", "2"], ["1/2", "1"]]

# ⚠️ Do not include any explanations, comments, markdown formatting, or surrounding text. Output only raw JSON."""
def prompt(n):
    return {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",  
        "temperature": 2,
        "messages": [
            {
                "role": "user",
                "content": generate_prompt(n)
            }
        ]
    }

# def extract_json_array(text):
#     start = text.find('[')
#     end = text.rfind(']')
#     if start == -1 or end == -1 or end < start:
#         raise ValueError("Không tìm thấy đoạn JSON hợp lệ.")
#     return text[start:end + 1]
# def genMatrix(n):
#     response = requests.post(url, headers=headers, json=prompt(n))
#     if response.status_code == 200:
#         data = response.json()
#         content = data['choices'][0]['message']['content']
#         return extract_json_array(content)
#     else:
#         return


def extract_json_array(text):
    start = text.find('[')
    end = text.rfind(']')
    if start == -1 or end == -1 or end < start:
        raise ValueError("Không tìm thấy đoạn JSON hợp lệ.")
    array_str = text[start:end + 1]
    return json.loads(array_str)

def genMatrix(n):
    response = requests.post(url, headers=headers, json=prompt(n))
    if response.status_code == 200:
        data = response.json()
        content = data['choices'][0]['message']['content']
        return extract_json_array(content)  
    return []
