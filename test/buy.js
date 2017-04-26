var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var PassLineBet = require('../crapsengine').PassLineBet;
var BuyBet = require('../crapsengine').BuyBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1, false);
var straightTenGame = new Game(5, 10000, 100, 10, false);

describe('Bet Odds Ratio and corresponding pays for the Buy Bet', function() {
  it('should not be allowed with no point', function() {
    try {
    var bet = new BuyBet();
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal('This point cannot be set for this bet.');
    }
  });
  it('should not be allowed with an invalid point', function() {
    try {
    var bet = new BuyBet(7);
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal('This point cannot be set for this bet.');
    }
  });
  it('should be 6/3 for a 4, but nothing on game odds', function() {
    var bet = new BuyBet(4);
    bet.getBetOddsRatio().should.equal(6/3);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 6/4 for a 5, but nothing on game odds', function() {
    var bet = new BuyBet(5);
    bet.getBetOddsRatio().should.equal(6/4);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 6/5 for a 6, but nothing on game odds', function() {
    var bet = new BuyBet(6);
    bet.getBetOddsRatio().should.equal(6/5);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 6/5 for a 8, but nothing on game odds', function() {
    var bet = new BuyBet(8);
    bet.getBetOddsRatio().should.equal(6/5);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 6/4 for a 9, but nothing on game odds', function() {
    var bet = new BuyBet(9);
    bet.getBetOddsRatio().should.equal(6/4);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
  it('should be 6/3 for a 10, but nothing on game odds', function() {
    var bet = new BuyBet(10);
    bet.getBetOddsRatio().should.equal(6/3);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
});
describe('Buy Bet Wins', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Buy bets across is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new BuyBet(4), 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(20);
    valid = gameForTest.makeBet(new PlayerBet(1, new BuyBet(6), 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(20);
    valid = gameForTest.makeBet(new PlayerBet(1, new BuyBet(8), 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(20);
    valid = gameForTest.makeBet(new PlayerBet(1, new BuyBet(9), 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(20);
    valid = gameForTest.makeBet(new PlayerBet(1, new BuyBet(10), 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(20);
    gameForTest['playerBets'].length.should.equal(6);
  });
  it('Double dip the 5 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new BuyBet(5), 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(20);
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
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(39);
    gameForTest['playerBets'].length.should.equal(6);
  });
  it('dice are out 5 is, 6 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(23);
    gameForTest['playerBets'].length.should.equal(5);
  });
  it('dice are out 5 is, 8 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(23);
    gameForTest['playerBets'].length.should.equal(4);
  });
  it('dice are out 5 is, 9 Center Field', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(29);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 5 is, 10 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(39);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 5 is, 5 No Field winner, pay the line', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var buyRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === BuyBet && ret['bet']['bet']['pointValue'] === 5;
    });
    buyRet['bet']['pid'].should.equal(1);
    buyRet['bet']['amount'].should.equal(20);
    buyRet['pay'].should.equal(29);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Buy Bet is Off on the Come Out unless overridden (lose), also must have a line bet', function() {
  it('Buy the 5 is a bet, player 2 works', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new BuyBet(5), 20));
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(BuyBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(20);
    should.not.exist(valid1['override']);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new BuyBet(5), 20));
    gameForTest.findBet(valid2).setOverride(true);
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(BuyBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(20);
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
    var buy1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    buy1Ret['bet']['bet'].constructor.should.equal(BuyBet);
    buy1Ret['bet']['bet']['pointValue'].should.equal(5);
    buy1Ret['bet']['amount'].should.equal(20);
    buy1Ret['pay'].should.equal(0);
    var buy2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    buy2Ret['bet']['bet'].constructor.should.equal(BuyBet);
    buy2Ret['bet']['bet']['pointValue'].should.equal(5);
    buy2Ret['bet']['amount'].should.equal(20);
    buy2Ret['pay'].should.equal(-20);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Buy Bet is Off on the Come Out unless overridden (win)', function() {
  it('Buy the 5 is a bet, player 2 works', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new BuyBet(5), 20));
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(BuyBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(20);
    should.not.exist(valid1['override']);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new BuyBet(5), 20));
    valid2.setOverride(true);
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(BuyBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(20);
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
    var buy1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    buy1Ret['bet']['bet'].constructor.should.equal(BuyBet);
    buy1Ret['bet']['bet']['pointValue'].should.equal(5);
    buy1Ret['bet']['amount'].should.equal(20);
    buy1Ret['pay'].should.equal(0);
    var buy2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    buy2Ret['bet']['bet'].constructor.should.equal(BuyBet);
    buy2Ret['bet']['bet']['pointValue'].should.equal(5);
    buy2Ret['bet']['amount'].should.equal(20);
    buy2Ret['pay'].should.equal(29);
    gameForTest['playerBets'].length.should.equal(1);
  });
});
describe('Buy Bet truncates on pay', function() {
  it('Buy 6 and 8 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new BuyBet(6), 24));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(24);
    valid = gameForTest.makeBet(new PlayerBet(1, new BuyBet(8), 24));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(24);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 5 is, 6 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(24);
    retpay.should.equal(27); // The calculation is 144/5 (28 4/5), vigor of 1, but we must truncate
    gameForTest['playerBets'].length.should.equal(2);
  });
});
describe('Buy Bet loses', function() {
  it('dice are out 5 is, 7 out, line away', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    var buyRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === BuyBet && ret['bet']['bet']['pointValue'] === 8;
    });
    buyRet['bet']['pid'].should.equal(1);
    buyRet['bet']['amount'].should.equal(24);
    buyRet['pay'].should.equal(-24);
    gameForTest['playerBets'].length.should.equal(0);
  });
});

