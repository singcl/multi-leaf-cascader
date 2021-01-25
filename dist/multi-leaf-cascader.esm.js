function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { Component, cloneElement, useState, useEffect } from 'react';
import 'rc-trigger';
import KeyCode from 'rc-util/lib/KeyCode';
import arrayTreeFilter from 'array-tree-filter';
import 'rc-checkbox';
import 'rc-select';
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */

var _extendStatics = function extendStatics(d, b) {
  _extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    }
  };

  return _extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

  _extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __rest(s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}
/** @deprecated */


function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
}

function isEqualArrays(arrA, arrB) {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  var len = arrA.length;

  if (arrB.length !== len) {
    return false;
  } // eslint-disable-next-line no-plusplus


  for (var i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}

function getAllLeafOptions(options) {
  var result = [];

  function getLeaf(options) {
    options.forEach(function (item) {
      if (item.children && item.children.length > 0) {
        getLeaf(item.children);
      } else {
        result.push(item);
      }
    });
  }

  getLeaf(options);
  return result;
}
/** @class */


(function (_super) {
  __extends(Menus, _super);

  function Menus() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.menuItems = {};
    _this.delayTimer = null;

    _this.saveMenuItem = function (index) {
      return function (node) {
        _this.menuItems[index] = node;
      };
    };

    return _this;
  }

  Menus.prototype.componentDidMount = function () {
    this.scrollActiveItemToView();
  };

  Menus.prototype.componentDidUpdate = function (prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.scrollActiveItemToView();
    }
  };

  Menus.prototype.getFieldName = function (name) {
    var _a = this.props,
        fieldNames = _a.fieldNames,
        defaultFieldNames = _a.defaultFieldNames; // 防止只设置单个属性的名字

    return fieldNames[name] || defaultFieldNames[name];
  };

  Menus.prototype.getOption = function (option, menuIndex) {
    var _a = this.props,
        prefixCls = _a.prefixCls,
        expandTrigger = _a.expandTrigger,
        expandIcon = _a.expandIcon,
        loadingIcon = _a.loadingIcon,
        value = _a.value,
        onChecked = _a.onChecked;
    var onSelect = this.props.onSelect.bind(this, option, menuIndex);
    var onItemDoubleClick = this.props.onItemDoubleClick.bind(this, option, menuIndex);
    var expandProps = {
      onClick: onSelect,
      onDoubleClick: onItemDoubleClick
    };
    var menuItemCls = prefixCls + "-menu-item";
    var expandIconNode = null;
    var hasChildren = option[this.getFieldName("children")] && option[this.getFieldName("children")].length > 0;

    if (hasChildren || option.isLeaf === false) {
      menuItemCls += " " + prefixCls + "-menu-item-expand";

      if (!option.loading) {
        expandIconNode = /*#__PURE__*/React.createElement("span", {
          className: prefixCls + "-menu-item-expand-icon"
        }, expandIcon);
      }
    }

    if (expandTrigger === "hover" && (hasChildren || option.isLeaf === false)) {
      expandProps = {
        onMouseEnter: this.delayOnSelect.bind(this, onSelect),
        onMouseLeave: this.delayOnSelect.bind(this),
        onClick: onSelect
      };
    }

    if (this.isActiveOption(option, menuIndex)) {
      menuItemCls += " " + prefixCls + "-menu-item-active";
      expandProps.ref = this.saveMenuItem(menuIndex);
    }

    if (option.disabled) {
      menuItemCls += " " + prefixCls + "-menu-item-disabled";
    }

    var loadingIconNode = null;

    if (option.loading) {
      menuItemCls += " " + prefixCls + "-menu-item-loading";
      loadingIconNode = loadingIcon || null;
    }

    var title = "";

    if ("title" in option) {
      // eslint-disable-next-line prefer-destructuring
      title = option.title;
    } else if (typeof option[this.getFieldName("label")] === "string") {
      title = option[this.getFieldName("label")];
    }

    return /*#__PURE__*/React.createElement("li", _extends({
      key: option[this.getFieldName("value")],
      className: menuItemCls,
      title: title
    }, expandProps, {
      role: "menuitem",
      onMouseDown: function onMouseDown(e) {
        return e.preventDefault();
      }
    }), !hasChildren && /*#__PURE__*/React.createElement(Checkbox, {
      checked: value && value.some(function (v) {
        return v === option.value;
      }),
      onChange: function onChange(e) {
        var checked = e.target.checked;
        typeof onChecked === "function" && onChecked(option, checked, menuIndex, e);
      },
      style: {
        marginRight: "3px"
      }
    }), option[this.getFieldName("label")], expandIconNode, loadingIconNode);
  };

  Menus.prototype.getActiveOptions = function (values) {
    var _this = this;

    var options = this.props.options;
    var activeValue = values || this.props.activeValue;
    return arrayTreeFilter(options, function (o, level) {
      return o[_this.getFieldName("value")] === activeValue[level];
    }, {
      childrenKeyName: this.getFieldName("children")
    });
  };

  Menus.prototype.getShowOptions = function () {
    var _this = this;

    var options = this.props.options;
    var result = this.getActiveOptions().map(function (activeOption) {
      return activeOption[_this.getFieldName("children")];
    }).filter(function (activeOption) {
      return !!activeOption;
    });
    result.unshift(options);
    return result;
  };

  Menus.prototype.delayOnSelect = function (onSelect) {
    var _this = this;

    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }

    if (typeof onSelect === "function") {
      this.delayTimer = window.setTimeout(function () {
        onSelect(args);
        _this.delayTimer = null;
      }, 150);
    }
  };

  Menus.prototype.scrollActiveItemToView = function () {
    // scroll into view
    var optionsLength = this.getShowOptions().length; // eslint-disable-next-line no-plusplus

    for (var i = 0; i < optionsLength; i++) {
      var itemComponent = this.menuItems[i];

      if (itemComponent && itemComponent.parentElement) {
        itemComponent.parentElement.scrollTop = itemComponent.offsetTop;
      }
    }
  };

  Menus.prototype.isActiveOption = function (option, menuIndex) {
    var _a = this.props.activeValue,
        activeValue = _a === void 0 ? [] : _a;
    return activeValue[menuIndex] === option[this.getFieldName("value")];
  };

  Menus.prototype.render = function () {
    var _this = this;

    var _a = this.props,
        prefixCls = _a.prefixCls,
        dropdownMenuColumnStyle = _a.dropdownMenuColumnStyle;
    return /*#__PURE__*/React.createElement("div", null, this.getShowOptions().map(function (options, menuIndex) {
      return /*#__PURE__*/React.createElement("ul", {
        className: prefixCls + "-menu",
        key: menuIndex,
        style: dropdownMenuColumnStyle
      }, options.map(function (option) {
        return _this.getOption(option, menuIndex);
      }));
    }));
  };

  Menus.defaultProps = {
    options: [],
    value: [],
    activeValue: [],
    onSelect: function onSelect() {},
    onChecked: function onChecked() {},
    prefixCls: "rc-cascader-menus",
    visible: false,
    expandTrigger: "click"
  };
  return Menus;
})(Component);

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  }
};
/** @class */

