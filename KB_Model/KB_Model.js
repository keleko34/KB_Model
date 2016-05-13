define([],function(){
  function CreateKB_Model(){

    var _model = {},
        _viewmodels = {},
        _dataListeners = {},
        _dataUpdateListeners = {},
        _splitScopeString = function(str)
        {
          return Array.prototype.concat.apply([],str.split(".").map(function(k,i){
            return k.split("[")
            .map(function(d,x){
              return (d.indexOf("]") > -1 ? "["+d : d);
            });
          }));
        },
        _changeEvent = function(viewmodel,vm,obj,value,oldValue,scopeString,key,args,action)
        {
          this.stopPropagation = function(){this._stopPropogation = true;};
          this.preventDefault = function(){this._preventDefault = true;};
          this.viewModel = viewmodel;
          this.viewModelKey = vm;
          this.scope = obj;
          this.value = value;
          this.oldValue = oldValue;
          this.scopeString = scopeString;
          this.key = key;
          this.args = args;
          this.action = action;
        },
        _onSet = function(vm,obj,value,oldValue,scopeString,key)
        {
          var e = new _changeEvent(_viewmodels[vm],vm,obj,value,oldValue,scopeString,key),
              all = "*",
              x = 0,
              i = 0,
              strSplit = _splitScopeString(scopeString),
              parentString = "";

          /* all listeners */
          if(_dataListeners[all] !== undefined)
          {
            loop:for(x=0;x<_dataListeners[all].length;x++)
            {
              _dataListeners[all][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }

          /* global listeners */
          if(_dataListeners[key] !== undefined && !e._stopPropogation)
          {
            loop:for(x=0;x<_dataListeners[key].length;x++)
            {
              _dataListeners[key][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }

          /* Parent Listeners */
          if(!e._stopPropogation)
          {
            outerLoop:for(i=0;i<strSplit.length;i++)
            {
              parentString = strSplit.slice(0,(i+1)).join(".").replace(/(\.\[)/g,'[');
              if(_dataListeners[parentString] !== undefined && !e._stopPropogation)
              {
                loop:for(x=0;x<_dataListeners[parentString].length;x++)
                {
                  _dataListeners[parentString][x].call({},e); //-- need to bind to parent object
                  if(e._stopPropogation) break outerLoop;
                }
              }
            }
          }

          /* local listeners */
          if(_dataListeners[scopeString] !== undefined && !e._stopPropogation)
          {
            loop:for(x=0;x<_dataListeners[scopeString].length;x++)
            {
              _dataListeners[scopeString][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }
          if(e._preventDefault)  return false;

          return true;
        },
        _onUpdate = function(vm,obj,value,oldValue,scopeString,key,args,action)
        {
          var e = new _changeEvent(_viewmodels[vm],vm,obj,value,oldValue,scopeString,key,args,action),
              all = "*",
              x = 0,
              i = 0,
              strSplit = _splitScopeString(scopeString),
              parentString = "";

          /* all listeners */
          if(_dataUpdateListeners[all] !== undefined)
          {
            loop:for(x=0;x<_dataUpdateListeners[all].length;x++)
            {
              _dataUpdateListeners[all][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }

          /* global listeners */
          if(_dataUpdateListeners[key] !== undefined)
          {
            loop:for(x=0;x<_dataUpdateListeners[key].length;x++)
            {
              _dataUpdateListeners[key][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }

          /* Parent Listeners */
          if(!e._stopPropogation)
          {
            outerLoop:for(i=0;i<strSplit.length;i++)
            {
              parentString = strSplit.slice(0,(i+1)).join(".").replace(/(\.\[)/g,'[');
              if(_dataUpdateListeners[parentString] !== undefined && !e._stopPropogation)
              {
                loop:for(x=0;x<_dataUpdateListeners[parentString].length;x++)
                {
                  _dataUpdateListeners[parentString][x].call({},e); //-- need to bind to parent object
                  if(e._stopPropogation) break outerLoop;
                }
              }
            }
          }

          /* local listeners */
          if(_dataUpdateListeners[scopeString] !== undefined && !e._stopPropogation)
          {
            loop:for(x=0;x<_dataUpdateListeners[scopeString].length;x++)
            {
              _dataUpdateListeners[scopeString][x].call({},e); //-- need to bind to parent object
              if(e._stopPropogation) break loop;
            }
          }

          //storage
          var lStorage = _storage('local').getItem("KB_Model_"+vm),
          sStorage = _storage('session').getItem("KB_Model_"+vm);

          if(lStorage)
          {
            _storage('local').setItem("KB_Model_"+vm,JSON.stringify(_viewmodels[vm]._getData));
          }
          else if(sStorage)
          {
            _storage('session').setItem("KB_Model_"+vm,JSON.stringify(_viewmodels[vm]._getData));
          }

          if(e._preventDefault)
          {
            return false;
          }
          return true;
        },
        _saveEnum = ['local','session'],
        _storage = function(type){if(_saveEnum.indexOf(type) > -1){return (type === 'local' ? localStorage : sessionStorage)}}

    function KB_Model()
    {

      //look at local storage and load, if viewmodel has save, save default to local storage, set also updates local storage
      var keys = Object.keys(_viewmodels),
          x = 0,
          key = {},
          lStorage,
          sStorage;

      for(x=0;x<keys.length;x++)
      {
        key = _viewmodels[keys[x]];
        lStorage = _storage('local').getItem("KB_Model_"+keys[x]);
        sStorage = _storage('session').getItem("KB_Model_"+keys[x]);

        if(lStorage)
        {
          key._getData = JSON.parse(lStorage);
        }
        else if(sStorage)
        {
          key._getData = JSON.parse(sStorage);
        }
        else
        {
          key._getData = KB_Model.deepCopy(key._tempData);
          if(key._save)
          {
            _storage(key._save).setItem("KB_Model_"+keys[x],JSON.stringify(key._getData));
          }
        }

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
      _viewmodels[name] = {_tempData:data,_getData:{},_bindData:{},_save:(save === undefined ? false : save),_model:!!(model === undefined ? true : model)};
      return KB_Model;
    }

    KB_Model.deepCopy = function(obj,obj2)
    {
      var keys = Object.keys(obj),
          key = "",
          x = 0;
          obj2 = (obj2 === undefined ? (obj.constructor.toString() === Object.toString() ? {} : []) : obj2);

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
      obj2 = (obj2 === undefined ? (obj.constructor.toString() === Object.toString() ? {} : []) : obj2);

      var keys = Object.keys(obj),
          key,
          x,
          obj2 = (obj2 === undefined ? {} : obj2),
          _inject = function(key,value,strl)
          {
            var isObject = (value.constructor.toString() === Object.toString()),
                isArray = (value.constructor.toString() === Array.toString());
            if(strl.length < 1 && value.constructor.toString() === Array.toString())
            {
              strl += key+"[";
            }
            else if(strl.length < 1)
            {
              strl += key;
            }
            else if(strl.lastIndexOf("[") === (strl.length-1))
            {
              strl += key+"]"+(value.constructor.toString() === Array.toString() ? "[" : "");
            }
            else if(value.constructor.toString() === Array.toString())
            {
              strl += "."+key+"[";
            }
            else
            {
              strl += "."+key;
            }

            if(isObject || isArray)
            {
              //object.defineProp
              Object.defineProperty(obj2,key,{
                value:(isObject ? {} : []),
                writable:false,
                enumerable:true,
                configurable:true
              })
              KB_Model.deepInject(obj[key],obj2[key],name,strl);
            }
            else
            {
              //object.defineProp
              Object.defineProperty(obj2,key,{
                get:function(){return obj[key];},
                set:function(v){
                  var oldValue = obj[key];
                  if(_onSet(name,obj2,v,oldValue,strl,key))
                  {
                    obj[key] = v;
                  }
                  _onUpdate(name,obj2,v,oldValue,strl,key);
                },
                enumerable:true,
                configurable:true
              })
            }
          }

      for(x=0;x<keys.length;x++)
      {
        key = obj[keys[x]];
        _inject(keys[x],key,str);
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
      var x = 0,
          d = dataListeners[attr];
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

    KB_Model.getDataListeners = function()
    {
      return _dataListeners;
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
      var x = 0,
          d = _dataUpdateListeners[attr];
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

    KB_Model.getDataUpdateListeners = function()
    {
      return _dataUpdateListeners;
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
