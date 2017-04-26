var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var DontPassLineBet = require('../crapsengine').DontPassLineBet;
var LayBet = require('../crapsengine').LayBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1, false);
var straightTenGame = new Game(5, 10000, 100, 10, false);

describe('Bet Odds Ratio and corresponding pays for the Lay Bet', function() {
  it('should not be allowed with no point', function() {
    try {
    var bet = new LayBet();
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal('This point cannot be set for this bet.');
    }
  });
  it('should not be allowed with an invalid point', function() {
    try {
    var bet = new LayBet(7);
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal('This point cannot be set for this bet.');
    }
  });
  it('should be 3/6 for a 4, but nothing on game odds', function() {
    var bet = new LayBet(4);
    bet.getBetOddsRatio().should.equal(3/6);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 4/6 for a 5, but nothing on game odds', function() {
    var bet = new LayBet(5);
    bet.getBetOddsRatio().should.equal(4/6);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 5/6 for a 6, but nothing on game odds', function() {
    var bet = new LayBet(6);
    bet.getBetOddsRatio().should.equal(5/6);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 5/6 for a 8, but nothing on game odds', function() {
    var bet = new LayBet(8);
    bet.getBetOddsRatio().should.equal(5/6);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 4/6 for a 9, but nothing on game odds', function() {
    var bet = new LayBet(9);
    bet.getBetOddsRatio().should.equal(4/6);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 3/6 for a 10, but nothing on game odds', function() {
    var bet = new LayBet(10);
    bet.getBetOddsRatio().should.equal(3/6);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
});
describe('Lay Bet Wins', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Lay bets across is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new LayBet(4), 40));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(40);
    valid = gameForTest.makeBet(new PlayerBet(1, new LayBet(6), 24));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(24);
    valid = gameForTest.makeBet(new PlayerBet(1, new LayBet(8), 24));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(24);
    valid = gameForTest.makeBet(new PlayerBet(1, new LayBet(9), 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(30);
    valid = gameForTest.makeBet(new PlayerBet(1, new LayBet(10), 40));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(40);
    gameForTest['playerBets'].length.should.equal(6);
  });
  it('Double dip the 5 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new LayBet(5), 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(30);
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
  it('dice are out 5 is, 7 out, pay the donts, pay behind', function() {
    var retValues = [];
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var lay4Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 4;
    });
    lay4Ret['bet']['pid'].should.equal(1);
    lay4Ret['bet']['amount'].should.equal(40);
    lay4Ret['pay'].should.equal(19);
    var lay5Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 5;
    });
    lay5Ret['bet']['pid'].should.equal(1);
    lay5Ret['bet']['amount'].should.equal(30);
    lay5Ret['pay'].should.equal(19);
    var lay6Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 6;
    });
    lay6Ret['bet']['pid'].should.equal(1);
    lay6Ret['bet']['amount'].should.equal(24);
    lay6Ret['pay'].should.equal(19);
    var lay8Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 8;
    });
    lay8Ret['bet']['pid'].should.equal(1);
    lay8Ret['bet']['amount'].should.equal(24);
    lay8Ret['pay'].should.equal(19);
    var lay9Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 9;
    });
    lay9Ret['bet']['pid'].should.equal(1);
    lay9Ret['bet']['amount'].should.equal(30);
    lay9Ret['pay'].should.equal(19);
    var lay10Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 10;
    });
    lay10Ret['bet']['pid'].should.equal(1);
    lay10Ret['bet']['amount'].should.equal(40);
    lay10Ret['pay'].should.equal(19);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Lay Bet is On on the Come Out unless overridden (win), also must have a line bet', function() {
  it('Lay the 5 is a bet, player 1 is off', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new LayBet(5), 30));
    valid1.setOverride(false);
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(LayBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(30);
    valid1['override'].should.equal(false);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new LayBet(5), 30));
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(LayBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(30);
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
  it('coming out, 7 front line winner, take the donts, pay behind', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var lay1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    lay1Ret['bet']['bet'].constructor.should.equal(LayBet);
    lay1Ret['bet']['bet']['pointValue'].should.equal(5);
    lay1Ret['bet']['amount'].should.equal(30);
    lay1Ret['pay'].should.equal(0);
    var lay2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    lay2Ret['bet']['bet'].constructor.should.equal(LayBet);
    lay2Ret['bet']['bet']['pointValue'].should.equal(5);
    lay2Ret['bet']['amount'].should.equal(30);
    lay2Ret['pay'].should.equal(19);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Lay Bet is On on the Come Out unless overridden (lose)', function() {
  it('Lay the 5 is a bet, player 1 is off', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new LayBet(5), 30));
    valid1.setOverride(false);
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(LayBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(30);
    valid1['override'].should.equal(false);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new LayBet(5), 30));
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(LayBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(30);
    should.not.exist(valid2['override']);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 5 No Field, mark it, down behind', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var lay1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    lay1Ret['bet']['bet'].constructor.should.equal(LayBet);
    lay1Ret['bet']['bet']['pointValue'].should.equal(5);
    lay1Ret['bet']['amount'].should.equal(30);
    lay1Ret['pay'].should.equal(0);
    var lay2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    lay2Ret['bet']['bet'].constructor.should.equal(LayBet);
    lay2Ret['bet']['bet']['pointValue'].should.equal(5);
    lay2Ret['bet']['amount'].should.equal(30);
    lay2Ret['pay'].should.equal(-30);
    gameForTest['playerBets'].length.should.equal(1);
  });
});
describe('Lay Bet loses', function() {
  it('Lay 6 and 8 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new LayBet(6), 23));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(23);
    valid = gameForTest.makeBet(new PlayerBet(1, new LayBet(8), 23));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(23);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 5 is, 6 came Easy, down behind', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(LayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(23);
    retpay.should.equal(-23);
    gameForTest['playerBets'].length.should.equal(2);
  });
});
describe('Lay Bet truncates on pay', function() {
  it('dice are out 5 is, 7 out, pay the donts, pay behind', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    var layRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 8;
    });
    layRet['bet']['pid'].should.equal(1);
    layRet['bet']['amount'].should.equal(23);
    layRet['pay'].should.equal(18); // The calculation is 115/6 (19 1/6), vigor of 1, but we must truncate
    gameForTest['playerBets'].length.should.equal(0);
  });
});

