import { RuleSet } from './RuleSet';

export class BaseRuleSet extends RuleSet {
    public static validateMove(
        G: any,
        ctx: any,
        cellIndex: any,
        zIndex: any,
        card: any,
    ): any {
        const verifyPositionResult = BaseRuleSet.verifyPosition(G, cellIndex);
        if (!verifyPositionResult.success) {
            return verifyPositionResult;
        }

        const sideCardsResult = BaseRuleSet.verifySideCards(G, cellIndex);
        if (!sideCardsResult.success) {
            return {
                success: false,
                error: sideCardsResult.error,
            };
        }

        const CardConnectionsResult = BaseRuleSet.verifyCardConnections(
            G,
            sideCardsResult.sideCell.position,
        );
        if (!CardConnectionsResult.success) {
            return {
                success: false,
                error: CardConnectionsResult.error,
            };
        }

        const verifyCardMatchResult = BaseRuleSet.verifyCardMatch(
            card,
            zIndex,
            sideCardsResult.sideCell,
        );
        if (!verifyCardMatchResult.success) {
            return verifyCardMatchResult;
        }

        return {
            success: true,
        };
    }
}
