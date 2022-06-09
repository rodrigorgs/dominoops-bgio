import { RuleSet } from './RuleSet';

export let Rules;

const ruleType = process.env.RULE_TYPE;

const { BaseRuleSet } = require(`./BaseRuleSet`);

switch (ruleType) {
    case 'rules':
        break;

    default:
        Rules = BaseRuleSet;
        break;
}
