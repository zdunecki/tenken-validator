Object.prototype.tenken = function(){
  var self = this;
  var $tenkenAttr = ['[data-tenken-length]','[data-tenken-required]','[data-tenken-regex]','[data-tenken-type]','[data-tenken-mixin]'];
  var $tenkenAttr2 = ['data-tenken-length','data-tenken-required','data-tenken-regex','data-tenken-type','data-tenken-mixin'];
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
    mixin:function(mixin,el){
      return mixin(el.value);
    },
    checkValid:function(type,obligation,el,mixin){
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
        case 'tenkenmixin':
          return this.mixin(mixin,el);
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
        var isok = validator.checkValid(value.type,value.obligation,value.element,value.mixin);
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

  function initializer(newElements){
      if(newElements)
        $tenkenElements = newElements;

      for(var v = 0; v < $tenkenElements.length; v++){
       	$tenkenAttr2.filter(function(element,index,array){
          if($tenkenElements[v].hasAttribute(element)){
            var type = element.split('-').slice(1,element.length).join('');
            var obligation = $tenkenElements[v].getAttribute(element);
  					var error =  $tenkenElements[v].getAttribute(element+"-error"); 
            validator.elements.push({element:$tenkenElements[v],type:type,obligation:obligation,attr:element,error:error,mixin:null});
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
          case 'rules':
            var valitaionEl = self.querySelectorAll('input','textarea');
            instance.map(function(value,key){
              var keyNames = Object.keys(value);

              setTimeout(function(){
                if(value.hasOwnProperty("mixin"))
                  validator.elements[key]['mixin'] = value.mixin;
              })

              for (var i in keyNames) {

                  if(typeof keyNames[i]  === 'function')
                    return

                  var attr = keyNames[i];
                  var el = valitaionEl[key];
                  var val = value[attr];
                  var splitUppers = attr.match(/[A-Z]*[^A-Z]+/g);

                  splitUppers[1] === "Error" ? el.setAttribute("data-tenken-"+splitUppers.join("-"),val) : attr != "mixin" ? el.setAttribute("data-tenken-"+attr,val) : el.setAttribute("data-tenken-"+attr,'');

              }

            });
            initializer(self.querySelectorAll($tenkenAttr.join(",")));
          break;
          default: 
             return 'Wrong props';
      }
      return this;
    }
  }

  initializer();
  return tenkenConfig;
 }
