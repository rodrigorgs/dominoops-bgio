import { CARD_SIDES, getSideIndexes } from './utils';

import { baseClasses } from './data/base-classes';
import { baseObjects } from './data/base-objects';

export const Rules = {
  validateMove: (G, ctx, cellIndex, zIndex, card) => {
    const verifyPositionResult = Rules.verifyPosition(G, cellIndex);
    if (!verifyPositionResult.success) {
      return verifyPositionResult;
    }

    const sideCardsResult = Rules.verifySideCards(G, cellIndex);
    if (!sideCardsResult.success) {
      return {
        success: false,
        error: sideCardsResult.error,
      };
    }

    const CardConnectionsResult = Rules.verifyCardConnections(G, sideCardsResult.sideCell.position);
    if (!CardConnectionsResult.success) {
      return {
        success: false,
        error: CardConnectionsResult.error,
      };
    }

    const verifyCardMatchResult = Rules.verifyCardMatch(card, zIndex, sideCardsResult.sideCell);
    if (!verifyCardMatchResult.success) {
      return verifyCardMatchResult;
    }

    return {
      success: true,
    };
  },

  verifyPosition: (G, cellIndex) => {
    const error = 'Já existe uma carta nessa posição!';

    if (G.cells[cellIndex] !== null) {
      return {
        success: false,
        error: error,
      };
    }

    return {
      success: true,
    };
  },

  getSideCells: (G, cellIndex) => {
    const { cells } = G;

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
  },

  verifySideCards: (G, cellIndex) => {
    const { cells } = G;

    const error = {
      noCards: 'Não existem cartas adjacentes nessa posição!',
      multipleCards: 'Uma carta não pode se conectar a duas ou mais cartas!',
    };

    const sideCells = Rules.getSideCells(G, cellIndex);

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
  },

  verifyCardConnections: (G, cellIndex) => {
    const sideCells = Rules.getSideCells(G, cellIndex);

    const error = 'Você só pode conectar sua carta a uma carta que está uma das pontas (i.e., uma carta conectada a no máximo uma outra carta)';

    if (sideCells.length > 1) {
      return {
        success: false,
        error: error,
      };
    }

    return {
      success: true,
    };
  },

  verifyPolymorphismMatch: (topClassName, bottomClassName) => {
    let bottomClass = baseClasses.find(element => {
      return element.class === bottomClassName;
    });

    while (bottomClass) {
      if (topClassName === bottomClass.class) {
        return true;
      }

      bottomClass = baseClasses.find(element => {
        return element.class === bottomClass.hierarchy;
      });
    }

    return false;
  },

  verifyCardMatch: (currentCard, zIndex, sideCell) => {
    const error = (topSideVar, topSideClass, bottomCard) => {
      const noAttributeMessage = 'Não existe atributo nesse lado da carta!';

      if (topSideVar === '' || topSideClass == '') {
        return noAttributeMessage;
      }

      const topMessage = `O atributo "${topSideVar}", do tipo "${topSideClass}"`;
      const bottomMessage = `"${bottomCard.object}", do tipo "${bottomCard.class}"`;

      return `${topMessage}, não é compatível com a carta ${bottomMessage}`;
    };

    const currentCell = { ...currentCard };
    currentCell.card = baseObjects[currentCell.id];

    let topCell = null;
    let bottomCell = null;
    let cellRelativePosition = 0;

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

    const topCellClass = baseClasses.find(element => {
      return element.class === topCell.card.class;
    });

    const topCardAttributeSide = (4 + cellRelativePosition - topCell.rotation) % 4;

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
        console.error(`Attribute side not existent: ${topCardAttributeSide}`);
        break;
    }

    console.log(topCardSideClass);
    console.log(bottomCell.card);

    if (!Rules.verifyPolymorphismMatch(topCardSideClass, bottomCell.card.class)) {
      return {
        success: false,
        error: error(topCardSideVar, topCardSideClass, bottomCell.card),
      };
    }

    return { success: true };
  },
};