// Now do a "stingy" game where the commission is paid on the bet.
var gameWithVigForTest = new Game(5, 10000, 100, -2, true);

describe('Lay Bet with commission on Bet Wins', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameWithVigForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameWithVigForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameWithVigForTest['playerBets'].length.should.equal(1);
  });
  it('Lay bets across is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(4), 41));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(40);
    valid['preVigAmount'].should.equal(41);
    valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(6), 25));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(24);
    valid['preVigAmount'].should.equal(25);
    valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(8), 25));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(24);
    valid['preVigAmount'].should.equal(25);
    valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(9), 31));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(30);
    valid['preVigAmount'].should.equal(31);
    valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(10), 41));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(40);
    valid['preVigAmount'].should.equal(41);
    gameWithVigForTest['playerBets'].length.should.equal(6);
    gameWithVigForTest['playerBets'].length.should.equal(6);
  });
  it('Double dip the 5 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(5), 31));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(30);
    valid['preVigAmount'].should.equal(31);
    gameWithVigForTest['playerBets'].length.should.equal(7);
  });
  it('dice are out 5 is, 7 out, pay the donts, pay behind', function() {
    var retValues = [];
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var lay4Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 4;
    });
    lay4Ret['bet']['pid'].should.equal(1);
    lay4Ret['bet']['amount'].should.equal(40);
    lay4Ret['pay'].should.equal(20);
    var lay5Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 5;
    });
    lay5Ret['bet']['pid'].should.equal(1);
    lay5Ret['bet']['amount'].should.equal(30);
    lay5Ret['pay'].should.equal(20);
    var lay6Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 6;
    });
    lay6Ret['bet']['pid'].should.equal(1);
    lay6Ret['bet']['amount'].should.equal(24);
    lay6Ret['pay'].should.equal(20);
    var lay8Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 8;
    });
    lay8Ret['bet']['pid'].should.equal(1);
    lay8Ret['bet']['amount'].should.equal(24);
    lay8Ret['pay'].should.equal(20);
    var lay9Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 9;
    });
    lay9Ret['bet']['pid'].should.equal(1);
    lay9Ret['bet']['amount'].should.equal(30);
    lay9Ret['pay'].should.equal(20);
    var lay10Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 10;
    });
    lay10Ret['bet']['pid'].should.equal(1);
    lay10Ret['bet']['amount'].should.equal(40);
    lay10Ret['pay'].should.equal(20);
    gameWithVigForTest['playerBets'].length.should.equal(0);
  });
});
describe('Lay Bet with commission on Bet is On on the Come Out unless overridden (win)', function() {
  it('Lay the 5 is a bet, player 1 is off', function() {
    var valid1 = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(5), 31));
    valid1.setOverride(false);
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(LayBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(30);
    valid1['preVigAmount'].should.equal(31);
    valid1['override'].should.equal(false);
    var valid2 = gameWithVigForTest.makeBet(new PlayerBet(2, new LayBet(5), 31));
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(LayBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(30);
    valid2['preVigAmount'].should.equal(31);
    should.not.exist(valid2['override']);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 7 front line winner, take the donts, pay behind', function() {
    var retValues = [];
    gameWithVigForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameWithVigForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var lay1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    lay1Ret['bet']['bet'].constructor.should.equal(LayBet);
    lay1Ret['bet']['bet']['pointValue'].should.equal(5);
    lay1Ret['bet']['amount'].should.equal(30);
    lay1Ret['pay'].should.equal(0);
    var lay2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    lay2Ret['bet']['bet'].constructor.should.equal(LayBet);
    lay2Ret['bet']['bet']['pointValue'].should.equal(5);
    lay2Ret['bet']['amount'].should.equal(30);
    lay2Ret['pay'].should.equal(20);
    gameWithVigForTest['playerBets'].length.should.equal(0);
  });
});
describe('Lay Bet with commission on Bet is On on the Come Out unless overridden (lose)', function() {
  it('Lay the 5 is a bet, player 1 is off', function() {
    var valid1 = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(5), 31));
    valid1.setOverride(false);
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(LayBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(30);
    valid1['preVigAmount'].should.equal(31);
    valid1['override'].should.equal(false);
    var valid2 = gameWithVigForTest.makeBet(new PlayerBet(2, new LayBet(5), 31));
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(LayBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(30);
    valid2['preVigAmount'].should.equal(31);
    should.not.exist(valid2['override']);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 5 No Field, mark it, down behind', function() {
    var retValues = [];
    gameWithVigForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameWithVigForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var lay1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    lay1Ret['bet']['bet'].constructor.should.equal(LayBet);
    lay1Ret['bet']['bet']['pointValue'].should.equal(5);
    lay1Ret['bet']['amount'].should.equal(30);
    lay1Ret['pay'].should.equal(0);
    var lay2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    lay2Ret['bet']['bet'].constructor.should.equal(LayBet);
    lay2Ret['bet']['bet']['pointValue'].should.equal(5);
    lay2Ret['bet']['amount'].should.equal(30);
    lay2Ret['pay'].should.equal(-30);
    gameWithVigForTest['playerBets'].length.should.equal(1);
  });
});
describe('Lay Bet commission truncates', function() {
  it('Lay 4 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(4), 51));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(50);
    valid['preVigAmount'].should.equal(51);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
});
describe('Lay Bet with commission on Bet loses', function() {
  it('dice are out 5 is, 4 came Easy, down behind', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(LayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(50);
    retpay.should.equal(-50);
    gameWithVigForTest['playerBets'].length.should.equal(1);
  });
});
describe('Lay Bet can be pressed and the commission will remain for the whole bet', function() {
  it('Lay 10 is a bet, odds pressed to main', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(10), 21, 20), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(40);
    valid['preVigAmount'].should.equal(41);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('Pressure the Lay 10 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(10), 10));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(50);
    valid['preVigAmount'].should.equal(51);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('Pressure the Lay 10 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new LayBet(10), 0, 5), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(LayBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(55);
    valid['preVigAmount'].should.equal(56);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
});
describe('Lay Bet with commission on Bet truncates on pay', function() {
  it('dice are out 5 is, 7 out, pay the donts, pay behind', function() {
    var retValues = [];
    gameWithVigForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameWithVigForTest['playerBets'].length.should.equal(0);
    var layRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === LayBet && ret['bet']['bet']['pointValue'] === 10;
    });
    layRet['bet']['pid'].should.equal(1);
    layRet['bet']['amount'].should.equal(55);
    layRet['pay'].should.equal(27); // Should be 55/2 (27 1/2), but we must truncate
    gameWithVigForTest['playerBets'].length.should.equal(0);
  });
});
