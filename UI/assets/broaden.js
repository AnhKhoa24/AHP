export function TaoBang(arr) {
    $('#phap_su_trung_hoa').val(arr.length);
    if (arr.length == 0) {
        $('#tb_matrix').empty();
        $('#tr_matrix').empty();
        return;
    }
    var tr_html = `<th></th>`;
    $('#tb_matrix').empty();
    for (let i = 0; i < arr.length; i++) {
        tr_html += `<th style="min-width: 150px; ${arr[i] === 'null' ? 'background-color: red; color: white;' : ''}">${arr[i]}</th>`;

        var each_tr = `<td style="padding: 6px; min-width: 150px;${arr[i] === 'null' ? 'background-color: red; color: white;' : ''}" class="border-bottom border-light fw-bold table-primary text-center">${arr[i]}</td>`;
        for (let j = 0; j < arr.length; j++) {
            if (i == j) {
                each_tr += ` <td><input type="text" oninput="FixDuongCheoChinh(this)" value=1 class="form-control text-center rounded-0 bg-warning" id="td_${i}_${j}" readonly></td>`
            }
            else {
                each_tr += ` <td><input type="text" oninput="NhapOTrucTiep(${i},${j})" class="form-control text-center rounded-0 ${i > j ? 'bg-info' : ''}" id="td_${i}_${j}" ${i > j ? 'readonly' : ''}
"></td>`
            }
        }
        var full_tr = `<tr>${each_tr}</tr>`;
        $('#tb_matrix').append(full_tr);
    }
    $('#tr_matrix').html(tr_html);
    TaoBangDanhGia(arr);
}

export function checkBang(arr) {
  for (let i = 0; i < arr.length; i++) {
    const $el = $(`#td_${arr[i].x}_${arr[i].y}`);

    if ($el.hasClass("bg-warning")) {
      $el.removeAttr("readonly");
    }

    $el.removeClass("bg-warning bg-info")
       .addClass("bg-danger");
  }
}


function TaoBangDanhGia(arr) {
    $('#tb_rank').empty();
    arr.forEach(function (item, index) {
        var html = `<tr><td style="padding: 7.2px;">${item}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>`;
        $('#tb_rank').append(html);
    });
}

export function TaoCauHoi(arr) {
    $('#ls_slides').empty();
    $('#value_cr').html('CR:');
    var html = ``;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            html += `<div class="carousel-item ${i + j == 1 ? 'active' : ""}" id="slide_${i}_${j}">
                            <div
                                class="container input-range-container d-flex flex-column justify-content-center align-items-center p-4">
                                <label for="range1" class="form-label text-center w-100 text-light">${i}.${j}) So sánh ${arr[i]} với ${arr[j]}</label>
                                <div class="mb-3 d-flex align-items-center">
                                    <input type="range" id="range_${i}_${j}" oninput="genRange(${i}, ${j})" class="form-range" min="0" max="16" step="1" style="width: 200px">
                                    <span id="value_${i}_${j}" class="ms-5 text-light">1</span>
                                </div>
                            </div>
                        </div>`;
        }
    }
    $('#ls_slides').html(html);
    $('#carouselExampleCaptions').off('slid.bs.carousel').on('slid.bs.carousel', function () {
        let activeId = $(this).find('.carousel-item.active').attr('id'); // ví dụ: slide_0_2
        let tdId = activeId.replace('slide', 'td'); // Kết quả: td_0_2
        console.log('Tìm thấy phần tử:', tdId);

    });
    if (arr.length > 2) {
        $('.so_sanh_cap').addClass('visible');
    } else {
        $('.so_sanh_cap').removeClass('visible');
    }
}

