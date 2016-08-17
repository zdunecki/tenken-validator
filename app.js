Object.prototype.tenken = function(){
  var self = this;
  var validationAttributes = ['[data-tenken-length]','[data-tenken-required]','[data-tenken-regex]'];
  var validationAttributes2 = ['data-tenken-length','data-tenken-required','data-tenken-regex'];
  var validationElements = self.querySelectorAll(validationAttributes.join(","));
  
  var validator = {
  	form:self,
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
        default: 'Wrong types';
      }
    },
    isValid:function(success,error){
      var $validator = this;
      var $okArr = [];
      var $successForms = [];
      var $errorForms = [];
    	$validator.elements.map(function(value,key){
      	var isok = $validator.checkValid(value.type,value.obligation,value.element);
        $okArr.push(isok);
        isok ? $successForms.push({forms:value.element,valid:true}) : $errorForms.push({forms:value.element,message:value.error,valid:false})
      });
      var passed = $okArr.every(function(element){
        return element;
      });
      if(!(success || error))
      	return passed;
        
        success($successForms);
        error($errorForms);
        return passed;
    },
  }
  
  var tenkenConfig = {
    on:function(event,instance){
      switch (event) {
          case 'submit':
            self.addEventListener("submit",function(event){
							instance(event,validator);
            })
          default: 
             'Wrong events'
      }
    }
  }
  
  function initializer(){
      for(var v = 0; v < validationElements.length; v++){
       	validationAttributes2.filter(function(element,index,array){
          if(validationElements[v].hasAttribute(element)){
            var type = element.split('-').slice(1,element.length).join('');
            var obligation = validationElements[v].getAttribute(element);
  					var error =  validationElements[v].getAttribute(element+"-error"); 
            validator.elements.push({element:validationElements[v],type:type,obligation:obligation,attr:element,error:error});
          }
        });
      }
  }
  initializer();
  return tenkenConfig;
 }