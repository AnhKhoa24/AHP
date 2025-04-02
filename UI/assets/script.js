import { TaoBang } from './broaden.js';
import { TaoCauHoi } from './broaden.js';

$(document).ready(function () {
    $('#multiSelect').select2({
        width: '100%', 
        placeholder: "Chọn các tiêu chí",
        allowClear: true 
    });
});


$('#multiSelect').on('select2:select', function (e) {
    TaoBang($(this).val()); 
    TaoCauHoi($(this).val());
});


$('#multiSelect').on('select2:unselect ', function (e) 
{
    TaoBang($(this).val()); 
    TaoCauHoi($(this).val());
});



// Các hàm khác bạn cần export từ file này