// Now do a "stingy" game where the commission is paid on the bet.
var gameWithVigForTest = new Game(5, 10000, 100, -2, true);

describe('Buy Bet with commission on Bet Wins', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameWithVigForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameWithVigForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameWithVigForTest['playerBets'].length.should.equal(1);
  });
  it('Buy bets across is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(4), 21));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(20);
    valid['preVigAmount'].should.equal(21);
    valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(6), 21));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(20);
    valid['preVigAmount'].should.equal(21);
    valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(8), 21));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(20);
    valid['preVigAmount'].should.equal(21);
    valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(9), 21));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(20);
    valid['preVigAmount'].should.equal(21);
    valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(10), 21));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(20);
    valid['preVigAmount'].should.equal(21);
    gameWithVigForTest['playerBets'].length.should.equal(6);
  });
  it('Double dip the 5 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(5), 21));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(20);
    valid['preVigAmount'].should.equal(21);
    gameWithVigForTest['playerBets'].length.should.equal(7);
  });
  it('dice are out 5 is, 2 is Craps', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameWithVigForTest['playerBets'].length.should.equal(7);
  });
  it('dice are out 5 is, 4 came Easy', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(40);
    gameWithVigForTest['playerBets'].length.should.equal(6);
  });
  it('dice are out 5 is, 6 came Easy', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(24);
    gameWithVigForTest['playerBets'].length.should.equal(5);
  });
  it('dice are out 5 is, 8 came Easy', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(24);
    gameWithVigForTest['playerBets'].length.should.equal(4);
  });
  it('dice are out 5 is, 9 Center Field', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(30);
    gameWithVigForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 5 is, 10 came Easy', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(20);
    retpay.should.equal(40);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 5 is, 5 No Field winner, pay the line', function() {
    var retValues = [];
    gameWithVigForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var buyRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === BuyBet && ret['bet']['bet']['pointValue'] === 5;
    });
    buyRet['bet']['pid'].should.equal(1);
    buyRet['bet']['amount'].should.equal(20);
    buyRet['pay'].should.equal(30);
    gameWithVigForTest['playerBets'].length.should.equal(0);
  });
});
describe('Buy Bet with commission on Bet is Off on the Come Out unless overridden (lose)', function() {
  it('Buy the 5 is a bet, player 2 works', function() {
    var valid1 = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(5), 21));
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(BuyBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(20);
    valid1['preVigAmount'].should.equal(21);
    should.not.exist(valid1['override']);
    var valid2 = gameWithVigForTest.makeBet(new PlayerBet(2, new BuyBet(5), 21));
    valid2.setOverride(true);
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(BuyBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(20);
    valid2['preVigAmount'].should.equal(21);
    valid2['override'].should.equal(true);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 7 front line winner, pay the line, workers have action', function() {
    var retValues = [];
    gameWithVigForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameWithVigForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var buy1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    buy1Ret['bet']['bet'].constructor.should.equal(BuyBet);
    buy1Ret['bet']['bet']['pointValue'].should.equal(5);
    buy1Ret['bet']['amount'].should.equal(20);
    buy1Ret['pay'].should.equal(0);
    var buy2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    buy2Ret['bet']['bet'].constructor.should.equal(BuyBet);
    buy2Ret['bet']['bet']['pointValue'].should.equal(5);
    buy2Ret['bet']['amount'].should.equal(20);
    buy2Ret['pay'].should.equal(-20);
    gameWithVigForTest['playerBets'].length.should.equal(0);
  });
});
describe('Buy Bet with commission on Bet is Off on the Come Out unless overridden (win)', function() {
  it('Buy the 5 is a bet, player 2 works', function() {
    var valid1 = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(5), 21));
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(BuyBet);
    valid1['bet']['pointValue'].should.equal(5);
    valid1['amount'].should.equal(20);
    valid1['preVigAmount'].should.equal(21);
    should.not.exist(valid1['override']);
    var valid2 = gameWithVigForTest.makeBet(new PlayerBet(2, new BuyBet(5), 21));
    valid2.setOverride(true);
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(BuyBet);
    valid2['bet']['pointValue'].should.equal(5);
    valid2['amount'].should.equal(20);
    valid2['preVigAmount'].should.equal(21);
    valid2['override'].should.equal(true);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 5 No Field, mark it, workers have action', function() {
    var retValues = [];
    gameWithVigForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameWithVigForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var buy1Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 1;
    });
    buy1Ret['bet']['bet'].constructor.should.equal(BuyBet);
    buy1Ret['bet']['bet']['pointValue'].should.equal(5);
    buy1Ret['bet']['amount'].should.equal(20);
    buy1Ret['pay'].should.equal(0);
    var buy2Ret = retValues.find(function(ret) {
      return ret['bet']['pid'] === 2;
    });
    buy2Ret['bet']['bet'].constructor.should.equal(BuyBet);
    buy2Ret['bet']['bet']['pointValue'].should.equal(5);
    buy2Ret['bet']['amount'].should.equal(20);
    buy2Ret['pay'].should.equal(30);
    gameWithVigForTest['playerBets'].length.should.equal(1);
  });
});
describe('Buy Bet commission truncates', function() {
  it('Buy 4 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(4), 26));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(25);
    valid['preVigAmount'].should.equal(26);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 5 is, 4 came Easy', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(25);
    retpay.should.equal(50);
    gameWithVigForTest['playerBets'].length.should.equal(1);
  });
});
describe('Buy Bet with commission on Bet truncates on pay', function() {
  it('Buy 6 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(6), 25));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(24);
    valid['preVigAmount'].should.equal(25);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 5 is, 6 came Easy', function() {
    var retbet, retpay;
    gameWithVigForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(BuyBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(24);
    retpay.should.equal(28); // The calculation is 144/5 (28 4/5), but we must truncate
    gameWithVigForTest['playerBets'].length.should.equal(1);
  });
});
describe('Buy Bet can be pressed and the commission will remain for the whole bet', function() {
  it('Buy 10 is a bet, odds pressed to main', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(10), 11, 10), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(20);
    valid['preVigAmount'].should.equal(21);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('Pressure the Buy 10 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(10), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(25);
    valid['preVigAmount'].should.equal(26);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
  it('Pressure the Buy 10 is a bet', function() {
    var valid = gameWithVigForTest.makeBet(new PlayerBet(1, new BuyBet(10), 0, 5), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BuyBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(30);
    valid['preVigAmount'].should.equal(31);
    gameWithVigForTest['playerBets'].length.should.equal(2);
  });
});
describe('Buy Bet with commission on Bet loses', function() {
  it('dice are out 5 is, 7 out, line away', function() {
    var retValues = [];
    gameWithVigForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameWithVigForTest['playerBets'].length.should.equal(0);
    var buyRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === BuyBet && ret['bet']['bet']['pointValue'] === 10;
    });
    buyRet['bet']['pid'].should.equal(1);
    buyRet['bet']['amount'].should.equal(30);
    buyRet['pay'].should.equal(-30);
    gameWithVigForTest['playerBets'].length.should.equal(0);
  });
});