export function GenCauHoiEx(matrix){
    let myArray = ['1/9', '1/8', '1/7', '1/6', '1/5', '1/4', '1/3', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for(let i = 0; i < matrix.length; i ++){
        for(let j = 1; j < matrix.length; j ++){
            if(j > i){
                let idx = myArray.indexOf(matrix[i][j]);
                $(`#range_${i}_${j}`).val(idx);
                $(`#value_${i}_${j}`).text(matrix[i][j]);
            }
        }
    }
}

export function genChoices() {
    var html = `<tr>
    <td class="pt-1 pb-1 text-center truong" style="width: 45%">` + $('#chon_truong option:selected').text() + `</td>
    <td class="pt-1 pb-1 text-center nganh" style="width: 25%">` + $('#chon_nganh option:selected').text() + `</td>
    <td class="pt-1 pb-1 text-center kihieu" style="width: 20%">` + $('#chon_truong').val() + '-' + vietTat($('#chon_nganh option:selected').text()) + `</td>
    <td class="text-center align-middle" style="width: 10%">
    <div class="d-flex justify-content-center pt-1 pb-1">
        <button onclick="BoLuaChon(this)" class="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style="width: 28px; height: 28px; margin-right: 4px;">
            <i class="bi bi-trash"></i>
        </button>
    </div>
</td>

</tr>`;
    $('#tb_school').append(html);
}

export function genChoicesMuti(arr) {
    $('#tb_school').empty();
    for (let i = 0; i < arr.truong.length; i++) {
        var html = `<tr>
    <td class="pt-1 pb-1 text-center truong" style="width: 45%">` + arr.truong[i] + `</td>
    <td class="pt-1 pb-1 text-center nganh" style="width: 25%">` + arr.nganhhoc[i] + `</td>
    <td class="pt-1 pb-1 text-center kihieu" style="width: 20%">` + arr.kihieu[i] + `</td>
    <td class="text-center align-middle" style="width: 10%">
    <div class="d-flex justify-content-center pt-1 pb-1">
        <button onclick="BoLuaChon(this)" class="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style="width: 28px; height: 28px; margin-right: 4px;">
            <i class="bi bi-trash"></i>
        </button>
    </div>
</td>

</tr>`;
        $('#tb_school').append(html);
    }
}

function vietTat(chuoi) {
    return chuoi
        .split(/\s+/)
        .filter(tu => tu.length > 0)
        .map(tu => tu[0].toUpperCase())
        .join('');
}

function BangPhuongAn(tieuchi_text, tieuchi_id) {
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    var tHead = `<thead class="table-primary"><tr><th>${tieuchi_text}</th>`;
    for (let i = 0; i < danhSach.length; i++) {
        tHead += `<th>${danhSach[i]}</th>`;
    };
    tHead += `</tr></thead>`;

    var tBody = `<tbody>`;
    for (let i = 0; i < danhSach.length; i++) {
        let each_tr = `<tr><td class="table-primary text-center border-bottom border-light fw-bold" style="width:30%">${danhSach[i]}</td>`;
        for (let j = 0; j < danhSach.length; j++) {
            if (i == j) {
                each_tr += ` <td><input type="text" value=1 class="form-control text-center rounded-0 bg-warning" id="${tieuchi_id}_${i}_${j}" readonly></td>`
            }
            else {
                var htmlfunc = `oninput="nhapmatran('${tieuchi_id}',${i},${j})"`;
                each_tr += ` <td><input type="text" class="form-control text-center rounded-0 ${i > j ? 'bg-info' : ''} ahp-only" id="${tieuchi_id}_${i}_${j}" ${i > j ? 'readonly' : htmlfunc}></td>`
            }
        };
        each_tr += `</tr>`;
        tBody += each_tr;
    };

    tBody += `<tr><td style="padding: 5px;" colspan="${danhSach.length}">CR:</td><td class="cr_phuongan" id="cr_${tieuchi_id}" style="padding: 5px;"></td></tr></tbody>`;

    return `<div class="col-md-6 mb-2"><table class="table table-bordered text-center" id="bangpa_${tieuchi_id}">` + tHead + tBody + `</table></div>`;
}
export function TaoBangPhuongAn() {
    var listTC = $('#multiSelect').select2('data')
    $("#list_bang_phuong_an").empty();
    listTC.forEach(function (item, index) {
        $("#list_bang_phuong_an").append(BangPhuongAn(item.text, item.id));
    });
}


export function TaoBangTamLuuAo() {
    var tieuchis = $('#multiSelect').select2('data').map(({ id, text }) => ({ id, text }));
    var html_TH = `<tr><th></th>`;
    tieuchis.forEach(function (item, index) {
        html_TH += `<th id="thCW_${item.id}">${item.text}</th>`;
    });
    html_TH += `</tr>`;
    $('#cw_head').html(html_TH);
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();

    $("#cw_body").empty();
    danhSach.forEach(function (item, index) {
        var tr_temp = `<tr><td>${item}</td>`;
        tieuchis.forEach(function (item2, index2) {
            tr_temp += `<td id="cw_${item2.id}_${index}"></td>`;
        });
        tr_temp += `</tr>`;
        $("#cw_body").append(tr_temp);
    });
}


////các hàm get data save

function getTieuChi() {
    return $('#multiSelect').select2('data').map(({ id, text }) => ({ id, text }));
}
function getMaTranTieuChi() {
    matrixLegth = $('#phap_su_trung_hoa').val();
    var matrix = new Array(matrixLegth);
    for (let i = 0; i < matrixLegth; i++) {
        matrix[i] = new Array(matrixLegth);
        for (let j = 0; j < matrixLegth; j++) {
            matrix[i][j] = $(`#td_${i}_${j}`).val();
        }
    }
    return matrix;
}



///Gen bảng từ excel 
export function genBangExcel(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            $(`#td_${i}_${j}`).val(arr[i][j])
        }
    }
}
export function GenCauHoi(arr) {
    $('#ls_slides').empty();
    $('#value_cr').html('CR:');
    var html = ``;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            // console.log(`So sánh: ${i} với ${j}`);
            html += `<div class="carousel-item ${i + j == 1 ? 'active' : ""}" id="slide_${i}_${j}">
                            <div
                                class="container input-range-container d-flex flex-column justify-content-center align-items-center p-4">
                                <label for="range1" class="form-label text-center w-100 text-light">${i}.${j}) So sánh ${arr[i]} với ${arr[j]}</label>
                                <div class="mb-3 d-flex align-items-center">
                                    <input type="range" id="range_${i}_${j}" oninput="genRange(${i}, ${j})" class="form-range" min="0" max="16" step="1" style="width: 200px">
                                    <span id="value_${i}_${j}" class="ms-5 text-light">${arr[i][j]}</span>
                                </div>
                            </div>
                        </div>`;
        }
    }
    $('#ls_slides').html(html);
    $('#carouselExampleCaptions').off('slid.bs.carousel').on('slid.bs.carousel', function () {
        let activeId = $(this).find('.carousel-item.active').attr('id'); // ví dụ: slide_0_2
        let tdId = activeId.replace('slide', 'td'); // Kết quả: td_0_2
        console.log('Tìm thấy phần tử:', tdId);

    });
    if (arr.length > 2) {
        $('.so_sanh_cap').addClass('visible');
    } else {
        $('.so_sanh_cap').removeClass('visible');
    }
}