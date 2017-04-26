var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var DontPassLineBet = require('../crapsengine').DontPassLineBet;

var gameForTest = new Game();
var fullDoubleGame = new Game(5, 10000, 100, -1);
var straightTenGame = new Game(5, 10000, 100, 10);

describe('Bet Odds Ratio and corresponding pays for the Dont Pass Line Bet', function() {
  it('should be the true odds for a 4 (3/6)', function() {
    var bet = new DontPassLineBet(4);
    bet.getBetOddsRatio().should.equal(3/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(4);
    straightTenGame.getGameOddsRatio(bet).should.equal(20);
  });
  it('should be the true odds for a 5 (4/6)', function() {
    var bet = new DontPassLineBet(5);
    bet.getBetOddsRatio().should.equal(4/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(3);
    straightTenGame.getGameOddsRatio(bet).should.equal(15);
  });
  it('should be the true odds for a 6 (5/6)', function() {
    var bet = new DontPassLineBet(6);
    bet.getBetOddsRatio().should.equal(5/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(3);
    straightTenGame.getGameOddsRatio(bet).should.equal(12);
  });
  it('should be the true odds for a 8 (5/6)', function() {
    var bet = new DontPassLineBet(8);
    bet.getBetOddsRatio().should.equal(5/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(3);
    straightTenGame.getGameOddsRatio(bet).should.equal(12);
  });
  it('should be the true odds for a 9 (4/6)', function() {
    var bet = new DontPassLineBet(9);
    bet.getBetOddsRatio().should.equal(4/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(3);
    straightTenGame.getGameOddsRatio(bet).should.equal(15);
  });
  it('should be the true odds for a 10 (3/6)', function() {
    var bet = new DontPassLineBet(10);
    bet.getBetOddsRatio().should.equal(3/6);
    gameForTest.getGameOddsRatio(bet).should.equal(6);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(4);
    straightTenGame.getGameOddsRatio(bet).should.equal(20);
  });
  it('should be nothing for no point', function() {
    var bet = new DontPassLineBet();
    bet.getBetOddsRatio().should.equal(0);
    gameForTest.getGameOddsRatio(bet).should.equal(0);
    fullDoubleGame.getGameOddsRatio(bet).should.equal(0);
    straightTenGame.getGameOddsRatio(bet).should.equal(0);
  });
});
describe('Come out resolved on the first roll (2, 3, 7, 11, 12)', function() {
  it('coming out, 7 front line winner, take the donts', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
  it('coming out, 11 Yo front line winner, take the donts', function() {
    var retbet, retpay;
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(8), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest.rollComplete(new DiceRoll(6, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(-5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
  it('coming out, 2 is Craps, pay the donts', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
  it('coming out, 3 is Craps, pay the donts', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
  it('coming out, 12 is Craps, bar the donts', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point and immediately come back', function() {
  it('coming out, 6 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(6);
  });
  it('dice are out 6 is, 6 the Hardway winner, take the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 3), function(bet, pay) {
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
describe('Establish a point and immediately seven out', function() {
  it('coming out, 8 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(3, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(8);
  });
  it('dice are out 8 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
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
describe('Establish a point, attempt to put, have a blank, and seven out', function() {
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
  });
  it('no bet, cannot put the dont', function() {
    try {
      gameForTest.makeBet(new PlayerBet(2, new DontPassLineBet(), 5));
    } catch(e) {
      e.name.should.equal('GameBetNotAllowedError');
      e.message.should.equal('Cannot Put a Dont bet with a point.');
    }
  });
  it('dice are out 9 is, 4 came Easy', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 1));
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
  });
  it('dice are out 9 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
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
describe('Establish a point, lay odds, and come back', function() {
  it('coming out, 10 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(10);
  });
  it('6x odds on the line for a 10 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 10 is, 10 the Hardway winner, take the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(-35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds, and seven out (4)', function() {
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
  it('6x odds on the line for a 4 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 4 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(20);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds, and seven out (5)', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(3, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(5);
  });
  it('6x odds on the line for a 5 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(25);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds, and seven out (6)', function() {
  it('coming out, 6 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(3, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(6);
  });
  it('6x odds on the line for a 6 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 6 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(30);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds, and seven out (8)', function() {
  it('coming out, 8 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(8);
  });
  it('6x odds on the line for a 8 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 8 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(30);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds, and seven out (9)', function() {
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(9);
  });
  it('6x odds on the line for a 9 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 9 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(25);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds, and seven out (10)', function() {
  it('coming out, 10 the Hardway, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(10);
  });
  it('6x odds on the line for a 10 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 10 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(20);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds, blank, and come back', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(1, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(5);
  });
  it('6x odds on the line for a 5 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 30));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(5);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(30);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 5 is, 11 Yo', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 5));
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['pointValue'].should.equal(5);
  });
  it('dice are out 5 is, 5 No Field winner, take the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(30);
    retpay.should.equal(-35);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds for less, and seven out', function() {
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
  it('odds for less on the line for a 9 is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 15));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(9);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(15);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 9 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(15);
    retpay.should.equal(15);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, lay odds for less than minimum, seven out, and truncate whole numbers', function() {
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
  it('odds for less on the line is a bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 4));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(DontPassLineBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(5);
    valid['oddsAmount'].should.equal(4);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('dice are out 8 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(4);
    retpay.should.equal(8); // 5:6 on 4 is 10/3, but we always round down.
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
describe('Establish a point, try to lay too many odds, and seven out', function() {
  it('coming out, 6 came Easy, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 5));
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
      gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 31));
    } catch(e) {
      e.name.should.equal('GameOddsMaximumError');
      e.message.should.equal("Odds exceed the maximum, and the main bet cannot be pressed.");
    }
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('no bet, cannot press the main dont bet', function() {
    gameForTest['playerBets'].length.should.equal(1);
    try {
      var valid = gameForTest.makeBet(new PlayerBet(1, new DontPassLineBet(), 0, 31), true);
    } catch(e) {
      e.name.should.equal('GameBetNotAllowedError');
      e.message.should.equal("Cannot Press a Main Dont Bet with a Point.");
    }
    gameForTest['playerBets'].length.should.equal(1);
    gameForTest['playerBets'][0]['amount'].should.equal(5);
    gameForTest['playerBets'][0]['oddsAmount'].should.equal(0);
  });
  it('dice are out 6 is, 7 out, pay the donts', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retbet.oddsAmount.should.equal(0);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest['pointValue'].should.equal(0);
  });
});
