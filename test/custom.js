var should = require('should');
var Game = require('../crapsengine').Game;
var PlayerBet = require('../crapsengine').PlayerBet;
var DiceRoll = require('../crapsengine').DiceRoll;
var BaseBet = require('../crapsengine').BaseBet;
var PassLineBet = require('../crapsengine').PassLineBet;

var gameForTest = new Game();

describe('Create a Hop Bet', function() {
  it('Hop the 31 is a bet', function() {
    var resolves = [
      {
        'rolls': [new DiceRoll(3, 1)],
        'pay': 15
      },
      {
        'rolls': DiceRoll.getRolls([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], new DiceRoll(3, 1)),
        'pay': -1
      }
    ];
    var params = {
      'name': 'Hop 31',
      'overrideComeOut': true,
      'isCenter': true,
      'resolves': resolves
    }
    var valid = gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BaseBet);
    valid['bet']['name'].should.equal('Hop 31'),
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('coming out, no roll no line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    retpay.should.equal(0);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('coming out, 4 came Easy, mark it. Pay the bonus money', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest['playerBets'].length.should.equal(2);
    gameForTest.rollComplete(new DiceRoll(3, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['pid'].should.equal(1);
    retbet['bet']['name'].should.equal('Hop 31'),
    retbet['amount'].should.equal(1);
    retpay.should.equal(15);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Hop the 31 is a bet', function() {
    var resolves = [
      {
        'rolls': [new DiceRoll(3, 1)],
        'pay': 15
      },
      {
        'rolls': DiceRoll.getRolls([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], new DiceRoll(3, 1)),
        'pay': -1
      }
    ];
    var params = {
      'name': 'Hop 31',
      'overrideComeOut': true,
      'isCenter': true,
      'resolves': resolves
    }
    var valid = gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 1));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BaseBet);
    valid['bet']['name'].should.equal('Hop 31'),
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(1);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 4 is, 7 out, line away, pay the donts, last come get some, pay behind', function() {
    var retValues = [];
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retValues.push({'bet': bet,
                      'pay': pay});
    });
    gameForTest['playerBets'].length.should.equal(0);
    var hopRet = retValues.find(function(ret) {
      return ret['bet']['bet'].constructor === BaseBet && ret['bet']['bet']['name'] === 'Hop 31';
    });
    hopRet['bet']['pid'].should.equal(1);
    hopRet['bet']['amount'].should.equal(1);
    hopRet['pay'].should.equal(-1);
  });
});
describe('Create a Dont Pass Line Bet where 12 wins on the first roll', function() {
  it('Custom Dont Pass Line is a bet', function() {
    var params = {
      'name': 'Dont Pass Line 12 Wins',
      'hasPoint': true,
      'useGamePoint': true,
      'overrideComeOut': true,
      'isLose': true,
      'pointMarked': function(pointValue) {
        if (pointValue && this.pointValue) {
          return;
        }
        this.pointValue = pointValue;
        if (this.hasPoint && pointValue) {
          this.resolves = [
            {
              'rolls': DiceRoll.getRolls(pointValue),
              'pay': -1
            },
            {
              'rolls': DiceRoll.getRolls(7),
              'pay': 1
            }
          ];
        } else {
          this.resolves = [
            {
              'rolls': DiceRoll.getRolls([2, 3, 12]),
              'pay': 1
            },
            {
              'rolls': DiceRoll.getRolls([7, 11]),
              'pay': -1
            }
          ];
        }
      }
    }
    var valid = gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BaseBet);
    valid['bet']['name'].should.equal('Dont Pass Line 12 Wins'),
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('coming out, 12 is Craps, line away, pay the donts, triple the field', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['pid'].should.equal(1);
    retbet['bet']['name'].should.equal('Dont Pass Line 12 Wins'),
    retbet['amount'].should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
  });
  it('Custom Dont Pass Line is a bet, immediate pressure is a bet', function() {
    var params = {
      'name': 'Dont Pass Line 12 Wins',
      'hasPoint': true,
      'useGamePoint': true,
      'overrideComeOut': true,
      'isLose': true,
      'pointMarked': function(pointValue) {
        if (pointValue && this.pointValue) {
          return;
        }
        this.pointValue = pointValue;
        if (this.hasPoint && pointValue) {
          this.resolves = [
            {
              'rolls': DiceRoll.getRolls(pointValue),
              'pay': -1
            },
            {
              'rolls': DiceRoll.getRolls(7),
              'pay': 1
            }
          ];
        } else {
          this.resolves = [
            {
              'rolls': DiceRoll.getRolls([2, 3, 12]),
              'pay': 1
            },
            {
              'rolls': DiceRoll.getRolls([7, 11]),
              'pay': -1
            }
          ];
        }
      }
    }
    var valid = gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BaseBet);
    valid['bet']['name'].should.equal('Dont Pass Line 12 Wins'),
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
    var valid = gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BaseBet);
    valid['bet']['name'].should.equal('Dont Pass Line 12 Wins'),
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(10);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('coming out, 7 front line winner, take the donts, pay the line', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['pid'].should.equal(1);
    retbet['bet']['name'].should.equal('Dont Pass Line 12 Wins'),
    retbet['amount'].should.equal(10);
    retpay.should.equal(-10);
    gameForTest['playerBets'].length.should.equal(0);
  });
  it('Custom Dont Pass Line is a bet', function() {
    var params = {
      'name': 'Dont Pass Line 12 Wins',
      'hasPoint': true,
      'useGamePoint': true,
      'overrideComeOut': true,
      'isLose': true,
      'pointMarked': function(pointValue) {
        if (pointValue && this.pointValue) {
          return;
        }
        this.pointValue = pointValue;
        if (this.hasPoint && pointValue) {
          this.resolves = [
            {
              'rolls': DiceRoll.getRolls(pointValue),
              'pay': -1
            },
            {
              'rolls': DiceRoll.getRolls(7),
              'pay': 1
            }
          ];
        } else {
          this.resolves = [
            {
              'rolls': DiceRoll.getRolls([2, 3, 12]),
              'pay': 1
            },
            {
              'rolls': DiceRoll.getRolls([7, 11]),
              'pay': -1
            }
          ];
        }
      }
    }
    var valid = gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 5));
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BaseBet);
    valid['bet']['name'].should.equal('Dont Pass Line 12 Wins'),
    valid['bet']['pointValue'].should.equal(0);
    valid['amount'].should.equal(5);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('no bet, cannot press the dont', function() {
    var params = {
      'name': 'Dont Pass Line 12 Wins',
      'hasPoint': true,
      'useGamePoint': true,
      'overrideComeOut': true,
      'isLose': true,
      'pointMarked': function(pointValue) {
        if (pointValue && this.pointValue) {
          return;
        }
        this.pointValue = pointValue;
        if (this.hasPoint && pointValue) {
          this.resolves = [
            {
              'rolls': DiceRoll.getRolls(pointValue),
              'pay': -1
            },
            {
              'rolls': DiceRoll.getRolls(7),
              'pay': 1
            }
          ];
        } else {
          this.resolves = [
            {
              'rolls': DiceRoll.getRolls([2, 3, 12]),
              'pay': 1
            },
            {
              'rolls': DiceRoll.getRolls([7, 11]),
              'pay': -1
            }
          ];
        }
      }
    }
    try {
      gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 5));
    } catch(e) {
      e.name.should.equal('GameBetNotAllowedError');
      e.message.should.equal('Cannot Put a Dont bet with a point.');
    }
  });
  it('dice are out 9 is, 7 out, line away, pay the donts, last come get some, pay behind', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(1, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['pid'].should.equal(1);
    retbet['bet']['name'].should.equal('Dont Pass Line 12 Wins'),
    retbet['amount'].should.equal(5);
    retpay.should.equal(5);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
describe('Create a Buy Bet with a 10% commission on the win', function() {
  it('coming out, 9 Center Field, mark it', function() {
    var retbet, retpay;
    gameForTest.makeBet(new PlayerBet(1, new PassLineBet(), 5));
    gameForTest.rollComplete(new DiceRoll(6, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    should.not.exist(retbet);
    should.not.exist(retpay);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Custom Buy the 4 is a bet', function() {
    var params = {
      'name': 'Buy 10 Percent',
      'hasVig': true,
      'evaluateRoll': function(table, playerBet, roll) {
        // Determine the override values on this bet.
        // On the "come out roll", the bet is according to overrideComeOut.
        // Odds on the "come out roll" for positive bets are off, negative bets are on.
        var override = false;
        // Now set the overrides based on player wishes and current game standing.
        if (playerBet['override'] === true || playerBet['override'] === false) {
          // The player has specifically requested a bet be always on or always off.
          override = playerBet['override'];
        } else if (table['pointValue']) {
          // A point is established; the bet is on.
          override = true;
        }
        for (var x=0; x<this.resolves.length; x++) {
          if (this.resolves[x]['rolls'].find(function(resRoll) { return resRoll.isEqual(roll); })) {
            var retPay = override ? Math.floor(this.resolves[x]['pay'] * playerBet['amount']) : 0;
            if (retPay > 0 && !table['vigOnBet']) {
              // The 10% Commission is only ever paid on a win, and only on the main bet.
              var vig = Math.floor(playerBet['amount'] / 10) || 1;
              retPay -= vig;
            }
            return retPay;
          }
        }
        return null;
      }
    }
    var valid = gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 20));
    var resolves = [
      {
        'rolls': DiceRoll.getRolls(4),
        'pay': 6/3
      },
      {
        'rolls': DiceRoll.getRolls(7),
        'pay': -1
      }
    ];
    gameForTest.findBet(new PlayerBet(1, new BaseBet(params), 20))['bet'].pointMarked(4, resolves);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BaseBet);
    valid['bet']['name'].should.equal('Buy 10 Percent'),
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(20);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 9 is, 4 came Easy, field roll, donts and comes', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(1, 3), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['pid'].should.equal(1);
    retbet['bet']['name'].should.equal('Buy 10 Percent'),
    retbet['amount'].should.equal(20);
    retpay.should.equal(38);
    gameForTest['playerBets'].length.should.equal(1);
  });
  it('Custom Buy the 4 is a bet', function() {
    var params = {
      'name': 'Buy 10 Percent',
      'hasVig': true,
      'evaluateRoll': function(table, playerBet, roll) {
        // Determine the override values on this bet.
        // On the "come out roll", the bet is according to overrideComeOut.
        // Odds on the "come out roll" for positive bets are off, negative bets are on.
        var override = false;
        // Now set the overrides based on player wishes and current game standing.
        if (playerBet['override'] === true || playerBet['override'] === false) {
          // The player has specifically requested a bet be always on or always off.
          override = playerBet['override'];
        } else if (table['pointValue']) {
          // A point is established; the bet is on.
          override = true;
        }
        for (var x=0; x<this.resolves.length; x++) {
          if (this.resolves[x]['rolls'].find(function(resRoll) { return resRoll.isEqual(roll); })) {
            var retPay = override ? Math.floor(this.resolves[x]['pay'] * playerBet['amount']) : 0;
            if (retPay > 0 && !table['vigOnBet']) {
              // The 10% Commission is only ever paid on a win, and only on the main bet.
              var vig = Math.floor(playerBet['amount'] / 10) || 1;
              retPay -= vig;
            }
            return retPay;
          }
        }
        return null;
      }
    }
    var valid = gameForTest.makeBet(new PlayerBet(1, new BaseBet(params), 20));
    var resolves = [
      {
        'rolls': DiceRoll.getRolls(4),
        'pay': 6/3
      },
      {
        'rolls': DiceRoll.getRolls(7),
        'pay': -1
      }
    ];
    gameForTest.findBet(new PlayerBet(1, new BaseBet(params), 20))['bet'].pointMarked(4, resolves);
    valid['pid'].should.equal(1);
    valid['bet'].constructor.should.equal(BaseBet);
    valid['bet']['name'].should.equal('Buy 10 Percent'),
    valid['bet']['pointValue'].should.equal(4);
    valid['amount'].should.equal(20);
    gameForTest['playerBets'].length.should.equal(2);
  });
  it('dice are out 9 is, 7 out, line away, pay the donts, last come get some, pay behind', function() {
    var retbet, retpay;
    gameForTest.rollComplete(new DiceRoll(1, 6), function(bet, pay) {
      retbet = bet;
      retpay = pay;
    });
    retbet['pid'].should.equal(1);
    retbet['bet']['name'].should.equal('Buy 10 Percent'),
    retbet['amount'].should.equal(20);
    retpay.should.equal(-20);
    gameForTest['playerBets'].length.should.equal(0);
  });
});
