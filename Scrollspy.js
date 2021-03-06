'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _throttle = require('./throttle');

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isEqualArray(a, b) {
  return a.length === b.length && a.every(function (item, index) {
    return item === b[index];
  });
}

var Scrollspy = function (_React$Component) {
  (0, _inherits3.default)(Scrollspy, _React$Component);
  (0, _createClass3.default)(Scrollspy, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        items: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
        currentClassName: _propTypes2.default.string.isRequired,
        scrolledPastClassName: _propTypes2.default.string,
        style: _propTypes2.default.object,
        componentTag: _propTypes2.default.oneOf([_propTypes2.default.string, _propTypes2.default.func]),
        offset: _propTypes2.default.number,
        rootEl: _propTypes2.default.string,
        onUpdate: _propTypes2.default.func
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        items: [],
        currentClassName: '',
        style: {},
        componentTag: 'ul',
        offset: 0,
        onUpdate: function onUpdate() {}
      };
    }
  }]);

  function Scrollspy(props) {
    (0, _classCallCheck3.default)(this, Scrollspy);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Scrollspy.__proto__ || (0, _getPrototypeOf2.default)(Scrollspy)).call(this, props));

    _this.state = {
      targetItems: [],
      inViewState: [],
      isScrolledPast: []

      // manually bind as ES6 does not apply this
      // auto binding as React.createClass does
    };_this._handleSpy = _this._handleSpy.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Scrollspy, [{
    key: '_initSpyTarget',
    value: function _initSpyTarget(items) {
      var targetItems = items.map(function (item) {

        return document.getElementById(item);
      });

      return targetItems;
    }

    // https://github.com/makotot/react-scrollspy/pull/45

  }, {
    key: '_fillArray',
    value: function _fillArray(array, val) {
      var newArray = [];

      for (var i = 0, max = array.length; i < max; i++) {
        newArray[i] = val;
      }

      return newArray;
    }
  }, {
    key: '_isScrolled',
    value: function _isScrolled() {
      return this._getScrollDimension().scrollTop > 0;
    }
  }, {
    key: '_getScrollDimension',
    value: function _getScrollDimension() {
      var doc = document;
      var rootEl = this.props.rootEl;

      var scrollTop = rootEl ? doc.querySelector(rootEl).scrollTop : doc.documentElement.scrollTop || doc.body.parentNode.scrollTop || doc.body.scrollTop;
      var scrollHeight = rootEl ? doc.querySelector(rootEl).scrollHeight : doc.documentElement.scrollHeight || doc.body.parentNode.scrollHeight || doc.body.scrollHeight;

      return {
        scrollTop: scrollTop,
        scrollHeight: scrollHeight
      };
    }
  }, {
    key: '_getElemsViewState',
    value: function _getElemsViewState(targets) {
      var elemsInView = [];
      var elemsOutView = [];
      var viewStatusList = [];

      var targetItems = targets ? targets : this.state.targetItems;

      var hasInViewAlready = false;

      for (var i = 0, max = targetItems.length; i < max; i++) {
        var currentContent = targetItems[i];
        var isInView = hasInViewAlready ? false : this._isInView(currentContent);

        if (isInView) {
          hasInViewAlready = true;
          elemsInView.push(currentContent);
        } else {
          elemsOutView.push(currentContent);
        }

        var isLastItem = i === max - 1;
        var isScrolled = this._isScrolled();

        // https://github.com/makotot/react-scrollspy/pull/26#issue-167413769
        var isLastShortItemAtBottom = this._isAtBottom() && this._isInView(currentContent) && !isInView && isLastItem && isScrolled;

        if (isLastShortItemAtBottom) {
          elemsOutView.pop();
          elemsOutView.push.apply(elemsOutView, (0, _toConsumableArray3.default)(elemsInView));
          elemsInView = [currentContent];
          viewStatusList = this._fillArray(viewStatusList, false);
          isInView = true;
        }

        viewStatusList.push(isInView);
      }

      return {
        inView: elemsInView,
        outView: elemsOutView,
        viewStatusList: viewStatusList,
        scrolledPast: this.props.scrolledPastClassName && this._getScrolledPast(viewStatusList)
      };
    }
  }, {
    key: '_isInView',
    value: function _isInView(el) {
      if (!el) {
        return false;
      }

      var _props = this.props,
          rootEl = _props.rootEl,
          offset = _props.offset;

      var rootRect = void 0;

      if (rootEl) {
        rootRect = document.querySelector(rootEl).getBoundingClientRect();
      }

      var rect = el.getBoundingClientRect();
      var winH = rootEl ? rootRect.height : window.innerHeight;

      var _getScrollDimension2 = this._getScrollDimension(),
          scrollTop = _getScrollDimension2.scrollTop;

      var scrollBottom = scrollTop + winH;
      var elTop = rootEl ? rect.top + scrollTop - rootRect.top + offset : rect.top + scrollTop + offset;
      var elBottom = elTop + el.offsetHeight;

      return elTop < scrollBottom && elBottom >= scrollTop;
    }
  }, {
    key: '_isAtBottom',
    value: function _isAtBottom() {
      var rootEl = this.props.rootEl;

      var _getScrollDimension3 = this._getScrollDimension(),
          scrollTop = _getScrollDimension3.scrollTop,
          scrollHeight = _getScrollDimension3.scrollHeight;

      var winH = rootEl ? document.querySelector(rootEl).getBoundingClientRect().height : window.innerHeight;
      var scrolledToBottom = scrollTop + winH >= scrollHeight;

      return scrolledToBottom;
    }
  }, {
    key: '_getScrolledPast',
    value: function _getScrolledPast(viewStatusList) {
      if (!viewStatusList.some(function (item) {
        return item;
      })) {
        return viewStatusList;
      }

      var hasFoundInView = false;

      var scrolledPastItems = viewStatusList.map(function (item) {
        if (item && !hasFoundInView) {
          hasFoundInView = true;

          return false;
        }

        return !hasFoundInView;
      });

      return scrolledPastItems;
    }
  }, {
    key: '_spy',
    value: function _spy(targets) {
      var _this2 = this;

      var elemensViewState = this._getElemsViewState(targets);
      var currentStatuses = this.state.inViewState;

      this.setState({
        inViewState: elemensViewState.viewStatusList,
        isScrolledPast: elemensViewState.scrolledPast
      }, function () {
        _this2._update(currentStatuses);
      });
    }
  }, {
    key: '_update',
    value: function _update(prevStatuses) {
      if (isEqualArray(this.state.inViewState, prevStatuses)) {
        return;
      }

      this.props.onUpdate(this.state.targetItems[this.state.inViewState.indexOf(true)]);
    }
  }, {
    key: '_handleSpy',
    value: function _handleSpy() {
      (0, _throttle2.default)(this._spy(), 100);
    }
  }, {
    key: '_initFromProps',
    value: function _initFromProps() {
      var targetItems = this._initSpyTarget(this.props.items);

      this.setState({
        targetItems: targetItems
      });

      this._spy(targetItems);
    }
  }, {
    key: 'offEvent',
    value: function offEvent() {
      var el = this.props.rootEl ? document.querySelector(this.props.rootEl) : window;

      el.removeEventListener('scroll', this._handleSpy);
    }
  }, {
    key: 'onEvent',
    value: function onEvent() {
      var el = this.props.rootEl ? document.querySelector(this.props.rootEl) : window;

      el.addEventListener('scroll', this._handleSpy);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._initFromProps();
      this.onEvent();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.offEvent();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this._initFromProps();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var Tag = this.props.componentTag;
      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          scrolledPastClassName = _props2.scrolledPastClassName,
          style = _props2.style;

      var counter = 0;
      var items = _react2.default.Children.map(children, function (child, idx) {
        var _classNames;

        if (!child) {
          return null;
        }

        var ChildTag = child.type;
        var isScrolledPast = scrolledPastClassName && _this3.state.isScrolledPast[idx];
        var childClass = (0, _classnames2.default)((_classNames = {}, (0, _defineProperty3.default)(_classNames, '' + child.props.className, child.props.className), (0, _defineProperty3.default)(_classNames, '' + _this3.props.currentClassName, _this3.state.inViewState[idx]), (0, _defineProperty3.default)(_classNames, '' + _this3.props.scrolledPastClassName, isScrolledPast), _classNames));

        return _react2.default.createElement(
          ChildTag,
          (0, _extends3.default)({}, child.props, { className: childClass, key: counter++ }),
          child.props.children
        );
      });

      var itemClass = (0, _classnames2.default)((0, _defineProperty3.default)({}, '' + className, className));

      return _react2.default.createElement(
        Tag,
        { className: itemClass, style: style },
        items
      );
    }
  }]);
  return Scrollspy;
}(_react2.default.Component);

exports.default = Scrollspy;