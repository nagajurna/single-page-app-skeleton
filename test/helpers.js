var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index.js');

chai.use(chaiHttp);

global.app = app;
global.chai = chai;
global.expect = chai.expect;
global.request = chai.request(app);

