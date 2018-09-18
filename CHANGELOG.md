## CHANGELOG

### Changes from 0.2.0 to 0.2.1
#### Fixes
Updated the package.json file to be proper.
Updated the version number to 0.2.1.

### Changes from 0.1.0 to 0.2.0
#### Breaking Changes
* Refactoring of BaseBet to accept a single object containing all the previous parameters.

#### New Features
* Added new parameter options for BaseBet to follow the game's pointValue, if the bet takes a commission, a function override for pointMarked to set a custom point, and a function override for evaluateRoll to determine if the bet is resolved.
* Updated the bet validation and default roll evaluation to use these parameter options instead of hard-coded bet classes.
* Added corresponding unit testing for custom bets.

#### Fixes
Updated the README file to output more nicely.
Updated the version number to 0.2.0.

### Version 0.1.0
Initial commit of engine.