(function (_super) {
  __extends(Cascader, _super);

  function Cascader(props) {
    var _this = _super.call(this, props) || this;

    _this.setPopupVisible = function (popupVisible) {
      var value = _this.state.value;

      if (!('popupVisible' in _this.props)) {
        _this.setState({
          popupVisible: popupVisible
        });
      } // sync activeValue with value when panel open


      if (popupVisible && !_this.state.popupVisible) {
        _this.setState({
          activeValue: value
        });
      }

      _this.props.onPopupVisibleChange(popupVisible);
    };

    _this.handleChange = function (options, _a, e) {
      var visible = _a.visible;

      if (e.type !== 'keydown' || e.keyCode === KeyCode.ENTER) {
        _this.props.onChange(options.map(function (o) {
          return o[_this.getFieldName('value')];
        }), options);

        _this.setPopupVisible(visible);
      }
    };

    _this.handlePopupVisibleChange = function (popupVisible) {
      _this.setPopupVisible(popupVisible);
    };

    _this.handleMenuSelect = function (targetOption, menuIndex, e) {
      // Keep focused state for keyboard support
      var triggerNode = _this.trigger.getRootDomNode();

      if (triggerNode && triggerNode.focus) {
        triggerNode.focus();
      }

      var _a = _this.props,
          changeOnSelect = _a.changeOnSelect,
          loadData = _a.loadData,
          expandTrigger = _a.expandTrigger;

      if (!targetOption || targetOption.disabled) {
        return;
      }

      var activeValue = _this.state.activeValue;
      activeValue = activeValue.slice(0, menuIndex + 1);
      activeValue[menuIndex] = targetOption[_this.getFieldName('value')];

      var activeOptions = _this.getActiveOptions(activeValue); // 异步加载数据


      if (targetOption.isLeaf === false && !targetOption[_this.getFieldName('children')] && loadData) {
        if (changeOnSelect) {
          _this.handleChange(activeOptions, {
            visible: true
          }, e);
        }

        _this.setState({
          activeValue: activeValue
        });

        loadData(activeOptions);
        return;
      }

      var newState = {};
      if (!targetOption[_this.getFieldName('children')] || !targetOption[_this.getFieldName('children')].length) ;else if (changeOnSelect && (e.type === 'click' || e.type === 'keydown')) {
        if (expandTrigger === 'hover') {
          _this.handleChange(activeOptions, {
            visible: false
          }, e);
        } else {
          _this.handleChange(activeOptions, {
            visible: true
          }, e);
        } // set value to activeValue on every select


        newState.value = activeValue;
      }
      newState.activeValue = activeValue; //  not change the value by keyboard

      if ('value' in _this.props || e.type === 'keydown' && e.keyCode !== KeyCode.ENTER) {
        delete newState.value;
      }

      _this.setState(newState);
    };

    _this.handleMenuChecked = function (targetOption, checked, menuIndex, e) {
      // Keep focused state for keyboard support
      var triggerNode = _this.trigger.getRootDomNode();

      if (triggerNode && triggerNode.focus) {
        triggerNode.focus();
      }

      var _a = _this.props;
      _a.changeOnSelect;
      _a.loadData;
      _a.expandTrigger;

      if (!targetOption || targetOption.disabled) {
        return;
      } // let { activeValue } = this.state;
      // activeValue = activeValue.slice(0, menuIndex + 1);
      // activeValue[menuIndex] = targetOption[this.getFieldName('value')];
      // const activeOptions = this.getActiveOptions(activeValue);
      // // 异步加载数据
      // if (targetOption.isLeaf === false && !targetOption[this.getFieldName('children')] && loadData) {
      //   if (changeOnSelect) {
      //     this.handleChange(activeOptions, { visible: true }, e);
      //   }
      //   this.setState({ activeValue });
      //   loadData(activeOptions);
      //   return;
      // }


      var newState = {};

      if (!targetOption[_this.getFieldName('children')] || !targetOption[_this.getFieldName('children')].length) {
        var checkValue_1 = targetOption[_this.getFieldName('value')];

        var value = _this.state.value;

        var newValue = __spreadArrays(value);

        var idx = newValue.findIndex(function (m) {
          return m === checkValue_1;
        });

        if (checked) {
          idx === -1 && newValue.push(checkValue_1);
        } else {
          idx !== -1 && newValue.splice(idx, 1);
        }

        var checkedOptions = _this.getCheckedOptions(newValue);

        _this.handleChange(checkedOptions, {
          visible: true
        }, e); // set value to activeValue when select leaf option


        newState.value = newValue; // add e.type judgement to prevent `onChange` being triggered by mouseEnter
        // } else if (changeOnSelect && (e.type === "click" || e.type === "keydown")) {
        // if (expandTrigger === 'hover') {
        //   this.handleChange(activeOptions, { visible: false }, e);
        // } else {
        //   this.handleChange(activeOptions, { visible: true }, e);
        // }
        // // set value to activeValue on every select
        // newState.value = activeValue;
      } // newState.activeValue = activeValue;
      //  not change the value by keyboard
      // if (
      //   "value" in this.props ||
      //   (e.type === "keydown" && e.keyCode !== KeyCode.ENTER)
      // ) {
      //   delete newState.value;
      // }


      _this.setState(newState);
    };

    _this.handleItemDoubleClick = function () {
      var changeOnSelect = _this.props.changeOnSelect;

      if (changeOnSelect) {
        _this.setPopupVisible(false);
      }
    };

    _this.handleKeyDown = function (e) {
      var children = _this.props.children; // https://github.com/ant-design/ant-design/issues/6717
      // Don't bind keyboard support when children specify the onKeyDown

      if (children && children.props.onKeyDown) {
        children.props.onKeyDown(e);
        return;
      }

      var activeValue = __spreadArrays(_this.state.activeValue);

      var currentLevel = activeValue.length - 1 < 0 ? 0 : activeValue.length - 1;

      var currentOptions = _this.getCurrentLevelOptions();

      var currentIndex = currentOptions.map(function (o) {
        return o[_this.getFieldName('value')];
      }).indexOf(activeValue[currentLevel]);

      if (e.keyCode !== KeyCode.DOWN && e.keyCode !== KeyCode.UP && e.keyCode !== KeyCode.LEFT && e.keyCode !== KeyCode.RIGHT && e.keyCode !== KeyCode.ENTER && e.keyCode !== KeyCode.SPACE && e.keyCode !== KeyCode.BACKSPACE && e.keyCode !== KeyCode.ESC && e.keyCode !== KeyCode.TAB) {
        return;
      } // Press any keys above to reopen menu


      if (!_this.state.popupVisible && e.keyCode !== KeyCode.BACKSPACE && e.keyCode !== KeyCode.LEFT && e.keyCode !== KeyCode.RIGHT && e.keyCode !== KeyCode.ESC && e.keyCode !== KeyCode.TAB) {
        _this.setPopupVisible(true);

        if (_this.props.onKeyDown) {
          _this.props.onKeyDown(e);
        }

        return;
      }

      if (e.keyCode === KeyCode.DOWN || e.keyCode === KeyCode.UP) {
        e.preventDefault();
        var nextIndex = currentIndex;

        if (nextIndex !== -1) {
          if (e.keyCode === KeyCode.DOWN) {
            nextIndex += 1;
            nextIndex = nextIndex >= currentOptions.length ? 0 : nextIndex;
          } else {
            nextIndex -= 1;
            nextIndex = nextIndex < 0 ? currentOptions.length - 1 : nextIndex;
          }
        } else {
          nextIndex = 0;
        }

        activeValue[currentLevel] = currentOptions[nextIndex][_this.getFieldName('value')];
      } else if (e.keyCode === KeyCode.LEFT || e.keyCode === KeyCode.BACKSPACE) {
        e.preventDefault();
        activeValue.splice(activeValue.length - 1, 1);
      } else if (e.keyCode === KeyCode.RIGHT) {
        e.preventDefault();

        if (currentOptions[currentIndex] && currentOptions[currentIndex][_this.getFieldName('children')]) {
          activeValue.push(currentOptions[currentIndex][_this.getFieldName('children')][0][_this.getFieldName('value')]);
        }
      } else if (e.keyCode === KeyCode.ESC || e.keyCode === KeyCode.TAB) {
        _this.setPopupVisible(false);

        if (_this.props.onKeyDown) {
          _this.props.onKeyDown(e);
        }

        return;
      }

      if (!activeValue || activeValue.length === 0) {
        _this.setPopupVisible(false);
      }

      var activeOptions = _this.getActiveOptions(activeValue);

      var targetOption = activeOptions[activeOptions.length - 1];

      _this.handleMenuSelect(targetOption, activeOptions.length - 1, e);

      if (_this.props.onKeyDown) {
        _this.props.onKeyDown(e);
      }
    };

    _this.saveTrigger = function (node) {
      _this.trigger = node;
    };

    var initialValue = [];

    if ('value' in props) {
      initialValue = props.value || [];
    } else if ('defaultValue' in props) {
      initialValue = props.defaultValue || [];
    } // warning(
    //   !("filedNames" in props),
    //   "`filedNames` of Cascader is a typo usage and deprecated, please use `fieldNames` instead."
    // );


    _this.state = {
      popupVisible: props.popupVisible,
      // activeValue: getEntityChainList(props.options, initialValue[0]),
      activeValue: [],
      value: initialValue,
      prevProps: props
    };
    _this.defaultFieldNames = {
      label: 'label',
      value: 'value',
      children: 'children'
    };
    return _this;
  }

  Cascader.getDerivedStateFromProps = function (nextProps, prevState) {
    var _a = prevState.prevProps,
        prevProps = _a === void 0 ? {} : _a;
    var newState = {
      prevProps: nextProps
    };

    if ('value' in nextProps && !isEqualArrays(prevProps.value, nextProps.value)) {
      newState.value = nextProps.value || [];
    }

    if ('popupVisible' in nextProps) {
      newState.popupVisible = nextProps.popupVisible;
    }

    return newState;
  };

  Cascader.prototype.getPopupDOMNode = function () {
    return this.trigger.getPopupDomNode();
  };

  Cascader.prototype.getFieldName = function (name) {
    var defaultFieldNames = this.defaultFieldNames;
    var _a = this.props,
        fieldNames = _a.fieldNames,
        filedNames = _a.filedNames;

    if ('filedNames' in this.props) {
      return filedNames[name] || defaultFieldNames[name]; // For old compatibility
    }

    return fieldNames[name] || defaultFieldNames[name];
  };

  Cascader.prototype.getFieldNames = function () {
    var _a = this.props,
        fieldNames = _a.fieldNames,
        filedNames = _a.filedNames;

    if ('filedNames' in this.props) {
      return filedNames; // For old compatibility
    }

    return fieldNames;
  };

  Cascader.prototype.getCurrentLevelOptions = function () {
    var _this = this;

    var _a = this.props.options,
        options = _a === void 0 ? [] : _a;
    var _b = this.state.activeValue,
        activeValue = _b === void 0 ? [] : _b;
    var result = arrayTreeFilter(options, function (o, level) {
      return o[_this.getFieldName('value')] === activeValue[level];
    }, {
      childrenKeyName: this.getFieldName('children')
    });

    if (result[result.length - 2]) {
      return result[result.length - 2][this.getFieldName('children')];
    }

    return __spreadArrays(options).filter(function (o) {
      return !o.disabled;
    });
  };

  Cascader.prototype.getActiveOptions = function (activeValue) {
    var _this = this;

    return arrayTreeFilter(this.props.options || [], function (o, level) {
      return o[_this.getFieldName('value')] === activeValue[level];
    }, {
      childrenKeyName: this.getFieldName('children')
    });
  }; //


  Cascader.prototype.getCheckedOptions = function (checkedValue) {
    // TODO: 不需要每次计算生成所有叶子节点数组
    var allLeafOptions = this.props.allLeafOptions || [];
    return checkedValue.map(function (item) {
      var option = allLeafOptions.find(function (m) {
        return m.value === item;
      });
      return option ? option : {
        value: item,
        label: item
      };
    });
  };

  Cascader.prototype.render = function () {
    var _a = this.props,
        prefixCls = _a.prefixCls,
        transitionName = _a.transitionName,
        popupClassName = _a.popupClassName,
        _b = _a.options,
        options = _b === void 0 ? [] : _b,
        disabled = _a.disabled,
        builtinPlacements = _a.builtinPlacements,
        popupPlacement = _a.popupPlacement,
        children = _a.children,
        dropdownRender = _a.dropdownRender,
        restProps = __rest(_a, ["prefixCls", "transitionName", "popupClassName", "options", "disabled", "builtinPlacements", "popupPlacement", "children", "dropdownRender"]); // Did not show popup when there is no options


    var menus = /*#__PURE__*/React.createElement("div", null);
    var emptyMenuClassName = '';

    if (options && options.length > 0) {
      menus = /*#__PURE__*/React.createElement(Menus, _extends({}, this.props, {
        fieldNames: this.getFieldNames(),
        defaultFieldNames: this.defaultFieldNames,
        activeValue: this.state.activeValue,
        onSelect: this.handleMenuSelect,
        onChecked: this.handleMenuChecked,
        onItemDoubleClick: this.handleItemDoubleClick,
        visible: this.state.popupVisible
      }));
    } else {
      emptyMenuClassName = " " + prefixCls + "-menus-empty";
    }

    var popupNode = menus;

    if (dropdownRender) {
      popupNode = dropdownRender(menus);
    }

    return /*#__PURE__*/React.createElement(Trigger, _extends({
      ref: this.saveTrigger
    }, restProps, {
      popupPlacement: popupPlacement,
      builtinPlacements: builtinPlacements,
      popupTransitionName: transitionName,
      action: disabled ? [] : ['click'],
      popupVisible: disabled ? false : this.state.popupVisible,
      onPopupVisibleChange: this.handlePopupVisibleChange,
      prefixCls: prefixCls + "-menus",
      popupClassName: popupClassName + emptyMenuClassName,
      popup: popupNode
    }), cloneElement(children, {
      onKeyDown: this.handleKeyDown,
      tabIndex: disabled ? undefined : 0
    }));
  };

  Cascader.defaultProps = {
    onChange: function onChange() {},
    onPopupVisibleChange: function onPopupVisibleChange() {},
    disabled: false,
    transitionName: '',
    prefixCls: 'rc-multi-leaf-cascader',
    popupClassName: '',
    popupPlacement: 'bottomLeft',
    builtinPlacements: BUILT_IN_PLACEMENTS,
    expandTrigger: 'click',
    fieldNames: {
      label: 'label',
      value: 'value',
      children: 'children'
    },
    expandIcon: '>'
  };
  return Cascader;
})(Component); // TODO: 提供通用的Props， 目前没时间先这样写死


var MultiLeafCascader = function MultiLeafCascader(_a) {
  var _b = _a.options,
      options = _b === void 0 ? [] : _b,
      _c = _a.onChange,
      onChange = _c === void 0 ? function () {} : _c,
      _d = _a.value,
      value = _d === void 0 ? [] : _d;

  var _e = useState([]),
      allLeafOptions = _e[0],
      setAllLeafOptions = _e[1];

  useEffect(function () {
    var allLeafOptions = getAllLeafOptions(options);
    setAllLeafOptions(allLeafOptions);
  }, [options]);
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement(Cascader, {
    value: value,
    options: options,
    allLeafOptions: allLeafOptions,
    onChange: onChange,
    getPopupContainer: function getPopupContainer(node) {
      return node;
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: value,
    placeholder: "\u8BF7\u9009\u62E9",
    mode: "tags",
    onChange: onChange,
    open: false,
    options: allLeafOptions,
    allowClear: true,
    style: {
      width: "360px"
    }
  })));
};

export { MultiLeafCascader };
