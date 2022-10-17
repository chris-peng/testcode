function interceptintercept(content, resp){
    console.log(content, resp);
    if(resp.url.indexOf('/statement/list?') >= 0){
      var json = JSON.parse(content);
      var data = json.data.result;
      for(var i = 0; i < data.length; i++){
        var row = data[i];
        if(i == 0){
            row.activeNum = 12372;
            row.normalNum = 8507;
            row.cheatNum = 3865;
            row.cheatRate = 31.24;
            row.statementCost = 59719.86;
            row.avgActivePrice = 7.02;
        }
          if(i == 1){
            row.activeNum = 22920;
            row.normalNum = 20625;
            row.cheatNum = 2295;
            row.cheatRate = 10.01;
            row.statementCost = 207075.38;
            row.avgActivePrice = 10.04;
        }
          if(i == 2){
            row.activeNum = 16537;
            row.normalNum = 12795;
            row.cheatNum = 3742;
            row.cheatRate = 22.63;
            row.statementCost = 91612.71;
            row.avgActivePrice = 7.16;
        }
      }
      console.log('json', json);
      return JSON.stringify(json);
    } else if(resp.url.indexOf('/statement/info?') >= 0){
      var json = JSON.parse(content);
      var data = json.data;
        var row = data;
        row.activeNum = 51829;
        row.activeNumPer = 0;
        row.normalNum = 41927;
        row.normalNumPer = 0;
        row.cheatRate = 19.11;
        row.cheatRatePer = 0;
        row.statementCost = 358407.95;
        row.statementCostPer = 0;
        row.avgActivePrice = 8.55;
        row.avgActivePricePer = 0;
      console.log('json', json);
      return JSON.stringify(json);
    }
    return content;
}

var oldfetch = fetch;
fetch = function (url, options={}) {
  return new Promise((resolve, reject) => {
    oldfetch(url, options)
        .then((res)=>{
            var oldjson = res.json;
            res.json=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldjson.call(this).then((j)=>{
                        // resolvej.call(this,interceptintercept(j, this));
                        resolvej.call(this, j);
                    })
                .catch(errj=>{rejectj(errj)})})};
            var oldclone = res.clone;
            res.clone=function(){
                var newRes = oldclone.call(this);
                newRes.clone = this.clone;
                var oldjsonc = newRes.json;
                newRes.json=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldjsonc.call(this).then((j)=>{
                        // resolvej.call(this,interceptintercept(j, this));
                        resolvej.call(this, j);
                    })
                .catch(errj=>{rejectj(errj)})})};
                var oldtextc = newRes.text;
                newRes.text=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldtextc.call(this).then((j)=>{
                        resolvej.call(this,interceptintercept(j, this));
                    })
                .catch(errj=>{rejectj(errj)})})};
                return newRes;
            };
            resolve(res);
        })
        .catch(err => {
            reject(err)
        });

  });
}

var hookscript = document.createElement('script');
hookscript.src='https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js';
hookscript.onload = function(){
    ah.proxy({
      onResponse: function(response, handler){
        response.url = response.config.url;
        response.response = interceptintercept(response.response, response);
        handler.next(response);
      }
    });
    alert('OK！');
};
document.head.appendChild(hookscript);

function runrun(){
    
}
