from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

ROW_HEIGHT = 25
MARGIN_X = 40
PAGE_HEIGHT = A4[1]

# Đăng ký font Unicode tiếng Việt
pdfmetrics.registerFont(TTFont("Roboto-Regular", "UI/fonts/Roboto-Regular.ttf"))

def draw_table(c, data, x_start, y_start, col_widths, font_name="Roboto-Regular", font_size=11):
    global ROW_HEIGHT
    for row_index, row in enumerate(data):
        y = y_start - row_index * ROW_HEIGHT
        x = x_start
        for col_index, cell in enumerate(row):
            c.rect(x, y - ROW_HEIGHT, col_widths[col_index], ROW_HEIGHT, stroke=1, fill=0)
            c.setFont(font_name, font_size)
            c.drawString(x + 4, y - ROW_HEIGHT + 7, str(cell))
            x += col_widths[col_index]
    return y - len(data) * ROW_HEIGHT

def check_page_space(c, y, rows_needed, row_height=ROW_HEIGHT):
    needed_space = rows_needed * row_height + 60
    if y < needed_space:
        c.showPage()
        c.setFont("Roboto-Regular", 12)
        return PAGE_HEIGHT - 60
    return y

def generate_pdf_from_ahp_data(ahp_data: dict, output_path="output/ahp_dynamic.pdf"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    y = height - 40

    c.setFont("Roboto-Regular", 14)
    c.drawString(MARGIN_X, y, "BÁO CÁO PHÂN TÍCH AHP")
    y -= 40

    # 1. Ma trận so sánh trọng số của các tiêu chí
    y = check_page_space(c, y, len(ahp_data["criteria_matrix"]) + 2)
    c.setFont("Roboto-Regular", 12)
    c.drawString(MARGIN_X, y, "2. Ma trận so sánh trọng số các tiêu chí")
    y -= 25

    matrix = ahp_data["criteria_matrix"]
    col_widths = [100] * len(matrix[0])
    y = draw_table(c, matrix, MARGIN_X, y, col_widths)
    y -= 30

    # 2. Trọng số và xếp hạng tiêu chí
    y = check_page_space(c, y, len(ahp_data["criteria_weights"]) + 2)
    c.setFont("Roboto-Regular", 12)
    c.drawString(MARGIN_X, y, "3. Trọng số và xếp hạng tiêu chí")
    y -= 25

    weights_table = [["Tiêu chí", "CW", "CV", "SW", "Rank"]]
    for row in ahp_data["criteria_weights"]:
        weights_table.append([
            row["tieu_chi"],
            f'{row["CW"]:.4f}',
            f'{row["CV"]:.4f}',
            f'{row["SW"]:.4f}',
            str(row["rank"])
        ])
    y = draw_table(c, weights_table, MARGIN_X, y, [160, 60, 60, 60, 60])
    y -= 30

    # 3. Hiển thị Lambda_max, CI, CR
    y = check_page_space(c, y, 4)
    c.setFont("Roboto-Regular", 12)
    c.drawString(MARGIN_X, y, "1. Chỉ số đánh giá nhất quán")
    y -= 25
    c.drawString(MARGIN_X, y, f"Lambda_max = {ahp_data['consistency_indices']['lambda_max']:.4f}")
    y -= 20
    c.drawString(MARGIN_X, y, f"CI = {ahp_data['consistency_indices']['CI']:.4f}")
    y -= 20
    c.drawString(MARGIN_X, y, f"CR = {ahp_data['consistency_indices']['CR']:.4f}")
    y -= 30

    # 4. Bảng đánh giá phương án theo từng tiêu chí
    if "alternative_comparison_matrices" in ahp_data:
        c.setFont("Roboto-Regular", 12)
        c.drawString(MARGIN_X, y, "4. Bảng đánh giá phương án theo từng tiêu chí")
        y -= 25

        for crit in ahp_data["alternative_comparison_matrices"]:
            rows_needed = len(crit["matrix"]) + 3
            y = check_page_space(c, y, rows_needed)

            c.setFont("Roboto-Regular", 11)
            c.drawString(MARGIN_X, y, f'- Tiêu chí: {crit["tieu_chi"]}')
            y -= 22

            matrix = crit["matrix"]
            col_widths = [80] * len(matrix[0])
            y = draw_table(c, matrix, MARGIN_X, y, col_widths)
            y -= 10

            c.drawString(MARGIN_X, y, f'CR: {crit["CR"]:.4f}')
            y -= 30

    # 5. Kết quả xếp hạng phương án
    if "alternatives_results" in ahp_data:
        y = check_page_space(c, y, len(ahp_data["alternatives_results"]) + 2)
        c.setFont("Roboto-Regular", 12)
        c.drawString(MARGIN_X, y, "5. Kết quả xếp hạng phương án")
        y -= 25

        alt_table = [["Trường", "Ngành", "Ký hiệu", "CW", "Rank"]]
        for row in ahp_data["alternatives_results"]:
            alt_table.append([
                row["truong"],
                row["nganh"],
                row["ky_hieu"],
                f'{row["CW"]:.4f}',
                str(row["rank"])
            ])
        y = draw_table(c, alt_table, MARGIN_X, y, [180, 100, 80, 60, 60])
        y -= 30

    c.save()
    return output_path

# === DỮ LIỆU AHP CẬP NHẬT ===
if __name__ == "__main__":
    ahp_data = {
        "consistency_indices": {
            "lambda_max": 3.0538,
            "CI": 0.0269,
            "CR": 0.0464
        },
        "criteria_matrix": [
            ["", "Địa điểm", "Môi trường học tập", "Chương trình đào tạo"],
            ["Địa điểm", "1", "2", "3"],
            ["Môi trường học tập", "1/2", "1", "3"],
            ["Chương trình đào tạo", "1/3", "1/3", "1"]
        ],
        "criteria_weights": [
            {"tieu_chi": "Địa điểm", "CW": 0.5247, "CV": 0.5247, "SW": 0.5247, "rank": 1},
            {"tieu_chi": "Môi trường học tập", "CW": 0.3338, "CV": 0.3338, "SW": 0.3338, "rank": 2},
            {"tieu_chi": "Chương trình đào tạo", "CW": 0.1416, "CV": 0.1416, "SW": 0.1416, "rank": 3}
        ],
        "alternative_comparison_matrices": [
            {
                "tieu_chi": "Địa điểm",
                "matrix": [
                    ["", "DDI-CNKMT", "DTC-CNKMT", "SPK-CNKMT", "CDC-CNKMT"],
                    ["DDI-CNKMT", "1", "2", "3", "4"],
                    ["DTC-CNKMT", "1/2", "1", "2", "3"],
                    ["SPK-CNKMT", "1/3", "1/2", "1", "5"],
                    ["CDC-CNKMT", "1/4", "1/3", "1/5", "1"]
                ],
                "CR": 0.0843
            },
            {
                "tieu_chi": "Môi trường học tập",
                "matrix": [
                    ["", "DDI-CNKMT", "DTC-CNKMT", "SPK-CNKMT", "CDC-CNKMT"],
                    ["DDI-CNKMT", "1", "1/2", "2", "4"],
                    ["DTC-CNKMT", "2", "1", "3", "5"],
                    ["SPK-CNKMT", "1/2", "1/3", "1", "2"],
                    ["CDC-CNKMT", "1/4", "1/5", "1/2", "1"]
                ],
                "CR": 0.0359
            },
            {
                "tieu_chi": "Chương trình đào tạo",
                "matrix": [
                    ["", "DDI-CNKMT", "DTC-CNKMT", "SPK-CNKMT", "CDC-CNKMT"],
                    ["DDI-CNKMT", "1", "2", "4", "3"],
                    ["DTC-CNKMT", "1/2", "1", "3", "4"],
                    ["SPK-CNKMT", "1/4", "1/3", "1", "3"],
                    ["CDC-CNKMT", "1/3", "1/4", "1/3", "1"]
                ],
                "CR": 0.0902
            }
        ],
        "alternatives_results": [
            {"truong": "Trường Cao đẳng Công nghệ thông tin - Đà Nẵng", "nganh": "Công nghệ kỹ thuật máy tính", "ky_hieu": "DDI-CNKMT", "CW": 0.4622, "rank": 1},
            {"truong": "Trường Đại học Công nghệ thông tin và Truyền thông - Đại học Thái Nguyên", "nganh": "Công nghệ kỹ thuật máy tính", "ky_hieu": "DTC-CNKMT", "CW": 0.2836, "rank": 2},
            {"truong": "Trường Đại học Sư phạm Kỹ thuật TP.HCM", "nganh": "Công nghệ kỹ thuật máy tính", "ky_hieu": "SPK-CNKMT", "CW": 0.1714, "rank": 3},
            {"truong": "Trường Cao đẳng Công nghệ thông tin TP.HCM", "nganh": "Công nghệ kỹ thuật máy tính", "ky_hieu": "CDC-CNKMT", "CW": 0.0827, "rank": 4}
        ]
    }

    path = generate_pdf_from_ahp_data(ahp_data)
    print(f"✅ PDF đã được tạo tại: {path}")