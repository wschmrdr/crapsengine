var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var PassLineBet = require('../crapsengine').PassLineBet;
var BigBet = require('../crapsengine').BigBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1);
var straightTenGame = new Game(5, 10000, 100, 10);

describe('Odds Ratio for the Big Bet', function() {
  it('should not be allowed with no point', function() {
    try {
    var bet = new BigBet();
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal('This point cannot be set for this bet.');
    }
  });
  it('should not be allowed with an invalid point', function() {
    try {
    var bet = new BigBet(7);
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal('This point cannot be set for this bet.');
    }
  });
  it('should be nothing if a point is attempted to be established', function() {
    var bet = new BigBet(6);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
});
describe('Place Bet Wins', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Big 6 and Big 8 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new BigBet(6), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BigBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(5);
    valid = gameForTest.makeBet(new PlayerBet(1, new BigBet(8), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BigBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 5 is, 2 is Craps', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 5 is, 6 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BigBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 5 is, 8 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BigBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 5 No Field winner, pay the line', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Big Bet is On on the Come Out unless overridden (lose), also must have a line bet', function() {
  it('Big 6 is a bet, player 1 is off', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new BigBet(6), 5));
    valid1.setOverride(false);
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(BigBet);
    valid1['bet']['pointValue'].should.equal(6);
    valid1['amount'].should.equal(5);
    valid1['override'].should.equal(false);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new BigBet(6), 5));
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(BigBet);
    valid2['bet']['pointValue'].should.equal(6);
    valid2['amount'].should.equal(5);
    should.not.exist(valid2['override']);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('no roll no line', function() {
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 7 front line winner, pay the line, workers have action', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var big1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    big1Ret['bet']['bet'].constructor.should.equal(BigBet);
    big1Ret['bet']['bet']['pointValue'].should.equal(6);
    big1Ret['bet']['amount'].should.equal(5);
    big1Ret['pay'].should.equal(0);
    var big2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    big2Ret['bet']['bet'].constructor.should.equal(BigBet);
    big2Ret['bet']['bet']['pointValue'].should.equal(6);
    big2Ret['bet']['amount'].should.equal(5);
    big2Ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Place Bet is Off on the Come Out unless overridden (win)', function() {
  it('Big 6 is a bet, player 1 is off', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new BigBet(6), 5));
    valid1.setOverride(false);
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(BigBet);
    valid1['bet']['pointValue'].should.equal(6);
    valid1['amount'].should.equal(5);
    valid1['override'].should.equal(false);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new BigBet(6), 5));
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(BigBet);
    valid2['bet']['pointValue'].should.equal(6);
    valid2['amount'].should.equal(5);
    should.not.exist(valid2['override']);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 6 came Easy, mark it, workers have action', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var big1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    big1Ret['bet']['bet'].constructor.should.equal(BigBet);
    big1Ret['bet']['bet']['pointValue'].should.equal(6);
    big1Ret['bet']['amount'].should.equal(5);
    big1Ret['pay'].should.equal(0);
    var big2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    big2Ret['bet']['bet'].constructor.should.equal(BigBet);
    big2Ret['bet']['bet']['pointValue'].should.equal(6);
    big2Ret['bet']['amount'].should.equal(5);
    big2Ret['pay'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
});
describe('Big Bet loses', function() {
  it('Big 6 and Big 8 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new BigBet(6), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BigBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(5);
    valid = gameForTest.makeBet(new PlayerBet(1, new BigBet(8), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BigBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 6 is, 7 out, line away', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    var big6Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === BigBet && ret['bet']['bet']['pointValue'] === 6;
    });
    big6Ret['bet']['pid'].should.equal(1);
    big6Ret['bet']['amount'].should.equal(5);
    big6Ret['pay'].should.equal(-5);
    var big8Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === BigBet && ret['bet']['bet']['pointValue'] === 8;
    });
    big8Ret['bet']['pid'].should.equal(1);
    big8Ret['bet']['amount'].should.equal(5);
    big8Ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
