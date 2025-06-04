import { TaoBang } from './broaden.js';
import { TaoCauHoi } from './broaden.js';
import { genChoices } from './broaden.js';
import { TaoBangPhuongAn } from './broaden.js';
import { TaoBangTamLuuAo } from './broaden.js';
import { genBangExcel } from './broaden.js';
import { genChoicesMuti } from './broaden.js';
import { checkBang } from './broaden.js';
import { GenCauHoiEx } from './broaden.js';


$(document).ready(function () {


    $('#multiSelect').select2({
        width: '100%',
        placeholder: "Chọn các tiêu chí",
        allowClear: true
    });
    $('#chon_kv').select2({
        width: '100%',
        placeholder: "Chọn khu vực",
    });
    $('#chon_nganh').select2({
        placeholder: "Chọn ngành học",
        width: '100%',
        ajax: {
            url: url + "tim_nganh",
            dataType: 'json',
            contentType: "application/json",
            type: "POST",
            delay: 250,
            data: function (params) {
                return JSON.stringify({
                    keyword: params.term ?? ''
                });
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        return {
                            id: item.id,
                            text: item.name
                        };
                    })
                };
            },
            cache: true
        },
    });
    $('#chon_tp').select2({
        placeholder: "Chọn thành phố / tỉnh",
        width: '100%',
        ajax: {
            url: url + "tim_tp",  // đường dẫn đến API
            dataType: 'json',
            contentType: "application/json",
            type: "POST",
            delay: 250,
            data: function (params) {
                return JSON.stringify({
                    keyword: params.term ?? '',
                    region: $("#chon_kv").val() // Gửi đúng JSON format
                });
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        return {
                            id: item.id,
                            text: item.name
                        };
                    })
                };
            },
            cache: true
        },
    });
    $('#chon_truong').select2({
        placeholder: "Chọn trường",
        width: '100%',
        ajax: {
            url: url + "tim_truong",
            dataType: 'json',
            contentType: "application/json",
            type: "POST",
            delay: 250,
            data: function (params) {
                return JSON.stringify({
                    keyword: params.term ?? '',
                    region: $("#chon_tp").val() ?? 0,
                    id_nganh: $("#chon_nganh").val() ?? 0
                });
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        return {
                            id: item.id,
                            text: item.name
                        };
                    })
                };
            },
            cache: true
        },
    });
    $('#select_major').select2({
        width: '100%',
        placeholder: "Chọn ngành",
        allowClear: true,
        ajax: {
            url: url + "getMajor",
            dataType: 'json',
            contentType: "application/json",
            type: "POST",
            delay: 250,
            data: function (params) {
                return JSON.stringify({
                    matruong: $('#select_school').val(),
                    keyword: params.term ?? ''
                });
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        return {
                            id: item.id,
                            text: item.name
                        };
                    })
                };
            },
            cache: true
        },
    });

    // Khi chọn trường
    $('#chon_kv').on('select2:select', function (e) {
        $('#chon_tp').val(null).trigger('change');
    });

    // Khi chọn trường
    $('#chon_nganh').on('select2:select', function (e) {
        $('#chon_truong').val(null).trigger('change');
    });

    // Khi chọn trường
    $('#select_school').on('select2:select', function (e) {
        $('#select_major').val(null).trigger('change');
    });

    // Khi xóa lựa chọn trường
    $('#select_school').on('select2:clear', function (e) {
        $('#select_major').val(null).trigger('change');
    });

    ///Bắt sự kiện thêm phương án
    $("#themphuonganbtn").on('click', function () {
        genChoices();
    });
});


$('#multiSelect').on('select2:select', function (e) {
    var selectedTexts = $('#multiSelect').select2('data').map(item => item.text);
    TaoBang(selectedTexts);
    TaoCauHoi(selectedTexts);
    if (selectedTexts.length > 0) {
        $('#tb_rank_head').addClass('visible');
    }
});


