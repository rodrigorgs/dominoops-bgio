// @ts-ignore
import { CARD_SIDES, getSideIndexes } from '../utils';

// @ts-ignore
import { baseClasses } from '../data/base-classes';
// @ts-ignore
import { baseObjects } from '../data/base-objects';

export abstract class RuleSet {
    public static validateMove: (
        cells: any,
        cellIndex: any,
        zIndex: any,
        card: any,
    ) => any;

    static verifyPosition(cells: any, cellIndex: any): any {
        const error = 'Já existe uma carta nessa posição!';

        if (cells[cellIndex] !== null) {
            return {
                success: false,
                error: error,
            };
        }

        return {
            success: true,
        };
    }

    static getSideCells(cells: any, cellIndex: any): any {
        const sideCells = [];
        const sideIndexes = getSideIndexes(cellIndex);

        for (const index in sideIndexes) {
            const { position, side } = sideIndexes[index];

            if (cells[position] !== null) {
                const cell = { ...cells[position] };
                cell.card = baseObjects[cell.id];
                cell.side = side;
                cell.position = position;

                sideCells.push(cell);
            }
        }

        return sideCells;
    }

    static verifySideCards(cells: any, cellIndex: any): any {
        const error = {
            noCards: 'Não existem cartas adjacentes nessa posição!',
            multipleCards:
                'Uma carta não pode se conectar a duas ou mais cartas!',
        };

        const sideCells = this.getSideCells(cells, cellIndex);

        if (sideCells.length < 1) {
            return {
                success: false,
                error: error.noCards,
            };
        } else if (sideCells.length > 1) {
            return {
                success: false,
                error: error.multipleCards,
            };
        }

        return {
            success: true,
            sideCell: sideCells[0],
        };
    }

    static verifyCardConnections(cells: any, cellIndex: any): any {
        const sideCells = this.getSideCells(cells, cellIndex);

        const error = 'A carta adjacente deve ser uma ponta';

        if (sideCells.length > 1) {
            return {
                success: false,
                error: error,
            };
        }

        return {
            success: true,
        };
    }

    static verifyPolymorphismMatch(
        topClassName: any,
        bottomClassName: any,
    ): any {
        let bottomClass = baseClasses.find((element: any) => {
            return element.class === bottomClassName;
        });

        while (bottomClass) {
            if (topClassName === bottomClass.class) {
                return true;
            }

            bottomClass = baseClasses.find((element: any) => {
                return element.class === bottomClass.hierarchy;
            });
        }

        return false;
    }

    static verifyCardMatch(currentCard: any, zIndex: any, sideCell: any): any {
        const error = (topSideVar: any, topSideClass: any, bottomCard: any) => {
            const noAttributeMessage =
                'Não existe atributo nesse lado da carta!';

            if (topSideVar === '' || topSideClass == '') {
                return noAttributeMessage;
            }

            const topMessage = `O atributo "${topSideVar}", do tipo "${topSideClass}"`;
            const bottomMessage = `"${bottomCard.object}", do tipo "${bottomCard.class}"`;

            return `${topMessage}, não é compatível com a carta ${bottomMessage}`;
        };

        const currentCell = { ...currentCard };
        currentCell.card = baseObjects[currentCell.id];

        let topCell: any = null;
        let bottomCell: any = null;
        let cellRelativePosition: any = 0;

        if (zIndex < sideCell.zIndex) {
            topCell = sideCell;
            bottomCell = currentCell;

            // Transforms (Top <-> Bottom) & (Left <-> Right)
            cellRelativePosition = (sideCell.side + 2) % 4;
        } else {
            topCell = currentCell;
            bottomCell = sideCell;

            cellRelativePosition = sideCell.side;
        }

        const topCellClass = baseClasses.find((element: any) => {
            return element.class === topCell.card.class;
        });

        const topCardAttributeSide =
            (4 + cellRelativePosition - topCell.rotation) % 4;

        let topCardSideVar = '';
        let topCardSideClass = '';

        switch (topCardAttributeSide) {
            case CARD_SIDES.TOP:
                topCardSideVar = topCellClass.topVar;
                topCardSideClass = topCellClass.topClass;
                break;

            case CARD_SIDES.BOTTOM:
                topCardSideVar = topCellClass.bottomVar;
                topCardSideClass = topCellClass.bottomClass;
                break;

            case CARD_SIDES.LEFT:
                topCardSideVar = topCellClass.leftVar;
                topCardSideClass = topCellClass.leftClass;
                break;

            case CARD_SIDES.RIGHT:
                topCardSideVar = topCellClass.rightVar;
                topCardSideClass = topCellClass.rightClass;
                break;

            default:
                console.error(
                    `Attribute side not existent: ${topCardAttributeSide}`,
                );
                break;
        }

        // console.log(topCardSideClass);
        // console.log(bottomCell.card);

        if (
            !this.verifyPolymorphismMatch(
                topCardSideClass,
                bottomCell.card.class,
            )
        ) {
            return {
                success: false,
                error: error(topCardSideVar, topCardSideClass, bottomCell.card),
            };
        }

        return { success: true };
    }
}
