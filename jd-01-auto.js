function interceptintercept(content, resp){
    console.log(content, resp);
    var json = JSON.parse(content);
    if(resp.config.url.indexOf('/cpvapi/predict/info?') >= 0){
      var data = json.data;
      data.activeNum = 2119;
      data.normalNum = 2109;
      data.cheatRate = 0.47;
      data.predictCost = 16859.4;
      data.avgActivePrice = 7.99;
      console.log('json', json);
      return JSON.stringify(json);
    }
    else if(resp.config.url.indexOf('/cpvapi/predict/list?') >= 0){
      var data = json.data;
      data[0].activeNum = 1405;
      data[0].normalNum = 1405;
      
      data[1].activeNum = 712;
      data[1].normalNum = 702;
      data[1].cheatRate = 1.4;
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
