import { RuleSet } from './RuleSet';

export class PositiveZIndexRuleSet extends RuleSet {
    public static validateMove(
        cells: any,
        cellIndex: any,
        zIndex: any,
        card: any,
    ): any {
        const verifyPositionResult = PositiveZIndexRuleSet.verifyPosition(cells, cellIndex);
        if (!verifyPositionResult.success) {
            return verifyPositionResult;
        }

        const sideCardsResult = PositiveZIndexRuleSet.verifySideCards(cells, cellIndex);
        if (!sideCardsResult.success) {
            return {
                success: false,
                error: sideCardsResult.error,
            };
        }

        const CardConnectionsResult = PositiveZIndexRuleSet.verifyCardConnections(
            cells,
            sideCardsResult.sideCell.position,
        );
        if (!CardConnectionsResult.success) {
            return {
                success: false,
                error: CardConnectionsResult.error,
            };
        }

        const verifyCardMatchResult = PositiveZIndexRuleSet.verifyCardMatch(
            card,
            zIndex,
            sideCardsResult.sideCell,
        );
        if (!verifyCardMatchResult.success) {
            return verifyCardMatchResult;
        }

        return {
            success: zIndex >= 0,
        };
    }
}
