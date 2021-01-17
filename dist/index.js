'use strict';

var _express = _interopRequireDefault(require("express"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

require("regenerator-runtime/runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = (0, _express.default)();
var PORT = 3000;

var DataStore = require('nedb');

var PlacementStore = new DataStore({
  filename: './place.json',
  autoload: true
}),
    CampusStore = new DataStore({
  filename: './campus.json',
  autoload: true
}),
    TokenStore = new DataStore({
  filename: './token.json',
  autoload: true
});
var TAGS = {
  PLACEMENT: "#PlacementDaemon",
  PLACEMENT2: "#PlacementDeamon",
  PLACEMENT3: "#PlacemntDaemon"
};
var token = "EAAFy6i3ZALOYBAIoQ7ZCZCF4NTUwdkfMphQQTQU11WfG3teSLYNaDYlnHEmOdutRoyZCTKVTgp6qZBdQHmIDwIr5NKXBJnjZBdELbzHkcbTlXVGZCbcAcgj0ZBMdJmaCFfZAZAeJIHTuBzoO6FvbAb1P7lGPCeIVXsHygb04HRZAWkTi3lZALD70wLey";
var url = "https://graph.facebook.com/525664164162839?fields=posts.limit(4){full_picture,story_tags,message,created_time,message_tags,permalink_url,attachments{subattachments}}&access_token=";
app.get('/update', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _nodeFetch.default)(url + token).then(function (response) {
              return response.json();
            }).then(function (data) {
              return data.posts.data;
            }).catch(function (error) {
              res.send(error.message);
            });

          case 2:
            response = _context.sent;
            response.forEach(function (it) {
              if (it.message_tags[0].name === TAGS.PLACEMENT || it.message_tags[0].name === TAGS.PLACEMENT2) {
                PlacementStore.insert(it);
              } else {
                CampusStore.insert(it);
              }
            });
            res.send(response);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/posts', function (req, res) {
  res.send(CampusStore.getAllData());
});
app.get('/updateToken', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            TokenStore.insert(req);
            res.send('ok');

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.get('/place', function (req, res) {
  res.send(PlaceStore.getAllData());
});
app.listen(PORT, function () {
  console.log("listening at https://md-app-server.herokuapp.com/:".concat(PORT));
});