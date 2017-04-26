var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var PassLineBet = require('../crapsengine').PassLineBet;
var FieldBet = require('../crapsengine').FieldBet;
var StingyFieldBet = require('../crapsengine').StingyFieldBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1);
var straightTenGame = new Game(5, 10000, 100, 10);

describe('Bet Odds Ratio and corresponding pays for the Field Bet', function() {
  it('should be nothing for no point', function() {
    var bet = new FieldBet();
    bet.getBetOddsRatio().should.equal(0);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
    var bet = new StingyFieldBet();
    bet.getBetOddsRatio().should.equal(0);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be nothing if a point is attempted to be established', function() {
    var bet = new FieldBet(4);
    bet.getBetOddsRatio().should.equal(0);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
    var bet = new StingyFieldBet(4);
    bet.getBetOddsRatio().should.equal(0);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
});
describe('Field Bet Check', function() {
  it('Field is a bet, no roll no line', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(FieldBet);
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('no bet, no odds on the field', function() {
    // Come without point assumes new Come Bet (that is allowed). This bet has no main action.
    try {
      gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 0, 25));
    } catch(e) {
      e.name.should.equal('GameOddsMaximumError');
      e.message.should.equal("Odds exceed the maximum, and the main bet cannot be pressed.");
    }
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 2 is Craps, double the field', function() {
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(10);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 3 is Craps, single the field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 4 came Easy, field roll', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 6 came Easy, no field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 8 came Easy, no field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 9 Center Field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 10 came Easy, field roll', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 11 Yo, good field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 12 is Craps, triple the field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(FieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(15);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 7 out, line away', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new FieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    var fieldRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === FieldBet;
    });
    fieldRet['bet']['pid'].should.equal(1);
    fieldRet['bet']['amount'].should.equal(5);
    fieldRet['pay'].should.equal(-5);
  });
});
describe('Stingy Field Bet Check', function() {
  it('Stingy Field is a bet, no roll no line', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(StingyFieldBet);
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('no bet, no odds on the field', function() {
    // Come without point assumes new Come Bet (that is allowed). This bet has no main action.
    try {
      gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 0, 25));
    } catch(e) {
      e.name.should.equal('GameOddsMaximumError');
      e.message.should.equal("Odds exceed the maximum, and the main bet cannot be pressed.");
    }
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 2 is Craps, double the field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(10);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 3 is Craps, single the field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 4 came Easy, field roll', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 6 came Easy, no field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 8 came Easy, no field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 9 Center Field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 10 came Easy, field roll', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 11 Yo, good field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 12 is Craps, double the field', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(StingyFieldBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(10);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 7 out, line away', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new StingyFieldBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    var fieldRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === StingyFieldBet;
    });
    fieldRet['bet']['pid'].should.equal(1);
    fieldRet['bet']['amount'].should.equal(5);
    fieldRet['pay'].should.equal(-5);
  });
});
