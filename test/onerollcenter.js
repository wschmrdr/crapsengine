var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var PassLineBet = require('../crapsengine').PassLineBet;
var AcesStraightBet = require('../crapsengine').AcesStraightBet;
var AceDeuceStraightBet = require('../crapsengine').AceDeuceStraightBet;
var YoStraightBet = require('../crapsengine').YoStraightBet;
var TwelveStraightBet = require('../crapsengine').TwelveStraightBet;
var HiLoBet = require('../crapsengine').HiLoBet;
var HiLoYoBet = require('../crapsengine').HiLoYoBet;
var AnyCrapsBet = require('../crapsengine').AnyCrapsBet;
var CAndEBet = require('../crapsengine').CAndEBet;
var HornBet = require('../crapsengine').HornBet;
var HornHighAcesBet = require('../crapsengine').HornHighAcesBet;
var HornHighAceDeuceBet = require('../crapsengine').HornHighAceDeuceBet;
var HornHighYoBet = require('../crapsengine').HornHighYoBet;
var HornHighTwelveBet = require('../crapsengine').HornHighTwelveBet;
var AnySevenBet = require('../crapsengine').AnySevenBet;
var WorldBet = require('../crapsengine').WorldBet;

var gameForTest = new Game();

describe('All One Roll Center Action Bets not allowed without a line bet', function() {
  it('Coming out, Cs and Es, His, Los, Yos, Worlds, any Center Action', function() {
    var valid = gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(AcesStraightBet);
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(1);
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(15);
  });
  it('no roll no line', function() {
    var retbet, retpay;
    gameForTest['playerBets'].length.should.equal(15);
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(15);
  });
});
describe('All One Roll Center Action Bets Lose', function() {
  it('coming out, 5 No Field, mark it', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(4, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(-3);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(-4);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 4 came Easy', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(-3);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(-4);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 6 came Easy', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(5, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(-3);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(-4);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 8 came Easy', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 2), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(-3);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(-4);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 9 Center Field', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(-3);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(-4);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 10 came Easy', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 4), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(-3);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(-4);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    gameForTest['playerBets'].length.should.equal(1);
  });
});
describe('All One Roll Center Action Bets possible wins', function() {
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 2 is Craps. Pay the bonus money', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(1, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(30);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(29);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(28);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(7);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(6);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(27);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(57);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(26);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(26);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(26);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(26);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 3 is Craps. Pay the bonus money', function() {
    var retValues = [];
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(2, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(15);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(-3);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(7);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(6);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(12);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(11);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(27);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(11);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(11);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(11);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 11 Yo. Pay the bonus money', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 5), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(15);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(13);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(14);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(12);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(11);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(11);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(27);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(11);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(11);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 12 is Craps. Pay the bonus money', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 6), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(30);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(29);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(28);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(7);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(6);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(27);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(26);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(26);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(26);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(57);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(26);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Center action is a bet', function() {
    gameForTest.makeBet(new PlayerBet(1, new AcesStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new AceDeuceStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new YoStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new TwelveStraightBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new HiLoBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HiLoYoBet(), 3));
    gameForTest.makeBet(new PlayerBet(1, new AnyCrapsBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new CAndEBet(), 2));
    gameForTest.makeBet(new PlayerBet(1, new HornBet(), 4));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAcesBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighAceDeuceBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighYoBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new HornHighTwelveBet(), 5));
    gameForTest.makeBet(new PlayerBet(1, new AnySevenBet(), 1));
    gameForTest.makeBet(new PlayerBet(1, new WorldBet(), 5));
    gameForTest['playerBets'].length.should.equal(16);
  });
  it('dice are out 5 is, 7 out, line away, pay the donts, last come get some, pay behind', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AcesStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AceDeuceStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === YoStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === TwelveStraightBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HiLoYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(3);
    ret['pay'].should.equal(-3);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnyCrapsBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(-1);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === CAndEBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(2);
    ret['pay'].should.equal(-2);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(4);
    ret['pay'].should.equal(-4);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAcesBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighAceDeuceBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighYoBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === HornHighTwelveBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(-5);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === AnySevenBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(1);
    ret['pay'].should.equal(4);
    var ret = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === WorldBet;
    });
    ret['bet']['pid'].should.equal(1);
    ret['bet']['amount'].should.equal(5);
    ret['pay'].should.equal(0);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
