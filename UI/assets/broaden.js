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

        var each_tr = `<td class="table-primary text-start">${arr[i]}</td>`;
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
}

export function TaoCauHoi(arr)
{
    $('#ls_slides').empty();
    $('#value_cr').html('CR:');
    var html = ``;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            console.log(`So sánh: ${i} với ${j}`);
            html += `<div class="carousel-item ${i+j == 1? 'active': ""}" id="slide_${i}_${j}">
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
    if(arr.length > 2){
        $('#so_sanh_cap').removeClass('d-none');
    }else{
        $('#so_sanh_cap').addClass('d-none');
    }
}

