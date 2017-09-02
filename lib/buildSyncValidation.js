'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setError = undefined;

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setError = function setError(errors, error) {
    if (error.dataPath.charAt(0) == '.') {
        var dataPathParts = error.dataPath.split('.').slice(1);
        //  regular expression to  get the object path and index from the ajv error data path
        var re = /(^\w+)\[([0-9]+)\]/gm;

        dataPathParts.reduce(function (errors, part, index) {
            var res = re.exec(part);

            if (res && res.length > 0) {
                var p = res[1];
                var i = res[2];
                if (!errors[p]) {
                    errors[p] = [];
                }
                if (typeof errors[p] == 'string') {
                    var err = errors[p];
                    errors[p] = [];
                    errors[p]._error = err;
                }
                if (index === dataPathParts.length - 1) {
                    errors[p][i] = error.message;
                } else {
                    errors[p][i] = errors[p][i] || {};
                }
                return errors[p][i];
            }

            if (index === dataPathParts.length - 1) {
                if (typeof errors == 'string') {
                    var _err = errors;
                    errors = [];
                    errors._error = _err;
                    errors[part] = error.message;
                } else {
                    errors[part] = error.message;
                }
            }
            if (!errors[part]) {
                errors[part] = {};
            }
            return errors[part];
        }, errors);
    } else {
        var _dataPathParts = error.dataPath.split('/').slice(1);
        _dataPathParts.reduce(function (errors, part, index) {
            if (index === _dataPathParts.length - 1) {
                if (typeof errors == 'string') {
                    var err = errors;
                    errors = [];
                    errors._error = err;
                    errors[part] = error.message;
                } else {
                    errors[part] = error.message;
                }
            }
            if (!errors[part]) {
                errors[part] = {};
            }
            return errors[part];
        }, errors);
    }
    return errors;
};

var buildSyncValidation = function buildSyncValidation(schema) {
    var ajv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _ajv2.default({ errorDataPath: 'property', allErrors: true });

    return function (values) {
        var errors = {};
        var valid = ajv.validate(schema, values);
        if (valid) {
            return {};
        }
        var ajvErrors = ajv.errors;

        ajvErrors.forEach(function (error) {
            setError(errors, error);
        });
        return errors;
    };
};

exports.default = buildSyncValidation;
exports.setError = setError;