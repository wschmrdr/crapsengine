var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var PassLineBet = require('../crapsengine').PassLineBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1);
var straightTenGame = new Game(5, 10000, 100, 10);

describe('Bet Odds Ratio and corresponding pays for the Pass Line Bet', function() {
  it('should be the true odds for a 4 (6/3)', function() {
    var bet = new PassLineBet(4);
    bet.getBetOddsRatio().should.equal(6/3);
    gameForTest.getGameOddsRatio(bet).should.equal(3);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 5 (6/4)', function() {
    var bet = new PassLineBet(5);
    bet.getBetOddsRatio().should.equal(6/4);
    gameForTest.getGameOddsRatio(bet).should.equal(4);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 6 (6/5)', function() {
    var bet = new PassLineBet(6);
    bet.getBetOddsRatio().should.equal(6/5);
    gameForTest.getGameOddsRatio(bet).should.equal(5);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2.5);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 8 (6/5)', function() {
    var bet = new PassLineBet(8);
    bet.getBetOddsRatio().should.equal(6/5);
    gameForTest.getGameOddsRatio(bet).should.equal(5);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2.5);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 9 (6/4)', function() {
    var bet = new PassLineBet(9);
    bet.getBetOddsRatio().should.equal(6/4);
    gameForTest.getGameOddsRatio(bet).should.equal(4);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be the true odds for a 10 (6/3)', function() {
    var bet = new PassLineBet(10);
    bet.getBetOddsRatio().should.equal(6/3);
    gameForTest.getGameOddsRatio(bet).should.equal(3);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(2);
    straightTenGame.getGameOddsRatio(bet).should.equal(10);
  });
  it('should be nothing for no point', function() {
    var bet = new PassLineBet();
    bet.getBetOddsRatio().should.equal(0);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
});
describe('No roll of the dice', function() {
  it('no bet from missing minimum, no roll no line', function() {
    var retbet, retpay;
    try {
      gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 4));
    } catch(e) {
      e.name.should.equal('GameMinimumError');
      e.message.should.equal("The main bet does not cover the table minimum.");
    }
    should.not.exist(gameForTest.findBet(new PlayerBet(1, new PassLineBet(), 0)));
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
  it('no bet from exceeding maximum, no roll no line', function() {
    var retbet, retpay;
    try {
      gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 10001));
    } catch(e) {
      e.name.should.equal('GameMaximumError');
      e.message.should.equal("Your table action exceeds the maximum.");
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
describe('Come out resolved on the first roll', function() {
  it('coming out, 7 front line winner, pay the line', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
  it('coming out, 11 Yo front line winner, pay the line', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(8), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest.rollComplete(new DiceRoll(6, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
  it('coming out, 2 is Craps, line away', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
  it('coming out, 3 is Craps, line away', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
  it('coming out, 12 is Craps, line away', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point and immediately come back', function() {
  it('coming out, 6 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(6);
  });
  it('dice are out 6 is, 6 the Hardway winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point and immediately seven out', function() {
  it('coming out, 8 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(3, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(8);
  });
  it('dice are out 8 is, 7 out, line away', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, have a player make a put bet, and come back', function() {
  it('coming out, 10 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
  });
  it('put the line is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(2, new PassLineBet(), 5));
    valid['pid'].should.equal(2);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest['pointValue'].should.equal(9);
  });
  it('dice are out 9 is, 9 Center Field winner, pay the line', function() {
    var retbet, retpay;
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    pass1Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PassLineBet && ret['bet']['pid'] === 1;
    });
    pass1Ret['bet']['bet']['pointValue'].should.equal(9);
    pass1Ret['bet']['amount'].should.equal(5);
    pass1Ret['pay'].should.equal(5);
    pass2Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === PassLineBet && ret['bet']['pid'] === 2;
    });
    pass2Ret['bet']['bet']['pointValue'].should.equal(9);
    pass2Ret['bet']['amount'].should.equal(5);
    pass2Ret['pay'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, have a blank, and seven out', function() {
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
  });
  it('dice are out 9 is, 4 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 1));
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
  });
  it('dice are out 9 is, 7 out, line away', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds and seven out', function() {
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
  it('3x odds on the line for a 4 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 15));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(15);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 4 is, 7 out, line away', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(15);
    retpay.should.equal(-20);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds and come back (4)', function() {
  it('coming out, 4 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(4);
  });
  it('3x odds on the line for a 4 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 15));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(15);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 4 is, 4 the Hardway winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(15);
    retpay.should.equal(35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds and come back (5)', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(1, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(5);
  });
  it('4x odds on the line for a 5 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(20);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 5 No Field winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(20);
    retpay.should.equal(35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds and come back (6)', function() {
  it('coming out, 6 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(6);
  });
  it('5x odds on the line for a 6 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 25));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(25);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 6 is, 6 the Hardway winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(25);
    retpay.should.equal(35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds and come back (8)', function() {
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
  it('5x odds on the line for a 8 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 25));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(25);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 8 is, 8 the Hardway winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(25);
    retpay.should.equal(35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds and come back (9)', function() {
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
  it('4x odds on the line for a 9 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(20);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 9 is, 9 Center Field winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(20);
    retpay.should.equal(35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds and come back (10)', function() {
  it('coming out, 10 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(10);
  });
  it('3x odds on the line for a 10 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 15));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(15);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 10 is, 10 the Hardway winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(15);
    retpay.should.equal(35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds, blank, and come back', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(1, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(5);
  });
  it('4x odds on the line for a 5 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 20));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(20);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 11 Yo', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 5));
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(5);
  });
  it('dice are out 5 is, 5 No Field winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(20);
    retpay.should.equal(35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds for less and come back', function() {
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
  it('odds for less on the line for a 9 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 10));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(10);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 9 is, 9 Center Field winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(10);
    retpay.should.equal(20);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with odds for less than minimum, come back, and truncate whole numbers', function() {
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
  it('odds for less on the line is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 4));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(4);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 8 is, 8 the Hardway winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(4);
    retpay.should.equal(9); // 6:5 on 4 is 4.8, but we always round down.
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with too many odds and come back', function() {
  it('coming out, 6 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(6);
  });
  it('no bet, odds are too high on the line for a 6', function() {
    gameForTest['playerBets'].length.should.equal(1);
    try {
      gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 26));
    } catch(e) {
      e.name.should.equal('GameOddsMaximumError');
      e.message.should.equal("Odds exceed the maximum, and the main bet cannot be pressed.");
    }
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('no bet, exceeds table maximum', function() {
    gameForTest['playerBets'].length.should.equal(1);
    try {
      gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 9996), true);
    } catch(e) {
      e.name.should.equal('GameMaximumError');
      e.message.should.equal("Your table action exceeds the maximum.");
    }
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('odds on the line for a 6, line pressure, is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 31), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(6);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 6 is, 6 came Easy winner, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(6);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(42);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, press main with odds, and seven out', function() {
  it('coming out, 6 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(6);
  });
  it('odds on the the line for a 6, line pressure, is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5, 50), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(10);
    valid['oddsAmount'].should.equal(50);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 6 is, 7 out, line away', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(10);
    retbet.oddsAmount.should.equal(50);
    retpay.should.equal(-60);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point with too many odds prioritizing main and seven out', function() {
  it('coming out, 6 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(6);
  });
  it('odds on the the line for a 6, line pressure, is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 0, 32), true);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(PassLineBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(7);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 6 is, 7 out, line away', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(7);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(-37);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
