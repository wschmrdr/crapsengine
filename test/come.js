var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var PassLineBet = require('../crapsengine').PassLineBet;
var ComeBet = require('../crapsengine').ComeBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1);
var straightTenGame = new Game(5, 10000, 100, 10);

describe('Bet Odds Ratio and corresponding pays for the Come Bet', function() {
  it('should be the true odds for a 4 (6/3)', function() {
    var bet = new ComeBet(4);
    bet.getBetOddsRatio().should.equal(6/3);
    gameForTest.getGameOddsRatio(bet).should.equal(3);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 5 (6/4)', function() {
    var bet = new ComeBet(5);
    bet.getBetOddsRatio().should.equal(6/4);
    gameForTest.getGameOddsRatio(bet).should.equal(4);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 6 (6/5)', function() {
    var bet = new ComeBet(6);
    bet.getBetOddsRatio().should.equal(6/5);
    gameForTest.getGameOddsRatio(bet).should.equal(5);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2.5);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 8 (6/5)', function() {
    var bet = new ComeBet(8);
    bet.getBetOddsRatio().should.equal(6/5);
    gameForTest.getGameOddsRatio(bet).should.equal(5);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2.5);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 9 (6/4)', function() {
    var bet = new ComeBet(9);
    bet.getBetOddsRatio().should.equal(6/4);
    gameForTest.getGameOddsRatio(bet).should.equal(4);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 10 (6/3)', function() {
    var bet = new ComeBet(10);
    bet.getBetOddsRatio().should.equal(6/3);
    gameForTest.getGameOddsRatio(bet).should.equal(3);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be nothing for no point', function() {
    var bet = new ComeBet();
    bet.getBetOddsRatio().should.equal(0);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
});
describe('Cannot make this bet on the come out', function() {
  it('no bet on the come out, no roll no line', function() {
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var retbet, retpay;
    try {
      gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    } catch(e) {
      e.name.should.equal('GameBetNotAllowedError');
      e.message.should.equal("Cannot make a new Come or Dont Bet when there is no point. Use the line.");
    }
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, make a come bet, and win on come', function() {
  it('coming out, 4 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('no bet, invalid point', function() {
    try {
      gameForTest.makeBet(new PlayerBet(1, new ComeBet(7), 5));
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal("This point cannot be set for this bet.");
    }
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('new come is a bet, dice are out 4 is, 6 came easy, comes to the 6', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(4);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(4);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
  });
  it('dice are out 4 is, 6 the Hardway, comes have action', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
    gameForTest['playerBets'][0]['bet'].constructor.should.equal(PassLineBet);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('dice are out 4 is, 11 Yo, good come', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(6, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
    gameForTest['playerBets'][0]['bet'].constructor.should.equal(PassLineBet);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('dice are out 4 is, 7, out, line away, last come get some', function() {
    var retValues = [];
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(5, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var passRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PassLineBet;
    });
    passRet['bet']['pid'].should.equal(1);
    passRet['bet']['amount'].should.equal(5);
    passRet['bet']['oddsAmount'].should.equal(0);
    passRet['pay'].should.equal(-5);
    var comeRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === ComeBet;
    });
    comeRet['bet']['pid'].should.equal(1);
    comeRet['bet']['amount'].should.equal(5);
    comeRet['bet']['oddsAmount'].should.equal(0);
    comeRet['pay'].should.equal(5);
  });
});
describe('Establish a point, make a come bet, and lose on come', function() {
  it('coming out, 4 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('dice are out 4 is, 2 is Craps, come away', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(ComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
    gameForTest['playerBets'][0]['bet'].constructor.should.equal(PassLineBet);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('dice are out 4 is, 3 is Craps, come away', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(2, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(ComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
    gameForTest['playerBets'][0]['bet'].constructor.should.equal(PassLineBet);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('dice are out 4 is, 12 is Craps, come away', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(6, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(ComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
    gameForTest['playerBets'][0]['bet'].constructor.should.equal(PassLineBet);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('dice are out 4 is, 8 came Easy, comes to the 8', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(5, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(4);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(4);
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 8;
    });
    should.exist(come8);
    come8['amount'].should.equal(5);
  });
  it('dice are out 4 is, 7 out, line away, last come get some', function() {
    var retValues = [];
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(5, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var passRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PassLineBet;
    });
    passRet['bet']['pid'].should.equal(1);
    passRet['bet']['amount'].should.equal(5);
    passRet['bet']['oddsAmount'].should.equal(0);
    passRet['pay'].should.equal(-5);
    var comeRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === ComeBet;
    });
    comeRet['bet']['pid'].should.equal(1);
    comeRet['bet']['amount'].should.equal(5);
    comeRet['bet']['oddsAmount'].should.equal(0);
    comeRet['pay'].should.equal(-5);
  });
});
describe('Establish a point, two comes bets are marked, and the proper ones pay', function() {
  it('coming out, 8 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(8);
  });
  it('dice are out 8 is, 5 No Field, comes to the 5', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(8);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(8);
    var come5 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 5;
    });
    should.exist(come5);
    come5['amount'].should.equal(5);
  });
  it('dice are out 8 is, 10 the Hardway, comes to the 10', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 10));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(10);
    gameForTest['playerBets'].length.should.equal(3);
    gameForTest.rollComplete(new DiceRoll(5, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(3);
    gameForTest['pointValue'].should.equal(8);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(8);
    var come5 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 5;
    });
    should.exist(come5);
    come5['amount'].should.equal(5);
    var come10 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 10;
    });
    should.exist(come10);
    come10['amount'].should.equal(10);
  });
  it('dice are out 8 is, 5 No Field, comes have action', function() {
    var retbet, retpay;
    gameForTest['playerBets'].length.should.equal(3);
    gameForTest.rollComplete(new DiceRoll(3, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(ComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(8);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(8);
    var come5 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 5;
    });
    should.not.exist(come5);
    var come10 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 10;
    });
    should.exist(come10);
    come10['amount'].should.equal(10);
  });
  it('dice are out 8 is, 8 came Easy winner, pay the line, comes to the 8', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(3);
    gameForTest.rollComplete(new DiceRoll(5, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(PassLineBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(0);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.not.exist(passLine);
    var come10 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 10;
    });
    should.exist(come10);
    come10['amount'].should.equal(10);
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 8;
    });
    should.exist(come8);
    come8['amount'].should.equal(5);
  });
  it('coming out, no roll, must have a line or dont', function() {
    var retValues = [];
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(5, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    retValues.length.should.equal(1);
    should.not.exist(retValues[0]['bet']);
    retValues[0]['pay'].should.equal(0);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(0);
    var come10 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 10;
    });
    should.exist(come10);
    come10['amount'].should.equal(10);
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 8;
    });
    should.exist(come8);
    come8['amount'].should.equal(5);
  });
  it('coming out, 7 front line winner, pay the line, workers have action', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest['playerBets'].length.should.equal(3);
    gameForTest.rollComplete(new DiceRoll(5, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var passRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PassLineBet;
    });
    passRet['bet']['pid'].should.equal(1);
    passRet['bet']['amount'].should.equal(5);
    passRet['bet']['oddsAmount'].should.equal(0);
    passRet['pay'].should.equal(5);
    var come8Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === ComeBet && ret['bet']['bet']['pointValue'] === 8;
    });
    come8Ret['bet']['pid'].should.equal(1);
    come8Ret['bet']['amount'].should.equal(5);
    come8Ret['bet']['oddsAmount'].should.equal(0);
    come8Ret['pay'].should.equal(-5);
    var come10Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === ComeBet && ret['bet']['bet']['pointValue'] === 10;
    });
    come10Ret['bet']['pid'].should.equal(1);
    come10Ret['bet']['amount'].should.equal(10);
    come10Ret['bet']['oddsAmount'].should.equal(0);
    come10Ret['pay'].should.equal(-10);
  });
});
describe('Come bets are also able to take odds', function() {
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
  });
  it('dice are out 9 is, 6 the Hardway, comes to the 6', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(20);
    valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(3, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(9);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(20);
    passLine['bet']['pointValue'].should.equal(9);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
  });
  it('no bet, new come with no main action', function() {
    // Come without point assumes new Come Bet (that is allowed). This bet has no main action.
    try {
      gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 0, 25));
    } catch(e) {
      e.name.should.equal('GameMinimumError');
      e.message.should.equal("The main bet does not cover the table minimum.");
    }
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('no bet, cannot place odds on the first roll', function() {
    try {
      gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5, 25));
    } catch(e) {
      e.name.should.equal('GameOddsMaximumError');
      e.message.should.equal("Odds exceed the maximum, and the main bet cannot be pressed.");
    }
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('new come with pressure is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5, 5), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(10);
    gameForTest['playerBets'].length.should.equal(3);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(20);
    passLine['bet']['pointValue'].should.equal(9);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
    var newCome = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && !bet['bet'].pointValue;
    });
    should.exist(newCome);
    newCome['amount'].should.equal(10);
    newCome['oddsAmount'].should.equal(0);
  });
  it('dice are out 9 is, 11 Yo, good come', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(2);
    retbet['bet'].constructor.should.equal(ComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(10);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(10);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(20);
    passLine['bet']['pointValue'].should.equal(9);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
    var newCome = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && !bet['bet'].pointValue;
    });
    should.not.exist(newCome);
  });
  it('odds on 6 is a bet, dice are out 9 is, 6 came Easy, comes have action', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(6), 0, 25));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(25);
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    retbet['bet'].constructor.should.equal(ComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(25);
    retpay.should.equal(35);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(20);
    passLine['bet']['pointValue'].should.equal(9);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    should.not.exist(come6);
  });
});
describe('Odds on the Come bet are off on the come out', function() {
  it('dice are out 9 is, 9 Center Field winner, pay the line, comes to the 9', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5, 0));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    retbet['bet'].constructor.should.equal(PassLineBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(20);
    retpay.should.equal(35);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.not.exist(passLine);
    var come9 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 9;
    });
    should.exist(come9);
    come9['amount'].should.equal(5);
  });
  it('coming out, 9 Center Field, mark it, save the odds', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(9), 0, 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(20);
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
    retbet['bet'].constructor.should.equal(ComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(20);
    retpay.should.equal(5);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(9);
    var come9 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 9;
    });
    should.not.exist(come9);
  });
  it('dice are out 9 is, 9 Center Field winner, pay the line, donts and comes to the 9', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(20);
    valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5, 0));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    retbet['bet'].constructor.should.equal(PassLineBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(20);
    retpay.should.equal(35);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.not.exist(passLine);
    var come9 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 9;
    });
    should.exist(come9);
    come9['amount'].should.equal(5);
  });
  it('coming out, 7 front line winner, pay the line, save the odds', function() {
    var retValues = [];
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(9), 0, 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(20);
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var passRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PassLineBet;
    });
    passRet['bet']['pid'].should.equal(1);
    passRet['bet']['amount'].should.equal(5);
    passRet['bet']['oddsAmount'].should.equal(0);
    passRet['pay'].should.equal(5);
    var come9Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === ComeBet && ret['bet']['bet']['pointValue'] === 9;
    });
    come9Ret['bet']['pid'].should.equal(1);
    come9Ret['bet']['amount'].should.equal(5);
    come9Ret['bet']['oddsAmount'].should.equal(20);
    come9Ret['pay'].should.equal(-5);
  });
});
describe('Odds on the Come bet can overridden to be ON on the come out', function() {
  it('coming out, 8 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(8);
    should.not.exist(retbet);
    should.not.exist(retpay);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(8);
  });
  it('dice are out 8 is, 8 came Easy winner, pay the line, comes to the 8', function() {
    var retbet, retpay;
    valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 25));
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5, 0));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest.rollComplete(new DiceRoll(5, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    retbet['bet'].constructor.should.equal(PassLineBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(25);
    retpay.should.equal(35);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.not.exist(passLine);
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 8;
    });
    should.exist(come8);
    come8['amount'].should.equal(5);
    should.not.exist(come8['override']);
  });
  it('odds working on the 8 is a bet', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(8), 0, 25));
    valid.setOverride(true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(25);
    valid['override'].should.equal(true);
  });
  it('coming out, 8 came Easy, mark it, workers have action', function() {
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(8);
    retbet['bet'].constructor.should.equal(ComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(25);
    retpay.should.equal(35);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(8);
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 8;
    });
    should.not.exist(come8);
  });
  it('dice are out 8 is, 8 the Hardway winner, pay the line, comes to the 8', function() {
    var retbet, retpay;
    valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 25));
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5, 0));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest.rollComplete(new DiceRoll(4, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    retbet['bet'].constructor.should.equal(PassLineBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(25);
    retpay.should.equal(35);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.not.exist(passLine);
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 8;
    });
    should.exist(come8);
    come8['amount'].should.equal(5);
    should.not.exist(come8['override']);
  });
  it('coming out, 7 front line winner, pay the line, workers have action', function() {
    var retValues = [];
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(8), 0, 25));
    valid.setOverride(true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(25);
    valid['override'].should.equal(true);
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var come8Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === ComeBet && ret['bet']['bet']['pointValue'] === 8;
    });
    come8Ret['bet']['pid'].should.equal(1);
    come8Ret['bet']['amount'].should.equal(5);
    come8Ret['bet']['oddsAmount'].should.equal(25);
    come8Ret['pay'].should.equal(-30);
  });
  it('coming out, 6 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(6);
    should.not.exist(retbet);
    should.not.exist(retpay);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(6);
  });
  it('dice are out 6 is, 6 came Easy winner, pay the line, comes to the 6', function() {
    var retbet, retpay;
    valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 25));
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5, 0));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    retbet['bet'].constructor.should.equal(PassLineBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(25);
    retpay.should.equal(35);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.not.exist(passLine);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
    should.not.exist(come6['override']);
  });
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(6), 0, 25));
    valid.setOverride(true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(25);
    valid['override'].should.equal(true);
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(9);
    should.not.exist(retbet);
    should.not.exist(retpay);
    var passLine = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === PassLineBet;
    });
    should.exist(passLine);
    passLine['amount'].should.equal(5);
    passLine['oddsAmount'].should.equal(0);
    passLine['bet']['pointValue'].should.equal(9);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
    come6['oddsAmount'].should.equal(25);
    come6['override'].should.equal(true);
    come6['bet']['pointValue'].should.equal(6);
  });
  it('odds back to normal play is a bet', function() {
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6.setNormalAction();
    come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === ComeBet && bet['bet'].pointValue === 6;
    });
    come6['amount'].should.equal(5);
    come6['oddsAmount'].should.equal(25);
    should.not.exist(come6['override']);
    come6['bet']['pointValue'].should.equal(6);
  });
  it('dice are out 9 is, 7 out, line away, last come get some', function() {
    var retValues = [];
    valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 20));
    var valid = gameForTest.makeBet(new PlayerBet(1, new ComeBet(), 5, 0));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(ComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var passRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PassLineBet;
    });
    passRet['bet']['pid'].should.equal(1);
    passRet['bet']['amount'].should.equal(5);
    passRet['bet']['oddsAmount'].should.equal(20);
    passRet['pay'].should.equal(-25);
    var come6Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === ComeBet && ret['bet']['bet']['pointValue'] === 6;
    });
    come6Ret['bet']['pid'].should.equal(1);
    come6Ret['bet']['amount'].should.equal(5);
    come6Ret['bet']['oddsAmount'].should.equal(25);
    come6Ret['pay'].should.equal(-30);
    var comeRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === ComeBet && !ret['bet']['bet']['pointValue'];
    });
    comeRet['bet']['pid'].should.equal(1);
    comeRet['bet']['amount'].should.equal(5);
    comeRet['bet']['oddsAmount'].should.equal(0);
    comeRet['pay'].should.equal(5);
  });
});
