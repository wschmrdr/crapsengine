var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var DontPassLineBet = require('../crapsengine').DontPassLineBet;
var DontComeBet = require('../crapsengine').DontComeBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1);
var straightTenGame = new Game(5, 10000, 100, 10);

describe('Bet Odds Ratio and corresponding pays for the Dont Come Bet', function() {
  it('should be the true odds for a 4 (3/6)', function() {
    var bet = new DontComeBet(4);
    bet.getBetOddsRatio().should.equal(3/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(4);
    straightTenGame.getGameOddsRatio(bet).should.equal(20);
  });
  it('should be the true odds for a 5 (4/6)', function() {
    var bet = new DontComeBet(5);
    bet.getBetOddsRatio().should.equal(4/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(3);
    straightTenGame.getGameOddsRatio(bet).should.equal(15);
  });
  it('should be the true odds for a 6 (5/6)', function() {
    var bet = new DontComeBet(6);
    bet.getBetOddsRatio().should.equal(5/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(3);
    straightTenGame.getGameOddsRatio(bet).should.equal(12);
  });
  it('should be the true odds for a 8 (5/6)', function() {
    var bet = new DontComeBet(8);
    bet.getBetOddsRatio().should.equal(5/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(3);
    straightTenGame.getGameOddsRatio(bet).should.equal(12);
  });
  it('should be the true odds for a 9 (4/6)', function() {
    var bet = new DontComeBet(9);
    bet.getBetOddsRatio().should.equal(4/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(3);
    straightTenGame.getGameOddsRatio(bet).should.equal(15);
  });
  it('should be the true odds for a 10 (3/6)', function() {
    var bet = new DontComeBet(10);
    bet.getBetOddsRatio().should.equal(3/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(4);
    straightTenGame.getGameOddsRatio(bet).should.equal(20);
  });
  it('should be nothing for no point', function() {
    var bet = new DontComeBet();
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
      gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
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
describe('Establish a point, make a dont come bet, and lose on DC', function() {
  it('coming out, 4 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('no bet, invalid point', function() {
    try {
      gameForTest.makeBet(new PlayerBet(1, new DontComeBet(7), 5));
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal("This point cannot be set for this bet.");
    }
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('new DC is a bet, dice are out 4 is, 6 came easy, donts to the 6', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
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
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
  });
  it('dice are out 4 is, 6 the Hardway, down behind', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('dice are out 4 is, 11 Yo, take the DC', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
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
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('dice are out 4 is, 7, out, pay the dont, take the last DC', function() {
    var retValues = [];
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(5, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var comeRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === DontComeBet;
    });
    comeRet['bet']['pid'].should.equal(1);
    comeRet['bet']['amount'].should.equal(5);
    comeRet['bet']['oddsAmount'].should.equal(0);
    comeRet['pay'].should.equal(-5);
  });
});
describe('Establish a point, make a dont come bet, and win/push on DC', function() {
  it('coming out, 4 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('dice are out 4 is, 2 is Craps, pay the DC', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(DontComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('dice are out 4 is, 3 is Craps, pay the DC', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(2, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(DontComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('dice are out 4 is, 12 is Craps, bar the DC', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(6, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(DontComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('dice are out 4 is, 8 came Easy, donts to the 8', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
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
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 8;
    });
    should.exist(come8);
    come8['amount'].should.equal(5);
  });
  it('dice are out 4 is, 7 out, pay the donts, pay behind', function() {
    var retValues = [];
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(5, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var comeRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === DontComeBet;
    });
    comeRet['bet']['pid'].should.equal(1);
    comeRet['bet']['amount'].should.equal(5);
    comeRet['bet']['oddsAmount'].should.equal(0);
    comeRet['pay'].should.equal(5);
  });
});
describe('Establish a point, two comes bets are marked, and the proper ones down', function() {
  it('coming out, 8 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(8);
  });
  it('dice are out 8 is, 5 No Field, donts to the 5', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
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
    var come5 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 5;
    });
    should.exist(come5);
    come5['amount'].should.equal(5);
  });
  it('dice are out 8 is, 10 the Hardway, donts to the 10', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 10));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
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
    var come5 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 5;
    });
    should.exist(come5);
    come5['amount'].should.equal(5);
    var come10 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 10;
    });
    should.exist(come10);
    come10['amount'].should.equal(10);
  });
  it('dice are out 8 is, 5 No Field, down behind', function() {
    var retbet, retpay;
    gameForTest['playerBets'].length.should.equal(3);
    gameForTest.rollComplete(new DiceRoll(3, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['bet'].constructor.should.equal(DontComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(8);
    var come5 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 5;
    });
    should.not.exist(come5);
    var come10 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 10;
    });
    should.exist(come10);
    come10['amount'].should.equal(10);
  });
  it('dice are out 8 is, 8 came Easy winner, take the donts, DCs to the 8', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(3);
    gameForTest.rollComplete(new DiceRoll(5, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(0);
    var come10 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 10;
    });
    should.exist(come10);
    come10['amount'].should.equal(10);
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 8;
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
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 10;
    });
    should.exist(come10);
    come10['amount'].should.equal(10);
    var come8 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 8;
    });
    should.exist(come8);
    come8['amount'].should.equal(5);
  });
  it('coming out, 7 front line winner, take the dont, pay behind', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest['playerBets'].length.should.equal(3);
    gameForTest.rollComplete(new DiceRoll(5, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var come8Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === DontComeBet && ret['bet']['bet']['pointValue'] === 8;
    });
    come8Ret['bet']['pid'].should.equal(1);
    come8Ret['bet']['amount'].should.equal(5);
    come8Ret['bet']['oddsAmount'].should.equal(0);
    come8Ret['pay'].should.equal(5);
    var come10Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === DontComeBet && ret['bet']['bet']['pointValue'] === 10;
    });
    come10Ret['bet']['pid'].should.equal(1);
    come10Ret['bet']['amount'].should.equal(10);
    come10Ret['bet']['oddsAmount'].should.equal(0);
    come10Ret['pay'].should.equal(10);
  });
});
describe('Dont Come bets are also able to take odds', function() {
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
  });
  it('dice are out 9 is, 6 the Hardway, donts to the 6', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
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
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
  });
  it('no bet, new come with no main action', function() {
    // Come without point assumes new Come Bet (that is allowed). This bet has no main action.
    try {
      gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 0, 30));
    } catch(e) {
      e.name.should.equal('GameMinimumError');
      e.message.should.equal("The main bet does not cover the table minimum.");
    }
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('no bet, cannot place odds on the first roll', function() {
    try {
      gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5, 30));
    } catch(e) {
      e.name.should.equal('GameOddsMaximumError');
      e.message.should.equal("Odds exceed the maximum, and the main bet cannot be pressed.");
    }
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('new come with pressure is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5, 5), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(10);
    gameForTest['playerBets'].length.should.equal(3);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
    var newCome = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && !bet['bet'].pointValue;
    });
    should.exist(newCome);
    newCome['amount'].should.equal(10);
    newCome['oddsAmount'].should.equal(0);
  });
  it('dice are out 9 is, 11 Yo, take the DC', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(2);
    retbet['bet'].constructor.should.equal(DontComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(10);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(-10);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 6;
    });
    should.exist(come6);
    come6['amount'].should.equal(5);
    var newCome = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && !bet['bet'].pointValue;
    });
    should.not.exist(newCome);
  });
  it('odds on 6 is a bet, dice are out 9 is, 6 came Easy, down behind', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(6), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    retbet['bet'].constructor.should.equal(DontComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(-35);
    var come6 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 6;
    });
    should.not.exist(come6);
  });
});
describe('Odds on the Dont Come bet are on on the come out because it is a lose bet', function() {
  it('dice are out 9 is, 9 Center Field winner, take the donts, DCs to the 9', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5, 0));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    var come9 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 9;
    });
    should.exist(come9);
    come9['amount'].should.equal(5);
  });
  it('coming out, 9 Center Field, mark it, down behind', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(9), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
    retbet['bet'].constructor.should.equal(DontComeBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(-35);
    var come9 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 9;
    });
    should.not.exist(come9);
  });
  it('dice are out 9 is, 9 Center Field winner, take the donts, DCs to the 9', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(), 5, 0));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    should.not.exist(valid['bet']['pointValue']);
    valid['amount'].should.equal(5);
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    var come9 = gameForTest['playerBets'].find(function(bet) {
      return bet['bet'].constructor === DontComeBet && bet['bet'].pointValue === 9;
    });
    should.exist(come9);
    come9['amount'].should.equal(5);
  });
  it('coming out, 7 front line winner, take the donts, pay behind', function() {
    var retValues = [];
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontComeBet(9), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontComeBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
    var come9Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === DontComeBet && ret['bet']['bet']['pointValue'] === 9;
    });
    come9Ret['bet']['pid'].should.equal(1);
    come9Ret['bet']['amount'].should.equal(5);
    come9Ret['bet']['oddsAmount'].should.equal(30);
    come9Ret['pay'].should.equal(25);
  });
});
