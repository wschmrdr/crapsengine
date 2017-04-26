var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;

function importTest(name, path) {
  describe(name, function() {
    require(path);
  });
}

var gameForTest = new Game();

describe('main', function() {
  importTest('Dice Roll Unit Test', './diceroll');
  importTest('Pass Line Bets', './passline');
  importTest('Come Bets', './come');
  importTest('Dont Pass Line Bets', './dontpassline');
  importTest('Dont Come Bets', './dontcome');
  importTest('Field Bets', './field');
  importTest('Big Bets', './big');
  importTest('Place Bets', './place');
  importTest('Buy Bets', './buy');
  importTest('Lay Bets', './lay');
  importTest('Hardway Bets', './hardway');
  importTest('One Roll Center Bets', './onerollcenter');
  importTest('Custom Bets', './custom');
});