$('#multiSelect').on('select2:unselect ', function (e) {
    var selectedTexts = $('#multiSelect').select2('data').map(item => item.text);
    TaoBang(selectedTexts);
    TaoCauHoi(selectedTexts);
    if (selectedTexts.length < 1) {
        $("#tb_rank_head").removeClass('visible');
    }
});

$("#tao_mt_phuongan").on('click', function () {
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    if (danhSach.length > 0) {
        TaoBangPhuongAn();
        TaoBangTamLuuAo();
        capNhatTienTrinh(80);
        $('#section_pas').removeClass('d-none');
        document.getElementById('section_pas').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    else {

    }
});

function CustomMTClick()
{
    TaoBangPhuongAn();
    TaoBangTamLuuAo();
    _import = 1;
}
$("#importfile").on('click', function () {
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('importFile'));
    if (modal) {
        modal.hide();
    }
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Vui lòng chọn file!');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8000/ImportExcel', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Upload failed");
            return response.json();
        })
        .then(data => {
            swal("Thành công!", "Bạn đã nhập vào excel!", "success");
            console.log(data);
            TaoBang(data.sheet1.label);
            $('#tb_rank_head').addClass('visible');
            // console.log("checkk: "+ data.check.error)
            checkBang(data.check.error);
            TaoCauHoi(data.sheet1.label);
            genBangExcel(data.sheet1.matran);
            sendMatrix(data.sheet1.matran, data.sheet1.full);
            updateMultiSelect(data.sheet1.full);
            GenCauHoiEx(data.sheet1.matran);
            genChoicesMuti(data.sheet2.ghichu);
            // $("#tao_mt_phuongan").click();
            CustomMTClick()
            genCacMaTranPhuongAn(data.sheet2.data);
            trickger();
            
        })
        .catch(error => {
            console.error(error);
            alert('Có lỗi khi tải file!');
        });
})

function updateMultiSelect(apiData) {
    const $select = $('#multiSelect');

    // Lấy danh sách các ID hiện tại trong <select>
    const existingValues = $select.find('option').map(function () {
        return this.value;
    }).get();

    // Lặp qua dữ liệu từ API
    apiData.forEach(function (item) {
        if (!existingValues.includes(item.id)) {
            // Nếu chưa có thì thêm option mới
            const newOption = new Option(item.text, item.id, false, false);
            $select.append(newOption);
        }
    });

    // Lấy danh sách ID cần chọn
    const selectedIds = apiData.map(item => item.id);

    // Cập nhật giá trị đã chọn và trigger Select2 để hiển thị
    $select.val(selectedIds).trigger('change');
}


$("#exportExcelBtn").on('click', function (event) {
    event.preventDefault();
    const payload = getFullExcel();

    downloadExcel(payload)

})

// 1) Hàm format thời gian hiện tại thành chuỗi YYYYMMDD_HHMMSS
  function getTimestamp() {
    const now = new Date();
    const pad2 = n => n.toString().padStart(2, '0');

    const year  = now.getFullYear();
    const month = pad2(now.getMonth() + 1);
    const day   = pad2(now.getDate());
    const hour  = pad2(now.getHours());
    const min   = pad2(now.getMinutes());
    const sec   = pad2(now.getSeconds());

    return `${year}${month}${day}_${hour}${min}${sec}`;
  }
async function downloadExcel(payload) {
    try {
      // Gọi API, yêu cầu response dưới dạng blob
      const response = await fetch("http://localhost:8000/full_excel_v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      // 3) Lấy blob từ response
      const blob = await response.blob();

      // 4) Tạo URL tạm thời cho blob
      const url = window.URL.createObjectURL(blob);

      // 5) Tạo phần tử <a> ẩn, gán href = URL blob, download = fileName
      const link = document.createElement("a");
      const timestamp = getTimestamp();
      const fileName = `AHP_${timestamp}.xlsx`; 
      link.href = url;
      link.download = fileName;

      // 6) Thêm vào DOM và click để kích hoạt download
      document.body.appendChild(link);
      link.click();

      // 7) Dọn dẹp: remove link và revoke URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Lỗi khi tải file Excel:", err);
      alert("Không tải được file. Vui lòng thử lại.");
    }
  }