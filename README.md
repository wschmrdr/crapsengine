## Description
crapsengine is a full game simulator of the Craps casino game written in Javascript. It is designed for use on either the client (browser) or the server (Node.js). This library is capable of:

* Creating a game interface with various house rules
* Keeping track of the progression of a typical game
* Validating and accepting standard and custom bets
* Accepting a roll of the dice and using it to determine the outcome of bets
* Identifying the bets resolved and how much is paid for the wager
* Works in both the browser and Node.js

## Installation
```
npm install crapsengine
```

## Examples
#### Server Usage
```javascript
var Game = require('crapsengine').Game;
```

#### Browser Usage
```javascript
<script src="/path/to/crapsengine.js"></script>
<script>
  var game = new Game();
  ...
</script>
```

Make a bet on a game
```javascript
var game = new Game();
var bet = new PlayerBet(1, new PassLineBet(), 5);
bet = game.makeBet(bet);
```

Make a bet, roll the dice, and get the resolved bets
```javascript
var game = new Game();
var bet = new PlayerBet(1, new PassLineBet(), 5);
bet = game.makeBet(bet);
game.rollComplete(new DiceRoll(6, 1), function(bet, pay) {
  console.log(bet);
  console.log(pay);
});
```

## API
### Game Methods
#### constructor(lowLimit, highLimit, highCenter, maxOdds, vigOnBet)
Creates the game for play. This would be a single table within a casino.
This should only be created when the game first starts, and only be abandoned after the final "seven-out" roll.
* **lowLimit** `Number` Minimum for a "non-center" bet. All center bets are minimum 1. Default: 5
* **highLimit** `Number` Maximum across all bets for a player based on positive bet. Defualt: 10000
* **highCenter** `Number` Maximum across all "center" bets. Default: 100
* **maxOdds** `Number` Maximum multiple of odds on a positive pass or come. Default: -2 (3-4-5 odds)

A zero or positive number for odds is a straight multiple of the base bet for a positive bet.
A -1 for odds is a common "Full Double" system, which gives 2x on evevrything except 6 and 8, which is 2.5x.
A -2 for odds is a common "3-4-5" system, where 4 and 10 are 3x, 5 and 9 are 4x, and 6 and 8 are 5x.
The maximum odds for a negative bet are multiplied by the statistical ratio of rolling a 7 vs. the point.

* **vigOnBet** `Boolean` For Buy and Lay bets, do we collect a commission, or "vig", on the bet? Default: False

#### makeBet(playerBet, canPressMain)
Validate the bet is appropriate for the game, add it to the array of player bets for this game, and return the bet in its added format.
* **playerBet** `PlayerBet` The bet a player wishes to make.
* **canPressMain** `Boolean` If the odds for the bet exceed the maximum, is it acceptable to press the main bet?

#### findBet(playerBet)
Find an active bet made by the player in the game.
* **playerBet** `PlayerBet` A simple instance containing the player ID and bet with pointValue to be found.

#### rollComplete(roll, callback)
Once the dice have been "rolled", evaluate each bet in the game according to the roll.
If the bet resolves, remove it from the game and issue a callback for additional processing by the implementer.
Finally, if appropriate, mark the point on the game and any unresolved contract bets.
* **roll** `DiceRoll` The combination that was rolled.
* **callback** `function(bet, pay)` Function to perform additional processing based on the resolved bet and pay after return of the original wager.

#### A Note about Resolved Bets
Normally, on a winning non-contract bet or multiple "come bets", the dealer will leave the original bet on the table, making the bet "off and on".
This engine, however, will remove the bet once it is resolved, win or lose, as some implementers will prefer this.
It is up to the implementer to determine if the person wishes to keep the bet, and reset it accordingly.

#### A Note about Removing Bets
To remove a bet, a player should override the bet to false, and will return a pay of 0 once the bet is resolved.

### PlayerBet Methods
#### constructor(pid, bet, amount, oddsAmount)
Creates a bet for the player, to be added to a Game instance pending validation.
* **pid** `Number` A unique identifier to the specific player. A player may have many bets.
* **bet** `BaseBet` The bet that is being requested.
* **amount** `Number` How much the player is wagering on the corresponding bet.
* **oddsAmount** `Number` How much the player is wagering for odds on the bet.

#### setOverride(override)
Set the override value on this bet.
The override is a tri-state variable. true for ON, false for OFF, null for the default behavior in the game.
* **override** `Boolean or null` How should this bet, or odds for a contract bet, be set?

#### setNormalAction()
Return the override value on this bet to null.

### DiceRoll Methods
#### constructor(die1, die2)
Create a combination of two dice, ordered high to low.
* **die1** `Number` The value on the first die, from 1 to 6.
* **die2** `Number` The value on the second die, from 1 to 6.

#### rollValue()
Return a numerical output of the roll, which is the sum of the two dice.

#### toString()
Returns a formatted string of the value of the roll.
Some Craps lingo is introduced based on rhyming values and basic rules of the game.

#### isValidPoint()
Returns the roll of the dice if it is a valid point, or 0 if it is not.
Valid points for ihs game are 4, 5, 6, 8, 9, and 10.

