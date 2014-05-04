function getreq(opt, cb){
  var params = {
    type:"GET", 
    async:true,
    error:function(e){
      cb(e);
    },
    success: function(data,res) {
     cb(null , data , res);
    }
  }  
  for(var i in opt ){
    params[i] = opt[i];
  }
  $.ajax(params);
}
function postreq(opt, cb){
  var params = {
    type:"POST", 
    async:true,
    error:function(e){
      cb(e);
    },
    success: function(data,res) {
     cb(null , data , res);
    },
  }  
  for(var i in opt ){
    params[i] = opt[i];
  }
  $.ajax(params);
}
(function($){
  $.nano = function(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
      var keys = key.split("."), value = data[keys.shift()];
      $.each(keys, function () { value = value[this]; });
      return (value === null || value === undefined) ? "" : value;
    });
  };
})(jQuery);
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}