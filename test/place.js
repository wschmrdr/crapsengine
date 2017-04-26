var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var PassLineBet = require('../crapsengine').PassLineBet;
var PlaceBet = require('../crapsengine').PlaceBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1);
var straightTenGame = new Game(5, 10000, 100, 10);

describe('Odds Ratio for the Place Bet', function() {
  it('should not be allowed with no point', function() {
    try {
    var bet = new PlaceBet();
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal('This point cannot be set for this bet.');
    }
  });
  it('should not be allowed with an invalid point', function() {
    try {
    var bet = new PlaceBet(7);
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal('This point cannot be set for this bet.');
    }
  });
  it('should be nothing if a point is attempted to be established', function() {
    var bet = new PlaceBet(4);
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
  it('Place bets across is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(4), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PlaceBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(5);
    valid = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(6), 6));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PlaceBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(6);
    valid = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(8), 6));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PlaceBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(6);
    valid = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(9), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PlaceBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(10), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PlaceBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(6);
  });
  it('Double dip the 5 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(5), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PlaceBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(7);
  });
  it('dice are out 5 is, 2 is Craps', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(7);
  });
  it('dice are out 5 is, 4 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(PlaceBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(9);
    gameForTest['playerBets'].length.should.equal(6);
  });
  it('dice are out 5 is, 6 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(PlaceBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(6);
    retpay.should.equal(7);
    gameForTest['playerBets'].length.should.equal(5);
  });
  it('dice are out 5 is, 8 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(PlaceBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(6);
    retpay.should.equal(7);
    gameForTest['playerBets'].length.should.equal(4);
  });
  it('dice are out 5 is, 9 Center Field', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(PlaceBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(7);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 5 is, 10 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(PlaceBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(9);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 5 is, 5 No Field winner, pay the line', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var placeRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PlaceBet && ret['bet']['bet']['pointValue'] === 5;
    });
    placeRet['bet']['pid'].should.equal(1);
    placeRet['bet']['amount'].should.equal(5);
    placeRet['pay'].should.equal(7);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Place Bet is Off on the Come Out unless overridden (lose), also must have a line bet', function() {
  it('Place the 5 is a bet, player 2 works', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(5), 5));
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(PlaceBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(5);
    should.not.exist(valid1['override']);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new PlaceBet(5), 5));
    valid2.setOverride(true);
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(PlaceBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(5);
    valid2['override'].should.equal(true);
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
    var place1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    place1Ret['bet']['bet'].constructor.should.equal(PlaceBet);
    place1Ret['bet']['bet']['pointValue'].should.equal(5);
    place1Ret['bet']['amount'].should.equal(5);
    place1Ret['pay'].should.equal(0);
    var place2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    place2Ret['bet']['bet'].constructor.should.equal(PlaceBet);
    place2Ret['bet']['bet']['pointValue'].should.equal(5);
    place2Ret['bet']['amount'].should.equal(5);
    place2Ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Place Bet is Off on the Come Out unless overridden (win)', function() {
  it('Place the 5 is a bet, player 2 works', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(5), 5));
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(PlaceBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(5);
    should.not.exist(valid1['override']);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new PlaceBet(5), 5));
    valid2.setOverride(true);
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(PlaceBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(5);
    valid2['override'].should.equal(true);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 5 No Field, mark it, workers have action', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var place1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    place1Ret['bet']['bet'].constructor.should.equal(PlaceBet);
    place1Ret['bet']['bet']['pointValue'].should.equal(5);
    place1Ret['bet']['amount'].should.equal(5);
    place1Ret['pay'].should.equal(0);
    var place2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    place2Ret['bet']['bet'].constructor.should.equal(PlaceBet);
    place2Ret['bet']['bet']['pointValue'].should.equal(5);
    place2Ret['bet']['amount'].should.equal(5);
    place2Ret['pay'].should.equal(7);
    gameForTest['playerBets'].length.should.equal(1);
  });
});
describe('Place Bet truncates on pay', function() {
  it('Place 6 and 8 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(6), 10));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PlaceBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(10);
    valid = gameForTest.makeBet(new PlayerBet(1, new PlaceBet(8), 10));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PlaceBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(10);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 5 is, 6 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(PlaceBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(10);
    retpay.should.equal(11); // The calculation is 70/6, or 11 2/3, but we must truncate
    gameForTest['playerBets'].length.should.equal(2);
  });
});
describe('Place Bet loses', function() {
  it('dice are out 5 is, 7 out, line away', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    var placeRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PlaceBet && ret['bet']['bet']['pointValue'] === 8;
    });
    placeRet['bet']['pid'].should.equal(1);
    placeRet['bet']['amount'].should.equal(10);
    placeRet['pay'].should.equal(-10);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
