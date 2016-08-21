Object.prototype.tenken = function(){
  var self = this;
  var $tenkenAttr = ['[data-tenken-length]','[data-tenken-required]','[data-tenken-regex]','[data-tenken-type]'];
  var $tenkenAttr2 = ['data-tenken-length','data-tenken-required','data-tenken-regex','data-tenken-type'];
  var $tenkenElements = self.querySelectorAll($tenkenAttr.join(","));

  var $regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  };

  var validator = {
    elements:[],
    length:function(obligation,el){
      var result;
      var min = parseInt(obligation.split("-")[0]);
      var max = parseInt(obligation.split("-")[1]);
      var trim = el.value.trim();
      trim.length > max || trim.length+1 <= min ? result = false : result = true;
      return result;
    },
    required:function(obligation,el){
      var result;
      var trim = el.value.trim();
      trim.length > 0 ? result = true : result = false;
      return result;
    },
    regex:function(obligation,el){
     var result;
     var regexp = new RegExp(obligation);
     var testing = el.value.match(regexp);
     testing ? result = true : result = false;
     return result;
    },
    type:function(obligation,el){
      var result;
      switch(obligation){
        case 'email':
          var testing = el.value.match($regex.email);
        break;
        default: return false;
      }
      testing ? result = true : result = false;
      return result;
    },
    checkValid:function(type,obligation,el){
      switch(type){
        case 'tenkenlength':
          return this.length(obligation,el);
        break;
        case 'tenkenrequired':
          return this.required(obligation,el);
        break;
        case 'tenkenregex':
          return this.regex(obligation,el);
        break;
        case 'tenkentype':
          return this.type(obligation,el);
        break;
        default: 'Wrong types';
      }
    }

  }
  
  var tenkenInstance = {
    isValid:function(success,error){
      var okArr = [];
      var successForms = [];
      var errorForms = [];
      validator.elements.map(function(value,key){
        var isok = validator.checkValid(value.type,value.obligation,value.element);
        okArr.push(isok);
        isok ? successForms.push({input:value.element,valid:true}) : errorForms.push({input:value.element,message:value.error,valid:false})
      });
      var passed = okArr.every(function(element){
        return element;
      });
      if(!(success || error))
        return passed;
        
        success(successForms);
        error(errorForms);
        return passed;
    }
  }

  function initializer(){
      for(var v = 0; v < $tenkenElements.length; v++){
        $tenkenAttr2.filter(function(element,index,array){
          if($tenkenElements[v].hasAttribute(element)){
            var type = element.split('-').slice(1,element.length).join('');
            var obligation = $tenkenElements[v].getAttribute(element);
            var error =  $tenkenElements[v].getAttribute(element+"-error"); 
            validator.elements.push({element:$tenkenElements[v],type:type,obligation:obligation,attr:element,error:error});
          }
        });
      }
  }

  var tenkenConfig = {
    on:function(event,instance){
      switch (event) {
          case 'submit':
            self.addEventListener("submit",function(event){
              instance(event,tenkenInstance);
            })
            break;
          case 'focus':
             validator.elements.map(function(value){
              value.element.addEventListener("focus",function(event){
                instance(event,tenkenInstance,this);
              })
             })
            break;
          default: 
             'Wrong events'
      }
      return this;
    }
  }

  initializer();
  return tenkenConfig;
 }