'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenConfig = flattenConfig;
exports.getRoutesBySignal = getRoutesBySignal;
exports.hasChangedPath = hasChangedPath;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function compatConfig(config) {
  var _ref;

  var prev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return (_ref = []).concat.apply(_ref, _toConsumableArray(Object.keys(config).map(function (key) {
    var conf = config[key];
    if (typeof conf === 'string') {
      return [{ path: prev + key, signal: conf }];
    }
    return compatConfig(conf, prev + key);
  })));
}

function flattenConfig(config) {
  var prev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (!Array.isArray(config)) {
    config = compatConfig(config);
  }
  return config.reduce(function (flattened, _ref2) {
    var path = _ref2.path,
        signal = _ref2.signal,
        map = _ref2.map,
        routes = _ref2.routes;

    if (routes) {
      Object.assign(flattened, flattenConfig(routes, prev + path));
    }

    var currentPath = prev + path;
    var conf = { signal: signal };
    if (map) {
      conf.map = map;
      var stateMapping = Object.keys(map).filter(function (key) {
        return map[key].type === 'state';
      });
      if (stateMapping.length) {
        conf.stateMapping = stateMapping;
      }

      var propsMapping = Object.keys(map).filter(function (key) {
        return map[key].type === 'props';
      });
      if (propsMapping.length) {
        conf.propsMapping = propsMapping;
        if (!signal) {
          throw new Error('Cerebral router - route ' + currentPath + ' has props mappings but no signal was defined.');
        }
      }
    }

    flattened[currentPath] = conf;

    return flattened;
  }, {});
}

function getRoutesBySignal(config) {
  return Object.keys(config).reduce(function (routableSignals, route) {
    var signalName = config[route].signal;


    if (!signalName) {
      return routableSignals;
    }

    if (routableSignals[signalName]) {
      throw new Error('Cerebral router - The signal ' + signalName + ' has already been bound to route ' + route + '. Create a new signal and reuse actions instead if needed.');
    }

    routableSignals[signalName] = route;

    return routableSignals;
  }, {});
}

function hasChangedPath(changes, path) {
  for (var change in changes) {
    if (changes[change].path.join('.') === path) {
      return true;
    }
  }
}
//# sourceMappingURL=utils.js.map