#### isEqual(comp)
Determine if two dice rolls are exactly equal. Dice rolls with the same rollValue may not be equal.
* **comp** `DiceRoll` The other DiceRoll instance to compare.

#### getRolls(value, exceptRoll)
Returns DiceRoll instances based on a specific roll value.
* **value** `Number or Array<Number}>` The value or values to get.
* **exceptRoll** `DiceRoll` Of the DiceRoll instances found, a single instance to not return.

### BaseBet Methods
#### constructor(params)
Creates a Bet instance that will be attached to a PlayerBet.
This class should be extended when creating custom bets with custom behavior.
* **params** `Object` An object containg options for the bet.

The following options are available:
* **name** `String` The name of the bet. Default: "Bet"
* **hasPoint** `Boolean` Is this a contract bet where a point will be established after the bet is made? Default: false
* **useGamePoint** `Boolean` Is the "point" for tihs bet expected to match the point for the game? Default: false
* **pointValue** `Number` The "point" for this bet, or the specific number for the bet to usually signify a win. default: 0
* **overrideComeOut** `Boolean` Is this bet normally working when the game has no point established? Default: false
* **isLose** `Boolean` Is this a Don't Bet that is subject to special rules? Default: false
* **isCenter** `Boolean` Is this bet in the "center of the table" and subject to lower limits? Default: false
* **hasVig** `Boolean` Is this bet subject to the rules about taking a 5% commission? Default: false
* **resolves** `Array<Object(Array<DiceRoll>, Number)>` The rolls and corresponding pay, after return of the wager, to resolve this bet. A losing roll always has a pay ratio of -1. Default: []
* **pointMarked** `function(pointValue[, resolves, pointResolves])` A custom function to set the point on the bet. Default: see the implemention of pointMarked in this method.
* **evaluateRoll** `function(table, playerBet, roll)` A custom function to evaluate the roll. Default: see the implemention of evaluateRoll in this method.

#### pointMarked(pointValue, resolves, pointResolves)
Establish a point if one has not yet been established or must be cleared, and set the corresponding resolves.
* **pointValue** `Number` The "point" for this bet, or the specific number for the bet to usually signify a win.
* **resolves** `Array<Object(Array<DiceRoll>, Number)>` The rolls and corresponding pay, after return of the wager, to resolve this bet when hasPoint is not set, or no point has been established.
* **pointResolves** `Array<Object(Array<DiceRoll>, Number)>` The rolls and corresponding pay, after return of the wager, to resolve this bet when hasPoint is set and a point has been established.

#### evaluateRoll(table, playerBet, roll)
Called on each of the bets on a game during rollComplete to determine if the bet is resolved.
The specific pay amount after return of original wager is returned, or null if the bet is not yet resolved.
If the override is false and the bet resolves, then the bet is returned with 0 pay.
* **table** `Game` The present game instance being played to help determine the override status.
* **playerBet** `PlayerBet` The containing PlayerBet instance to help determine the override status and pay.
* **roll** `DiceRoll` The roll of the dice against which the bet will be evaluated.

