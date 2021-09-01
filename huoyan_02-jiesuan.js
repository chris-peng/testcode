var activeIndex = 5;
var normaAclIndex = 6;
var fakeAcIndex = 7;
var fackPercentIndex = 8;
var feeIndex = 9;
var priceIndex = 10;

var activeCountLimit = -1;

function runrun(){

    var table = document.querySelectorAll('.ant-table-tbody')[0];
    if(!table){
        alert('未检测到数据表格，请联系...');
        return;
    }

    var percents = prompt('输入扣除百分比（激活数,平均激活单价）:', '10,0');
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
        columns[fackPercentIndex].innerText = (Math.round(fackPercent.toFixed(2)*100)/100) + '%';
        columns[feeIndex].innerText = Math.round(fee.toFixed(2) * 100)/100;
        columns[priceIndex].innerText = Math.round(price.toFixed(2)*100)/100;
    }
}
