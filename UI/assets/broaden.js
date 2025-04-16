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
        tr_html += `<th>${arr[i]}</th>`;

        var each_tr = `<td style="padding: 6px;" class="border-bottom border-light fw-bold table-primary text-center" style="width: 20%">${arr[i]}</td>`;
        for (let j = 0; j < arr.length; j++) {
            if (i == j) {
                each_tr += ` <td><input type="text" value=1 class="form-control text-center rounded-0 bg-warning" id="td_${i}_${j}" readonly></td>`
            }
            else {
                each_tr += ` <td><input type="text" class="form-control text-center rounded-0 ${i > j ? 'bg-info' : ''}" id="td_${i}_${j}" ${i > j ? 'readonly' : ''}
"></td>`
            }
        }
        var full_tr = `<tr>${each_tr}</tr>`;
        $('#tb_matrix').append(full_tr);
    }
    $('#tr_matrix').html(tr_html);
    TaoBangDanhGia(arr);
}

function TaoBangDanhGia(arr) {
    $('#tb_rank').empty();
    arr.forEach(function (item, index)
    {
        var html = `<tr><td style="padding: 7.2px;">${item}</td>
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
            // console.log(`So sánh: ${i} với ${j}`);
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
        $('.so_sanh_cap').removeClass('d-none');
    } else {
        $('.so_sanh_cap').addClass('d-none');
    }
}

export function genChoices() {
    var html = `<tr>
    <td class="pt-1 pb-1 text-center" style="width: 45%">` + $('#select_school option:selected').text() + `</td>
    <td class="pt-1 pb-1 text-center" style="width: 25%">` + $('#select_major option:selected').text() + `</td>
    <td class="pt-1 pb-1 text-center kihieu" style="width: 20%">` + $('#select_school').val() + '-' + $('#select_major').val() + `</td>
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

function BangPhuongAn(tieuchi_text, tieuchi_id) {
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    var tHead = `<thead class="table-primary"><tr><th>${tieuchi_text}</th>`;
    for(let i = 0; i < danhSach.length; i++){
        tHead += `<th>${danhSach[i]}</th>`;
    };
    tHead += `</tr></thead>`;

    var tBody = `<tbody>`;
    for(let i = 0; i < danhSach.length; i++){
        let each_tr = `<tr><td class="table-primary text-center border-bottom border-light fw-bold" style="width:30%">${danhSach[i]}</td>`;
        for(let j = 0; j < danhSach.length; j++){
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

    tBody += `<tr><td style="padding: 5px;" colspan="${danhSach.length}">CR:</td><td id="cr_${tieuchi_id}" style="padding: 5px;"></td></tr></tbody>`;

    return `<div class="col-md-6"><table class="table table-bordered text-center">`+tHead + tBody + `</table></div>`;
}
export function TaoBangPhuongAn()
{
    var listTC = $('#multiSelect').select2('data')
    $("#list_bang_phuong_an").empty();
    listTC.forEach(function(item, index) {
        $("#list_bang_phuong_an").append(BangPhuongAn(item.text, item.id));
    });
} 