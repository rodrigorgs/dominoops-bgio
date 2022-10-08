import { RuleSet } from './RuleSet';

export let Rules;

const ruleType = process.env.RULE_TYPE;

const { BaseRuleSet } = require(`./BaseRuleSet`);
const { PositiveZIndexRuleSet } = require(`./PositiveZIndexRuleSet`);

switch (ruleType) {
    case 'zindex':
        Rules = PositiveZIndexRuleSet
        console.log("Using zIndex ruleset...")
        break;

    default:
        Rules = BaseRuleSet;
        console.log("Using base ruleset...")
        break;
}