### Extended Bets Available
The following bets are what should normally be included within the instantiation of PlayerBet.
#### PassLineBet
One of the main bets, and a contract bet.
With no point, a 7 or 11 wins even money, while a 2, 3, or 12 loses. Anything else becomes the point.
With a point, rolling the point again wins even money, while rolling a 7 is a "seven out" and loses.
Odds may be taken on this bet after the point in accordance with the base bet.
The odds are paid at a ratio equal to the statistical odds of rolling the point vs. a 7.
#### DontPassLineBet
One of the main bets, and a contract bet subject to special losing rules.
The wins and losses are the opposite of PassLineBet, with the exception of a 12 with no point, which pushes.
Odds may be laid on the bet after the point in accordance with what is paid on the winning roll of 7.
The odds are paid at a ratio equal to the statistical odds of rolling a 7 vs. the point.
#### ComeBet
A contract bet.
The rules are the same as the PassLineBet, except that the bet is made after the game has a point established.
Odds are off when the game has no point established.
#### DontComeBet
A contract bet subject to special losing rules.
The rules are the same as the DontPassLineBet, except that the bet is made after the game has a point established.
Odds are on when the game has no point established.
#### FieldBet
A bet that is resolved on the next roll.
A 3, 4, 9, 10, or 11 wins even money, a 2 wins double, a 12 wins triple, while any other roll loses.
A common casino variation, StingyFieldBet, has been included which pays double on the 12.
Either FieldBet or StingyFieldBet should be used in accordance with the game rules, but never both.
#### BigBet
A bet on the "Big 6" or "Big 8". Use pointValue at construction to signify the winning number.
A roll of pointValue wins even money, while a 7 loses.
This bet is on when the game has no point established.
This bet is rarely offered in casinos at the time of initial commit, as the PlaceBet pays more for similar rules.
#### PlaceBet
A bet on any of the point numbers. Use pointValue at construction to signify the winning number.
A roll of pointValue wins 9/5 on 4 and 10, 7/5 on 5 and 9, and 7/6 on 6 and 8, while a 7 loses.
This bet is off when the game has no point established.
#### BuyBet
A bet on any of the point numbers. Use pointValue at construction to signify the winning number.
A roll of pointValue pays at a ratio equal to the statistical odds of rolling the point vs. a 7, while a 7 loses.
A 5% commission is charged for this bet, which is either on the bet or the win. This is determined by the Game instance.
It is more profitable to use BuyBet for 4 and 10, and PlaceBet for the 5, 6, 8, and 9.
Some casinos will therefore only offer the BuyBet on the 4 and 10, but the PlaceBet for all six point numbers.
#### LayBet
A bet on any of the point numbers subject to special losing rules.
Use pointValue at construction to signify the losing number.
A roll of 7 pays at a ratio equal to the statistical odds of rolling a 7 vs. the point, while pointValue loses.
A 5% commission is charged for this bet based on what is paid on the winning roll of 7.
The commission is charged either on the bet or the win. This is determined by the Game instance.
#### HardwayBet
A center bet on any roll of "doubles" from 4 to 10. Use pointValue at construction to signify the number.
A roll of pointValue with the dice values equal wins 7/1 on 4 and 10, and 9/1 on 6 and 8.
A roll of 7 or pointValue with the dice values unequal loses.
#### AcesStraightBet
A center bet that is resolved on the next roll.
A 2 pays 30/1, while any other roll loses.
#### AceDeuceStraightBet
A center bet that is resolved on the next roll.
A 3 pays 15/1, while any other roll loses.
#### YoStraightBet
A center bet that is resolved on the next roll.
An 11 pays 15/1, while any other roll loses.
#### TwelveStraightBet
A center bet that is resolved on the next roll.
A 12 pays 30/1, while any other roll loses.
#### HiLoBet
A center bet that is resolved on the next roll.
This is a single bet evenly split between AcesStraightBet and TwelveStraightBet.
The bet does not usually have its own spot on the table, but is commonly bet by players.
Pay is in accordance with the straight bet minus the values from the losing numbers.
As an example, a HiLoBet worth 2 will pay 29 on either the 2 or the 12, while any other roll loses.
#### HiLoYoBet
A center bet that is resolved on the next roll.
This is a single bet evenly split between AcesStraightBet, YoStraightBet, and TwelveStraightBet.
The bet does not usually have its own spot on the table, but is commonly bet by players.
Pay is in accordance with the straight bet minus the values from the losing numbers.
#### AnyCrapsBet
A center bet that is resolved on the next roll.
A 2, 3, or 12 pays 7/1, while any other roll loses.
#### CAndEBet
A center bet that is resolved on the next roll.
This is a single bet evenly split between AnyCrapsBet and YoStraightBet.
Pay is in accordance with the straight bet minus the values from the losing bets.
#### HornBet
A center bet that is resolved on the next roll.
This is a single bet evenly split between AcesStraightBet, AceDeuceStraightBet, YoStraightBet, and TwelveStraightBet.
Pay is in accordance with the straight bet minus the values from the losing numbers.
#### HornHighAcesBet
A center bet that is resolved on the next roll.
This bet is equivalent to HornBet, but is split five ways with the extra unit placed on AcesStraightBet.
Pay is in accordance with the straight bet minus the values from the losing numbers.
#### HornHighAceDeuceBet
A center bet that is resolved on the next roll.
This bet is equivalent to HornBet, but is split five ways with the extra unit placed on AceDeuceStraightBet.
Pay is in accordance with the straight bet minus the values from the losing numbers.
#### HornHighYoBet
A center bet that is resolved on the next roll.
This bet is equivalent to HornBet, but is split five ways with the extra unit placed on YoStraightBet.
Pay is in accordance with the straight bet minus the values from the losing numbers.
#### HornHighTwelveBet
A center bet that is resolved on the next roll.
This bet is equivalent to HornBet, but is split five ways with the extra unit placed on TwelveStraightBet.
Pay is in accordance with the straight bet minus the values from the losing numbers.
#### AnySevenBet
A center bet that is resolved on the next roll.
A 7 pays 4/1, while any other roll loses.
#### World Bet
A center bet that is resolved on the next roll.
This is a single bet evenly split between AcesStraightBet, AceDeuceStraightBet, YoStraightBet, TwelveStraightBet, and AnySevenBet.
Pay is in accordance with the straight bet minus the values from the losing numbers.
Effectively, the seven is a push.

### Errors
#### GameMinimumError
The player attempted to make a bet for an amount that is below the minimum for the game.
#### GameMaximumError
The player attempted to make a bet for an amount that would put the player's action above the maximum for the game.
#### GameOddsMaximumError
The player attempted to take/lay odds on a bet beyond the maximum amount for the game without increasing the main bet.
#### GameBetNotAllowedError
The player attempted to make or add to a bet that is not allowed under the rules of Craps.
#### DieValueError
The value on a die is not an integer between 1 and 6, inclusive.
#### BetInvalidPointError
The point attempting to be set for the bet is not valid.

## Testing
```
npm install
npm test
```

## License
Copyright (c) 2017 wschmrdr

Released under the MIT License.
