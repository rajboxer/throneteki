const BaseStep = require('../basestep.js');
const BypassByStealth = require('../../GameActions/BypassByStealth');

class ChooseStealthTargets extends BaseStep {
    constructor(game, challenge, stealthCharacters) {
        super(game);
        this.challenge = challenge;
        this.stealthCharacters = stealthCharacters.filter(character => this.hasStealthTargets(character));
    }

    hasStealthTargets(character) {
        return this.challenge.defendingPlayer.anyCardsInPlay(card => this.canStealth(card, this.challenge, character));
    }

    continue() {
        if(this.stealthCharacters.length > 0) {
            let character = this.stealthCharacters.shift();

            let title = character.stealthLimit === 1 ? 'Select stealth target for ' + character.name : 'Select up to ' + character.stealthLimit + ' stealth targets for ' + character.name;
            this.game.promptForSelect(character.controller, {
                numCards: character.stealthLimit,
                activePromptTitle: title,
                waitingPromptTitle: 'Waiting for opponent to choose stealth target for ' + character.name,
                cardCondition: card => this.canStealth(card, this.challenge, character),
                onSelect: (player, target) => this.selectStealthTarget(character, target)
            });
        }

        return this.stealthCharacters.length === 0;
    }

    canStealth(card, challenge, character) {
        return BypassByStealth.allow({ challenge, source: character, target: card });
    }

    selectStealthTarget(character, targets) {
        if(!Array.isArray(targets)) {
            targets = [targets];
        }

        for(let target of targets) {
            this.challenge.addStealthChoice(character, target);
        }

        this.game.addMessage('{0} has chosen {1} as the stealth target for {2}', this.challenge.attackingPlayer, targets, character);

        return true;
    }
}

module.exports = ChooseStealthTargets;
