define([],function(){
  function CreateKB_Model(){

    var _model = {}
      , _viewmodels = {}
      , _dataListeners = {}
      , _dataUpdateListeners = {}
      , _changeEvent = function(vm,obj,value,oldValue,scopeString,key,args,action)
        {
          this.stopPropagation = function(){this._stopPropogation = true;};
          this.preventDefault = function(){this._preventDefault = true;};
          this.viewModel = vm;
          this.scope = obj;
          this.value = value;
          this.oldValue = oldValue;
          this.scopeString = scopeString;
          this.key = key;
          this.args = args;
          this.action = action;
        }
      , _onSet = function(vm,obj,value,oldValue,scopeString,key)
        {
          var e = new _changeEvent(vm,obj,value,oldValue,scopeString,key)
            , x;
          if(_dataListeners[key] !== undefined)
          {
            loop:for(x=0;x<_dataListeners[key].length;x++)
            {
              _dataListeners[key][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }
          if(_dataListeners[scopeString] !== undefined && !e._stopPropogation)
          {
            loop:for(x=0;x<_dataListeners[scopeString].length;x++)
            {
              _dataListeners[scopeString][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }
          if(e._preventDefault)
          {
            return false;
          }
          return true;
        }
      , _onUpdate = function(vm,obj,value,oldValue,scopeString,key,args,action)
        {
          var e = new _changeEvent(vm,obj,value,oldValue,scopeString,key,args,action);
          , x;
          if(_dataUpdateListeners[key] !== undefined)
          {
            loop:for(x=0;x<_dataUpdateListeners[key].length;x++)
            {
              _dataUpdateListeners[key][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }
          if(_dataUpdateListeners[scopeString] !== undefined && !e._stopPropogation)
          {
            loop:for(x=0;x<_dataUpdateListeners[scopeString].length;x++)
            {
              _dataUpdateListeners[scopeString][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }
          if(e._preventDefault)
          {
            return false;
          }
          return true;
        }
      , _saveEnum = ['local','session']

    function KB_Model()
    {

      //look at local storage and load, if viewmodel has save, save default to local storage, set also updates local storage
      var keys = Object.keys(_viewmodels)
        , x
        , key = {};

      for(x=0;x<keys.length;x++)
      {
        key = _viewmodels[keys[x]];
        key._getData = KB_Model.deepCopy(key._tempData);

        KB_Model.deepInject(key._getData,key._bindData,keys[x]);
        if(key._model)
        {
          _model[keys[x]] = {};
          KB_Model.deepInject(key._getData,_model[keys[x]],"Model");
        }
      }
    }

    /* The combination of all viewmodels */
    KB_Model.Model = function()
    {
        return _model;
    }

    KB_Model.ViewModel = function(name,data,save,model)
    {
      if(data === undefined && name === undefined)
      {
        return _viewmodels;
      }
      if(data === undefined && name !== undefined)
      {
        return _viewmodels[name]._bindData;
      }
      _viewmodels[name] = {_tempData:data,_getData:{},_bindData:{},_save:!!(save === undefined ? false : save),_model:!!(model === undefined ? true : model)};
      return KB_Model;
    }

    KB_Model.deepCopy = function(obj,obj2)
    {
      var keys = Object.keys(obj)
        , key
        , x
        , obj2 = (obj2 === undefined ? {} : obj2);

      for(x=0;x<keys.length;x++)
      {
        key = obj[keys[x]];
        if(key.constructor.toString() === Object.toString())
        {
          obj2[keys[x]] = {};
          KB_Model.deepCopy(key,obj2[keys[x]]);
        }
        else if(key.constructor.toString() === Array.toString())
        {
          obj2[keys[x]] = [];
          KB_Model.deepCopy(key,obj2[keys[x]]);
        }
        else
        {
          obj2[keys[x]] = key;
        }
      }
      return obj2;
    }

    KB_Model.deepInject = function(obj,obj2,name,str)
    {
      str = (str === undefined ? "" : str);
      name = (name === undefined ? "unknown" : name);

      var keys = Object.keys(obj)
        , key
        , x
        , obj2 = (obj2 === undefined ? {} : obj2)
        , _inject = function(key,value)
          {
            if(str.lastIndexOf("[") === (str.length-1))
            {
              str += key+"]";
            }
            else if(value.constructor.toString() === Array.toString())
            {
              str += "."+key+"[";
            }
            else
            {
              str += "."+key;
            }

            if(value.constructor.toString() === Object.toString() || value.constructor.toString() === Array.toString())
            {
              //object.defineProp
              Object.defineProperty(obj2,key,{
                get:function(){return obj[key];},
                set:function(v){
                  var oldValue = obj2[keys[x]];
                  if(_onSet(name,obj2,v,oldValue,str,key))
                  {
                    obj[key] = v;
                  }
                  _onUpdate(name,obj2,v,oldValue,str,key);
                },
                enumerable:true,
                configurable:true
              })
              KB_Model.deepInject(key,obj2[keys[x]],str,name);
            }
            else
            {
              //object.defineProp
              Object.defineProperty(obj2,key,{
                get:function(){return obj[key];},
                set:function(v){
                  var oldValue = obj2[keys[x]];
                  if(_onSet(name,obj2,v,oldValue,str,key))
                  {
                    obj[key] = v;
                  }
                  _onUpdate(name,obj2,v,oldValue,str,key);
                },
                enumerable:true,
                configurable:true
              })
            }
          }

      for(x=0;x<keys.length;x++)
      {
        key = obj[keys[x]];
        _inject(keys[x],key);
      }
      return obj2;
    }

    KB_Model.addDataListener = function(attr,func) //name or tree.branch.prop[int] etc.
    {
      if(_dataListeners[attr] === undefined)
      {
        _dataListeners[attr] = [];
      }
      _dataListeners[attr].push(func);
      return KB_Model;
    }

    KB_Model.removeDataListener = function(attr,func)
    {
      var x
        , d = dataListeners[attr];
      if(d !== undefined)
      {
        loop:for(x=0;x<d.length;x++)
        {
          if(d[x].toString() === func.toString())
          {
            d.splice(x,1);
            break loop;
          }
        }
      }
      return KB_Model;
    }

    KB_Model.addDataUpdateListener = function(attr,func) //name or tree.branch.prop[int] etc.
    {
      if(_dataUpdateListeners[attr] === undefined)
      {
        _dataUpdateListeners[attr] = [];
      }
      _dataUpdateListeners[attr].push(func);
      return KB_Model;
    }

    KB_Model.removeDataUpdateListener = function(attr,func)
    {
      var x
        , d = _dataUpdateListeners[attr];
      if(d !== undefined)
      {
        loop:for(x=0;x<d.length;x++)
        {
          if(d[x].toString() === func.toString())
          {
            d.splice(x,1);
            break loop;
          }
        }
      }
      return KB_Model;
    }

    return KB_Model;
  }
  if (typeof define === "function" && define.amd)
  {
    define('KB_Model',CreateKB_Model); //global KM define in browser
    define([],CreateKB_Model); //define if file refrenced
  }
  else if (typeof module === "object" && module.exports)
  {
    module.exports = CreateKB_Model;
  }
  return CreateKB_Model;
});
