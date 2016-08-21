# tenken-validator

#Validator for JS

##Usage

```javascript
var example = DOM.tenken();
```
###Events
```javascript
tenken2.on('submit',function(event,instance){
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

