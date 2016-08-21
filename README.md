# tenken-validator

#Validator for JS

##Usage

```javascript
var example = DOM.tenken();
```
###Events
```javascript
example.on('submit',function(event,instance){
 //event - submit events
 //instance - tenken instance for validation.
});
```
### Tenken instance
#### Methods

* **isValid**(validCallback,invalidCallback) - return **true** or **false** to check validation. **isValid callbacks** returns array of object for each valid/invalid response as first parametr
  * validCallback(validResponse) - validResponse object:
    * input - DOM element for correct validation
    * valid - return **true**
  * invalidCallback(invalidReponse) - invalidReponse object:
    * input - DOM element for correct validation 
    * valid - return **false**
    * message - return error message for each invalid validation

### Tenken HTML attributes
#### validation attributes
* **data-tenken-length** - pass range like "5-20"
* **data-tenken-regex** - pass regex like "^[A-Z][-a-zA-Z]+$"

#### invalid validation attributes
Pass some error message on invalid response.

Invalid attributes are making by validation attributes and with **"-error"** ties like **data-tenken-length-error**.

##Example
```html
<form id="form1">
 <input type="text" data-tenken-length="5-20" data-tenken-length-error="Error! Min. length is 5 and max 20."/>
 <button type="submit">Send</button>
</form>
```
```javascript
var example = document.getElementById("form1").tenken();
example.on('submit',function(event,instance){

 var valid = instance.isValid(function(valid){
 // some stuff with valid array of objects
 },function(invalid){
 // some stuff with invalid array of objects
 })
 if(!valid)
  event.preventDefault(); // stop submitting form
});
```
