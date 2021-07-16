var activeIndex = 4;
var normaAclIndex = 5;
var fakeAcIndex = 6;
var fackPercentIndex = 7;
var feeIndex = 8;
var priceIndex = 9;

var activeCountLimit = -1;

function runrun(){

    var table = document.querySelectorAll('.ivu-table-body table')[1];
    if(!table){
        alert('未检测到数据表格，请联系...');
        return;
    }

    var percents = prompt('输入扣除百分比（激活数,平均激活单价）:', '10,5');
    if(percents == null){
        return;
    }
    percents = percents.split(',');
    var activeDeductPercent = parseFloat(percents[0]) / 100;
    var priceDeductPercent = parseFloat(percents[1]) / 100;

    var rows = table.querySelectorAll('tr');
    for(var i = 0; i < rows.length; i++){
        var row = rows[i];
        var columns = row.querySelectorAll('td span');

        var active = parseFloat(columns[activeIndex].innerText);

        if(active < activeCountLimit){
            continue;
        }

        var normalAc = parseFloat(columns[normaAclIndex].innerText);
        var fakeAc = parseFloat(columns[fakeAcIndex].innerText);
        var fackPercent = parseFloat(columns[fackPercentIndex].innerText);
        var fee = parseFloat(columns[feeIndex].innerText);
        var price = parseFloat(columns[priceIndex].innerText);

        price = Math.round((price - (price * priceDeductPercent)) * 100) / 100;
        active = active - Math.floor(active * activeDeductPercent);
        normalAc = active - fakeAc;
        fackPercent = Math.round((fakeAc / active) * 10000) / 100;
        fee = Math.round(price * normalAc * 100) / 100;
        
        if(active <= fakeAc){
            continue;
        }

        columns[activeIndex].innerText = active;
        columns[normaAclIndex].innerText = normalAc;
        columns[fackPercentIndex].innerText = fackPercent.toFixed(2) + '%';
        columns[feeIndex].innerText = fee.toFixed(2);
        columns[priceIndex].innerText = price.toFixed(2);
    }
}
