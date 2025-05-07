import { TaoBang } from './broaden.js';
import { TaoCauHoi } from './broaden.js';
import { genChoices } from './broaden.js';
import { TaoBangPhuongAn } from './broaden.js';
import { TaoBangTamLuuAo } from './broaden.js';


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
            url: "http://localhost:8000/tim_nganh", 
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
            url: "http://localhost:8000/tim_tp",  // đường dẫn đến API
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
            url: "http://localhost:8000/tim_truong", 
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
    $('#select_school').select2({
        placeholder: "Chọn trường",
        width: '100%',
        allowClear: true,
        ajax: {
            url: "http://localhost:8000/getUni",  // đường dẫn đến API
            dataType: 'json',
            contentType: "application/json",
            type: "POST",
            delay: 250,
            data: function (params) {
                return JSON.stringify({
                    keyword: params.term ?? '' // Gửi đúng JSON format
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
            url: "http://localhost:8000/getMajor",
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
    if(selectedTexts.length > 0) {
        $("#tb_rank_head").removeClass('d-none');
    }else{
        $("#tb_rank_head").addClass('d-none');
    }
});


$('#multiSelect').on('select2:unselect ', function (e) {
    var selectedTexts = $('#multiSelect').select2('data').map(item => item.text);
    TaoBang(selectedTexts);
    TaoCauHoi(selectedTexts);
    if(selectedTexts.length > 0) {
        $("#tb_rank_head").removeClass('d-none');
    }else{
        $("#tb_rank_head").addClass('d-none');
    }
});

$("#tao_mt_phuongan").on('click', function () {
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    if(danhSach.length > 0)
    {
        TaoBangPhuongAn();
        TaoBangTamLuuAo();
        capNhatTienTrinh(80);
        $('#section_pas').removeClass('d-none');
        document.getElementById('section_pas').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    else{
        
    }
    
});


