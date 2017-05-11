'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenConfig = flattenConfig;
exports.getRoutesBySignal = getRoutesBySignal;
exports.hasChangedPath = hasChangedPath;
exports.computeShouldChange = computeShouldChange;

var _Compute = require('cerebral/lib/Compute');

var _DependencyTracker = require('cerebral/lib/DependencyTracker');

var _DependencyTracker2 = _interopRequireDefault(_DependencyTracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var map = _ref2.map,
        path = _ref2.path,
        routes = _ref2.routes,
        rmap = _ref2.rmap,
        signal = _ref2.signal;

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

      var computedKeys = Object.keys(map).filter(function (key) {
        return map[key] instanceof _Compute.Compute;
      });
      if (computedKeys.length) {
        conf.computedMapping = computedKeys.reduce(function (mapping, key) {
          var tracker = new _DependencyTracker2.default(map[key]);
          // We have to wait until we have access to controller before
          // doing the first run.
          mapping[key] = { tracker: tracker, needsInit: true };
          return mapping;
        }, {});
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

    var computedRmapKeys = Object.keys(rmap || {}).filter(function (key) {
      return rmap[key] instanceof _Compute.Compute;
    });

    if (computedRmapKeys.length) {
      conf.rmap = rmap;
      conf.computedRMapping = computedRmapKeys.reduce(function (mapping, key) {
        var tracker = new _DependencyTracker2.default(rmap[key]);
        // We have to wait until we have access to controller before
        // doing the first run.
        mapping[key] = { tracker: tracker, needsInit: true };
        return mapping;
      }, {});
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

// FIXME: this is really slowing the app down for every url compute.
// We should find a way to migrate this into DependencyStore somehow.
function computeShouldChange(tracker, changed) {
  var flatMap = tracker.stateTrackFlatMap;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = changed[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var change = _step.value;

      if (flatMap[change.path.join('.')]) {
        return true;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return false;
}
//# sourceMappingURL=utils.js.map