"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _renderer = require("@react-pdf/renderer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const styles = _renderer.StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

class Test extends _react.PureComponent {
  render() {
    return _react.default.createElement(_renderer.Document, null, _react.default.createElement(_renderer.Page, {
      size: "A4",
      style: styles.page
    }, _react.default.createElement(_renderer.View, {
      style: styles.section
    }, _react.default.createElement(_renderer.Text, null, this.props.a)), _react.default.createElement(_renderer.View, {
      style: styles.section
    }, _react.default.createElement(_renderer.Text, null, this.props.b))));
  }

}

exports.default = Test;

_defineProperty(Test, "propTypes", {
  a: _propTypes.default.string.isRequired,
  b: _propTypes.default.string.isRequired
});