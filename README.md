# AHP Hỗ Trợ Chọn Trường và Ngành Học

## Giới Thiệu
Đây là một hệ thống hỗ trợ ra quyết định dựa trên phương pháp **AHP (Analytic Hierarchy Process)** để giúp người dùng lựa chọn trường và ngành học phù hợp. Hệ thống bao gồm một **API backend** được viết bằng **Python** và một **giao diện frontend** sử dụng **HTML, jQuery** để hiển thị kết quả.

## Công Nghệ Sử Dụng
- **Backend:** Python (Flask hoặc FastAPI)
- **Frontend:** HTML, jQuery, Bootstrap
- **Cơ sở dữ liệu:** chưa cập nhật
- **Thư viện hỗ trợ:** NumPy, Pandas

## Chức Năng Chính
1. **Nhập Dữ Liệu**
   - Người dùng nhập các tiêu chí đánh giá trường học và ngành học.
   - Hệ thống yêu cầu người dùng so sánh cặp các tiêu chí để tạo ma trận AHP.

2. **Xử Lý Tính Toán AHP**
   - Chuẩn hóa ma trận so sánh cặp.
   - Tính trọng số của từng tiêu chí.
   - Kiểm tra chỉ số nhất quán CR.
   - Tính toán mức độ ưu tiên của các trường/ngành dựa trên trọng số.

3. **Hiển Thị Kết Quả**
   - Hiển thị danh sách các trường/ngành được đề xuất theo mức độ ưu tiên.
   - Vẽ biểu đồ trực quan nếu cần.

## Hướng Dẫn Cài Đặt
### 1. Cài đặt Python và các thư viện cần thiết
```sh
pip install numpy pandas flask
```
(Nếu dùng FastAPI thay vì Flask thì cài `fastapi` và `uvicorn`)

### 2. Chạy API Backend
```sh
python app.py
```

### 3. Chạy Frontend
- Mở file `index.html` trong trình duyệt.

## API Endpoints
### `POST /calculate-ahp`
- **Mô tả:** Nhận dữ liệu từ frontend và tính toán AHP.
- **Dữ liệu đầu vào:** Ma trận so sánh cặp từ người dùng.
- **Dữ liệu đầu ra:** Kết quả xếp hạng các trường/ngành học.

## Cấu Trúc Thư Mục
```
AHP-School-Selection/
│── backend/
│   │── app.py  # API xử lý tính toán AHP
│   │── ahp.py  # Hàm tính toán AHP
│
│── frontend/
│   │── index.html  # Giao diện nhập dữ liệu
│   │── main.js  # Xử lý frontend với jQuery
│   │── styles.css  # CSS tùy chỉnh
│
│── README.md  # Tài liệu mô tả dự án
```

## Đóng Góp
- Nếu bạn muốn đóng góp, vui lòng fork repo, tạo pull request và gửi phản hồi.

## Liên Hệ
- **Tác giả:** [Tên của bạn]
- **Email:** [Email của bạn]
- **Github:** [Link GitHub của bạn]

Cảm ơn bạn đã quan tâm đến dự án! 🚀

