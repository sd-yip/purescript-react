/* global exports */
"use strict";

var React = require("react");

function createClass(baseClass) {
  function curry2(f) {
    return f === undefined ? f : function (a, b) {
      return f(a)(b)
    }
  }
  function curry3(f) {
    return f === undefined ? f : function (a, b, c) {
      return f(a)(b)(c)
    }
  }

  return function (displayName) {
    return function (ctrFn) {
      var Constructor = function (props) {
        baseClass.call(this, props);
        var spec = ctrFn(this)();

        this.state = spec.state;
        this.render = spec.render;
        this.componentDidMount = spec.componentDidMount;
        this.componentWillUnmount = spec.componentWillUnmount;
        this.componentDidCatch = curry2(spec.componentDidCatch);
        this.componentWillUpdate = curry2(spec.componentWillUpdate);
        this.shouldComponentUpdate = curry2(spec.shouldComponentUpdate);
        this.getSnapshotBeforeUpdate = curry2(spec.getSnapshotBeforeUpdate);
        this.componentDidUpdate = curry3(spec.componentDidUpdate);
        this.UNSAFE_componentWillMount = spec.unsafeComponentWillMount;
        this.UNSAFE_componentWillReceiveProps = curry2(spec.unsafeComponentWillReceiveProps);
        this.UNSAFE_componentWillUpdate = curry3(spec.unsafeComponentWillUpdate);
      };

      Constructor.displayName = displayName;
      Constructor.prototype = Object.create(baseClass.prototype);
      Constructor.prototype.constructor = Constructor;

      return Constructor;
    };
  };
}

function createClassWithDerivedState(classCtr) {
  return function(displayName) {
    return function(getDerivedStateFromProps) {
      return function(ctrFn) {
        var Constructor = componentImpl(displayName)(ctrFn);
        Constructor.getDerivedStateFromProps = function(a, b) { return getDerivedStateFromProps(a)(b); };
        return Constructor;
      };
    };
  };
}

var componentImpl = createClass(React.Component);
exports.componentImpl = componentImpl;
exports.componentWithDerivedStateImpl = createClassWithDerivedState(componentImpl);

var pureComponentImpl = createClass(React.PureComponent);
exports.pureComponentImpl = pureComponentImpl;
exports.pureComponentWithDerivedStateImpl = createClassWithDerivedState(pureComponentImpl);

exports.statelessComponent = function(x) { return x; };

exports.fragment = React.Fragment;

function getProps(this_) {
  return function(){
    return this_.props;
  };
}
exports.getProps = getProps;

exports.childrenToArray = React.Children.toArray;

exports.childrenCount = React.Children.count;

function setStateImpl(this_) {
  return function(state){
    return function(){
      this_.setState(state);
    };
  };
}
exports.setStateImpl = setStateImpl;

function setStateWithCallbackImpl(this_) {
  return function(state){
    return function(cb){
      return function() {
        this_.setState(state, cb);
      };
    };
  };
}
exports.setStateWithCallbackImpl = setStateWithCallbackImpl;

function getState(this_) {
  return function(){
    if (!this_.state) {
      throw new Error('[purescript-react] Cannot get state within constructor');
    }
    return this_.state;
  };
}
exports.getState = getState;

function forceUpdateWithCallback(this_) {
  return function(cb) {
    return function() {
      this_.forceUpdate(cb);
    };
  };
}
exports.forceUpdateWithCallback = forceUpdateWithCallback;

function createElement(class_) {
  return function(props){
    return function(children){
      return React.createElement.apply(React, [class_, props].concat(children));
    };
  };
}
exports.createElementImpl = createElement;
exports.createElementTagName = createElement;

function createLeafElement(class_) {
  return function(props) {
    return React.createElement(class_, props);
  };
}
exports.createLeafElementImpl = createLeafElement;

function createElementDynamic(class_) {
  return function(props) {
    return function(children){
      return React.createElement(class_, props, children);
    };
  };
};
exports.createElementDynamicImpl = createElementDynamic;
exports.createElementTagNameDynamic = createElementDynamic;

function createContext(defaultValue) {
  var context = React.createContext(defaultValue);
  return {
    consumer: context.Consumer,
    provider: context.Provider
  };
}
exports.createContext = createContext;
