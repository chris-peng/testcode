
function interceptintercept(content, resp){
    console.log(content, resp);
    if(resp.config.url.indexOf('/order/page?') >= 0){
      var json = JSON.parse(content);
      var data = json.result.pageResult.page;
      for(var i = 0; i < data.length; i++){
        var row = data[i];
        if(row.column10 == '10月结算'){
          if(row.linkKey == '7211'){
            row.column07 = '789';
            row.column12 = '31560';
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

function runrun(){
    
}
