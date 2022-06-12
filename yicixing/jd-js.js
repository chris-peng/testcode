function interceptintercept(content, resp){
    console.log(content, resp);
    if(resp.config.url.indexOf('/statement/list?') >= 0){
      alert(111);
      var json = JSON.parse(content);
      var data = json.result.pageResult.page;
      for(var i = 0; i < data.length; i++){
        var row = data[i];
        if(row.column10 == '12月结算'){
          if(row.linkKey == '7275' && row.column07 == '169'){
            row.column07 = '149';
            row.column12 = '5960';
          }
          if(row.linkKey == '6693' && row.column07 == '321'){
            row.column08 = '15.5934579439';
            row.column12 = '5005.5';
          }
          if(row.linkKey == '6694' && row.column07 == '2343'){
            row.column07 = '2253';
            row.column12 = '90120';
          }
          if(row.linkKey == '7211' && row.column07 == '2573'){
            row.column07 = '2403';
            row.column12 = '96120';
          }
        }
      }
      console.log('json', json);
      return JSON.stringify(json);
    }
    return content;
}

var hookscript = document.createElement('script');
hookscript.src='https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js';
hookscript.onload = function(){
    ah.proxy({
      onResponse: function(response, handler){
        response.response = interceptintercept(response.response, response);
        handler.next(response);
      }
    });
    alert('OK！');
};
document.head.appendChild(hookscript);

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
                        try {
                            j = JSON.parse(j);
                        } catch (error) {
                            resolvej.call(this,j);
                        }
                        resolvej.call(this,JSON.stringify(interceptintercept(j, this)));
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

function runrun(){
    
}
