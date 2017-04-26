var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var PassLineBet = require('../crapsengine').PassLineBet;
var HardwayBet = require('../crapsengine').HardwayBet;

var gameForTest = new Game();
describe('No roll of the dice', function() {
  it('no bet, no point', function() {
    try {
      gameForTest.makeBet(new PlayerBet(1, new HardwayBet(), 5));
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal("This point cannot be set for this bet.");
    }
    gameForTest['playerBets'].length.should.equal(0);
  });
  it('no bet, invalid point', function() {
    try {
      gameForTest.makeBet(new PlayerBet(1, new HardwayBet(7), 5));
    } catch(e) {
      e.name.should.equal('BetInvalidPointError');
      e.message.should.equal("This point cannot be set for this bet.");
    }
    gameForTest['playerBets'].length.should.equal(0);
  });
  it('no bet from exceeding maximum, no roll no line', function() {
    var retbet, retpay;
    try {
      gameForTest.makeBet(new PlayerBet(1, new HardwayBet(4), 101));
    } catch(e) {
      e.name.should.equal('GameMaximumError');
      e.message.should.equal("Your center action exceeds the maximum.");
    }
    gameForTest['playerBets'].length.should.equal(0);
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Allow the four hardway bets, using the center minimum', function() {
  it('hard 4 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(4), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('hard 6 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(6), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('hard 8 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(8), 4));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(4);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('hard 10 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(10), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(4);
  });
});
describe('Hardways win', function() {
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(5);
  });
  it('dice are out 9 is, 4 the Hardway, donts and comes to the 4. Hard 4 pays', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(2, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(35);
    gameForTest['playerBets'].length.should.equal(4);
  });
  it('dice are out 9 is, 6 the Hardway, donts and comes to the 6. Hard 6 pays', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(5);
    retpay.should.equal(45);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 9 is, 8 the Hardway, donts and comes to the 8. Hard 8 pays', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(4);
    retpay.should.equal(36);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 9 is, 10 the Hardway, donts and comes to the 10. Hard 10 pays', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 5), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(1);
    retpay.should.equal(7);
    gameForTest['playerBets'].length.should.equal(1);
  });
});
describe('Hardways are Off on the come out unless overridden (win)', function() {
  it('dice are out 9 is, 9 Center Field winner, take the donts, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    gameForTest['playerBets'].length.should.equal(0);
  });
  it('hard 10 is a bet, player 2 works', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(10), 1));
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(HardwayBet);
    valid1['bet']['pointValue'].should.equal(10);
    valid1['amount'].should.equal(1);
    should.not.exist(valid1['override']);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new HardwayBet(10), 1));
    valid2.setOverride(true);
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(HardwayBet);
    valid2['bet']['pointValue'].should.equal(10);
    valid2['amount'].should.equal(1);
    valid2['override'].should.equal(true);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, no roll no line', function() {
    var retbet, retpay;
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 10 the Hardway, mark it. Working Hard 10 pays', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(5, 5), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var hard1Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HardwayBet && ret['bet']['bet']['pointValue'] === 10 &&
             ret['bet']['pid'] === 1;
    });
    hard1Ret['bet']['amount'].should.equal(1);
    hard1Ret['pay'].should.equal(0);
    var hard2Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HardwayBet && ret['bet']['bet']['pointValue'] === 10 &&
             ret['bet']['pid'] === 2;
    });
    hard2Ret['bet']['amount'].should.equal(1);
    hard2Ret['pay'].should.equal(7);
    gameForTest['playerBets'].length.should.equal(1);
  });
});
describe('Hardways lose on easy rolls', function() {
  it('hard 4 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(4), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('hard 6 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(6), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('hard 8 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(8), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(4);
  });
  it('hard 10 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(10), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(5);
  });
  it('dice are out 10 is, 4 came Easy, donts and comes to the 4. Hard 4 is down', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(1);
    retpay.should.equal(-1);
    gameForTest['playerBets'].length.should.equal(4);
  });
  it('dice are out 10 is, 6 came Easy, donts and comes to the 6. Hard 6 is down', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(4, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(1);
    retpay.should.equal(-1);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('hard 6 return', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(6), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(4);
  });
  it('dice are out 10 is, 6 came Easy, donts and comes to the 6. Hard 6 is down', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(1);
    retpay.should.equal(-1);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 10 is, 8 came Easy, donts and comes to the 8. Hard 8 is down', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(5, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(1);
    retpay.should.equal(-1);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('hard 8 return', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(8), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('dice are out 10 is, 8 came Easy, donts and comes to the 8. Hard 8 is down', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(1);
    retpay.should.equal(-1);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 10 is, 10 came Easy winner, take the donts, pay the line. Hard 10 is down', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet.bet.constructor.should.equal(HardwayBet);
    retbet.pid.should.equal(1);
    retbet.amount.should.equal(1);
    retpay.should.equal(-1);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Hardways are Off on the come out unless overridden (lose)', function() {
  it('hard 10 is a bet, player 2 works', function() {
    var valid1 = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(10), 1));
    valid1['pid'].should.equal(1);
    valid1['bet'].constructor.should.equal(HardwayBet);
    valid1['bet']['pointValue'].should.equal(10);
    valid1['amount'].should.equal(1);
    should.not.exist(valid1['override']);
    var valid2 = gameForTest.makeBet(new PlayerBet(2, new HardwayBet(10), 1));
    valid2.setOverride(true);
    valid2['pid'].should.equal(2);
    valid2['bet'].constructor.should.equal(HardwayBet);
    valid2['bet']['pointValue'].should.equal(10);
    valid2['amount'].should.equal(1);
    valid2['override'].should.equal(true);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('coming out, 10 came Easy, mark it. Working Hard 10 is down', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var hard1Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HardwayBet && ret['bet']['bet']['pointValue'] === 10 &&
             ret['bet']['pid'] === 1;
    });
    hard1Ret['bet']['amount'].should.equal(1);
    hard1Ret['pay'].should.equal(0);
    var hard2Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HardwayBet && ret['bet']['bet']['pointValue'] === 10 &&
             ret['bet']['pid'] === 2;
    });
    hard2Ret['bet']['amount'].should.equal(1);
    hard2Ret['pay'].should.equal(-1);
    gameForTest['playerBets'].length.should.equal(1);
  });
});
describe('Hardways lose on seven out', function() {
  it('hard 4 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(4), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('hard 6 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(6), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(6);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(3);
  });
  it('hard 8 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(8), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(8);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(4);
  });
  it('hard 10 is a bet', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new HardwayBet(10), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(HardwayBet);
    valid['bet']['pointValue'].should.equal(10);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(5);
  });
  it('dice are out 10 is, 7 out, line away, pay the donts, last come get some, pay behind', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(5, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var hard4Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HardwayBet && ret['bet']['bet']['pointValue'] === 4;
    });
    hard4Ret['bet']['pid'].should.equal(1);
    hard4Ret['bet']['amount'].should.equal(1);
    hard4Ret['pay'].should.equal(-1);
    var hard6Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HardwayBet && ret['bet']['bet']['pointValue'] === 6;
    });
    hard6Ret['bet']['pid'].should.equal(1);
    hard6Ret['bet']['amount'].should.equal(1);
    hard6Ret['pay'].should.equal(-1);
    var hard8Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HardwayBet && ret['bet']['bet']['pointValue'] === 8;
    });
    hard8Ret['bet']['pid'].should.equal(1);
    hard8Ret['bet']['amount'].should.equal(1);
    hard8Ret['pay'].should.equal(-1);
    var hard10Ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HardwayBet && ret['bet']['bet']['pointValue'] === 10;
    });
    hard10Ret['bet']['pid'].should.equal(1);
    hard10Ret['bet']['amount'].should.equal(1);
    hard10Ret['pay'].should.equal(-1);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
