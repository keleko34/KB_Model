# KB_Model
Model and ViewModel Data Binding Event Based Library

IE 9+,Chrome,Firefox,Safari

This library allows for Creating ViewModels and listening for data changes in them.

###### Install

`npm install KB_Model`

###### Start
*note: You must call constructor everytime you add a viewmodel*

    /* Creates new KB, same as 'new method();' */
    var kbModel = CreateKB_Model();
    
    /* Your Data */
    var data = {value:"word1",value2:1000,value3:[34,35,35,[35,63,36],52],value4:{subValue:"SomeValue"}};
    
    /* Add ViewModel */
    kbModel.ViewModel('MyData',data);
    
    /* add Data Pre Set Listener */
    kbModel.addDataListener('value',function(e){console.log(e);});
    
    /* add Data Post Set Listener */
    kbModel.addDataUpdateListener('value',function(e){console.log(e);});
    
    /* Constructor */
    kbModel.call();

###### Use With *Storage*
*note: Storage type data automatically remembers changes after page refresh or in the case of 'local' after browser restart*

    var kbModel = CreateKB_Model();
    
    var data = {value:"word1",value2:1000,value3:[34,35,35,[35,63,36],52],value4:{subValue:"SomeValue"}};
    
    /* Add ViewModel with storage type, 'session' or 'local' */
    kbModel.ViewModel('MyData',data,'session');
    
    kbModel.call();
    
###### Examples Of *Listeners*

    var kbModel = CreateKB();
    
    var data = {value:"word1",value2:1000,value3:[34,35,35,[35,63,36],52],value4:{subValue:"SomeValue"},value5:{subValue:"OtherValue",subValue1:{subSubValue:20}}};
    
    kbModel.ViewModel('MyData',data);
    
    /* Standard Global Data Listener, will fire on any property with this name */
    kbModel.addDataListener('subValue',function(e){console.log(e);});
    
    /* Specific Object Property Listener, will fire only on that specific property */
    kbModel.addDataListener('value4.subValue.subSubValue',function(e){console.log(e);});
    
    /* All Properties on Object Listener, will fire when there is any change in that objects children */
    kbModel.addDataListener('value3',function(e){console.log(e);});
    
    /* Specific Array index Listener, will fire only on that specific Array index */
    kbModel.addDataListener('value3[3][0]',function(e){console.log(e);});
    
    /* Listen to any changes, from anything */
    kbModel.addDataListener('*',function(e){console.log(e);});
    
    kbModel.call();


###### Accessing and Changing *Data*
*note: Original Data is naver changed and multiple viewmodels can be made from it that are completely seperate*

    var kbModel = CreateKB();
    
    var data = {value:"word1",value2:1000,value3:[34,35,35,[35,63,36],52],value4:{subValue:"SomeValue"},value5:{subValue:"OtherValue",subValue1:{subSubValue:20}}};
    
    kbModel.ViewModel('MyData',data);
    
    kbModel();
    
    /* Returns the bindable data */
    var myModel = kbModel.ViewModel('MyData');
    
    /* changing any data will fire associated event */
    myModel.value = "newWord";

###### Event Properties

- stopPropogration: (Function) stops all future added listeners from firing on this event
- preventDefault: (Function) stops the attribute/property from changing *Pre Only*
- viewModel: (Object|Array) the viewmodel that had the change happen
- viewModelKey: (String) key of the viewmodel that had the change happen
- value: (Any) The value that is trying to be set
- oldValue (Any) The current value that is set prior to change
- key (String) the key that changed
- scope (Object|Array) the key's parent component that had the change happen on it
- scopeString (String) a string representation of the key and all its parents
- arguments (Argument Array) if attr is a function this the arguments that was passed to the function
- action: (Any) if attr is a function this is the outcome of that function *Post Only*

###### Methods

 addDataListener (*String 'key|scopeString',Function Callback*)<br />
 **Adds an event to the event chain for the change of that key or scopeString** *Pre Value Set*
 
 removeDataListener (*String 'Property',Function Callback*)<br />
 **Removes event from the event chain that matches** *Pre Value Set*
 
 addDataUpdateListener (*String 'Property',Function Callback*)<br />
 **Adds an event to the event chain for the post change of that key or scopeString** *Post Value Set*
 
 removeDataUpdateListener (*String 'Property',Function Callback*)<br />
 **Removes event from the event chain that matches in the post events** *Post Value Set*
 
 ViewModel (*String 'key', Object|Array data, EnumString['local','session'] storageType, Boolean inModel)<br />
 **Creates a ViewModel with the key passed, You can set storage type 'session' or 'local', default is no storage or Boolean false, inModel determines if the ViewModel is linked to a Model, default is true**
 
 ViewModel (*String 'key'*)<br />
 **returns the desired ViewModel data**
 
 Model ()<br />
 **returns the Model with all ViewModels**
 
 deepCopy (*Object|Array item to copy, (optional) Object|Array item to copy to*)<br />
 **deep copys an object or array and returns the copy, if second param is set then it copies to this and returns it**
 
 deepInject (*Object|Array item to inject, (optional) Object|Array item to put the bindable properties in, (optional) String ViewModel, (optional) String scopeString*)<br />
 **creates a bindable object|array from the passed object and returns it, if second object|array is passed this is used as the bindable object, the values are set and retrieved from the primary object passed**
 
 getDataListeners ()<br />
 **returns all pre set data listeners**
 
 getDataUpdateListeners ()<br />
 **returns all post set data listeners**
 
#### Contributing

###### Build Tool *Gulp*

NPM: `npm i`<br />
CLI: `Gulp Build`<br />
Component `KB_Model`