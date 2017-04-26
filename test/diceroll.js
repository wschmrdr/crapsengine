var should = require('should');
var DiceRoll = require('../crapsengine').DiceRoll;

describe('The Dice Roll class', function() {
  it('should set the dice values and return the sum as the roll value', function() {
    var dice = new DiceRoll(4, 2);
    dice['die1'].should.equal(4);
    dice['die2'].should.equal(2);
    dice.rollValue().should.equal(6);
    dice.toString().should.equal('6 came Easy');
    dice.isValidPoint().should.equal(6);
  });
  it('should throw an error if an integer is not used', function() {
    try {
      new DiceRoll(1.5, 1);
    } catch(e) {
      e.name.should.equal('DieValueError');
      e.message.should.equal("The first die is not a valid value.");
    }
    try {
      new DiceRoll(1, 1.1);
    } catch(e) {
      e.name.should.equal('DieValueError');
      e.message.should.equal("The second die is not a valid value.");
    }
  });
  it('should throw an error if either die is not between 1 and 6', function() {
    try {
      new DiceRoll(0, 1);
    } catch(e) {
      e.name.should.equal('DieValueError');
      e.message.should.equal("The first die is not a valid value.");
    }
    try {
      new DiceRoll(7, 1);
    } catch(e) {
      e.name.should.equal('DieValueError');
      e.message.should.equal("The first die is not a valid value.");
    }
    try {
      new DiceRoll(6, 0);
    } catch(e) {
      e.name.should.equal('DieValueError');
      e.message.should.equal("The second die is not a valid value.");
    }
    try {
      new DiceRoll(6, 7);
    } catch(e) {
      e.name.should.equal('DieValueError');
      e.message.should.equal("The second die is not a valid value.");
    }
  });
  it('should be allowed in any order for doubles with a hardway', function() {
    var dice = new DiceRoll(5, 5);
    dice['die1'].should.equal(5);
    dice['die2'].should.equal(5);
    dice.rollValue().should.equal(10);
    dice.toString().should.equal('10 the Hardway');
    dice.isValidPoint().should.equal(10);
  });
  it('should always order the dice from high to low', function() {
    var dice = new DiceRoll(2, 3);
    dice['die1'].should.equal(3);
    dice['die2'].should.equal(2);
    dice.rollValue().should.equal(5);
    dice.toString().should.equal('5 No Field');
    dice.isValidPoint().should.equal(5);
  });
  it('should only return a valid point if there is one', function() {
    var dice = new DiceRoll(1, 1);
    dice['die1'].should.equal(1);
    dice['die2'].should.equal(1);
    dice.rollValue().should.equal(2);
    dice.toString().should.equal('2 is Craps');
    dice.isValidPoint().should.equal(0);
  });
  it('should determine two rolls are equal', function() {
    var dice1 = new DiceRoll(6, 3);
    var dice2 = new DiceRoll(6, 3);
    dice1['die1'].should.equal(6);
    dice1['die2'].should.equal(3);
    dice1.rollValue().should.equal(9);
    dice1.toString().should.equal('9 Center Field');
    dice1.isValidPoint().should.equal(9);
    dice1.isEqual(dice2).should.equal(true);
  });
  it('should determine two rolls are equal with the same dice', function() {
    var dice1 = new DiceRoll(6, 6);
    var dice2 = new DiceRoll(6, 6);
    dice1['die1'].should.equal(6);
    dice1['die2'].should.equal(6);
    dice1.rollValue().should.equal(12);
    dice1.toString().should.equal('12 is Craps');
    dice1.isValidPoint().should.equal(0);
    dice1.isEqual(dice2).should.equal(true);
  });
  it('should determine two rolls are equal with the order reversed', function() {
    var dice1 = new DiceRoll(3, 1);
    var dice2 = new DiceRoll(1, 3);
    dice1['die1'].should.equal(3);
    dice1['die2'].should.equal(1);
    dice1.rollValue().should.equal(4);
    dice1.toString().should.equal('4 came Easy');
    dice1.isValidPoint().should.equal(4);
    dice1.isEqual(dice2).should.equal(true);
  });
  it('should determine two rolls are not equal even with the same roll value', function() {
    var dice1 = new DiceRoll(6, 1);
    var dice2 = new DiceRoll(5, 2);
    dice1['die1'].should.equal(6);
    dice1['die2'].should.equal(1);
    dice1.rollValue().should.equal(7);
    dice1.toString().should.equal('7');
    dice1.isValidPoint().should.equal(0);
    dice1.isEqual(dice2).should.equal(false);
  });
  it('should determine two rolls are not equal if only first die is equal', function() {
    var dice1 = new DiceRoll(6, 5);
    var dice2 = new DiceRoll(6, 6);
    dice1['die1'].should.equal(6);
    dice1['die2'].should.equal(5);
    dice1.rollValue().should.equal(11);
    dice1.toString().should.equal('11 Yo');
    dice1.isValidPoint().should.equal(0);
    dice1.isEqual(dice2).should.equal(false);
  });
  it('should determine two rolls are not equal if only the second die is equal', function() {
    var dice1 = new DiceRoll(2, 1);
    var dice2 = new DiceRoll(1, 1);
    dice1['die1'].should.equal(2);
    dice1['die2'].should.equal(1);
    dice1.rollValue().should.equal(3);
    dice1.toString().should.equal('3 is Craps');
    dice1.isValidPoint().should.equal(0);
    dice1.isEqual(dice2).should.equal(false);
  });
  it('should get all rolls for a single value', function() {
    var rolls = DiceRoll.getRolls(5);
    rolls.length.should.equal(2);
    var compare = new DiceRoll(4, 1);
    function checkDice(dice) {
      return dice.isEqual(compare);
    }
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(3, 2);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(2, 3);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(3, 1);
    rolls.findIndex(checkDice).should.be.below(0);
  });
  it('should get all rolls for a single value returning a single value as an array', function() {
    var rolls = DiceRoll.getRolls(2);
    rolls.length.should.equal(1);
    var compare = new DiceRoll(1, 1);
    function checkDice(dice) {
      return dice.isEqual(compare);
    }
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(1, 2);
    rolls.findIndex(checkDice).should.be.below(0);
  });
  it('should get all rolls for multiple values', function() {
    var rolls = DiceRoll.getRolls([3, 4, 9, 10, 11]); // Field Roll paying single
    rolls.length.should.equal(8);
    var compare = new DiceRoll(2, 1);
    function checkDice(dice) {
      return dice.isEqual(compare);
    }
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(3, 1);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(2, 2);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(5, 4);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(6, 3);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(5, 5);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(6, 4);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(6, 5);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(3, 3);
    rolls.findIndex(checkDice).should.be.below(0);
  });
  it('should get all rolls except an exception', function() {
    var dice = new DiceRoll(4, 4);
    dice['die1'].should.equal(4);
    dice['die2'].should.equal(4);
    dice.rollValue().should.equal(8);
    dice.toString().should.equal('8 the Hardway');
    dice.isValidPoint().should.equal(8);
    var rolls = DiceRoll.getRolls(8, dice); // Hard 8 Losers
    rolls.length.should.equal(2);
    var compare = new DiceRoll(6, 2);
    function checkDice(dice) {
      return dice.isEqual(compare);
    }
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(5, 3);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(4, 4);
    rolls.findIndex(checkDice).should.be.below(0);
  });
  it('should get no rolls if all returns are exceptions', function() {
    var dice = new DiceRoll(6, 6);
    var rolls = DiceRoll.getRolls(12, dice);
    rolls.length.should.equal(0);
    var compare = new DiceRoll(6, 6);
    function checkDice(dice) {
      return dice.isEqual(compare);
    }
    rolls.findIndex(checkDice).should.be.below(0);
  });
  it('should get all rolls if the exception is not found', function() {
    var dice = new DiceRoll(4, 4);
    var rolls = DiceRoll.getRolls([6, 7], dice);
    rolls.length.should.equal(6);
    var compare = new DiceRoll(3, 3);
    function checkDice(dice) {
      return dice.isEqual(compare);
    }
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(4, 2);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(5, 1);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(6, 1);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(5, 2);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(4, 3);
    rolls.findIndex(checkDice).should.be.aboveOrEqual(0);
    compare = new DiceRoll(4, 4);
    rolls.findIndex(checkDice).should.be.below(0);
  });
});
