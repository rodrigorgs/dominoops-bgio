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
    const error = 'Posição selecionada ocupada!';

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
      multipleCards: 'Mais de uma conexão possível!',
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

    const error = 'Já existe mais de uma conexão na carta adjacente!';

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
    const error = 'Atributo e carta não encaixam!';

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

    let topCardSideClass = '';

    switch (topCardAttributeSide) {
      case CARD_SIDES.TOP:
        topCardSideClass = topCellClass.topClass;
        break;

      case CARD_SIDES.BOTTOM:
        topCardSideClass = topCellClass.bottomClass;
        break;

      case CARD_SIDES.LEFT:
        topCardSideClass = topCellClass.leftClass;
        break;

      case CARD_SIDES.RIGHT:
        topCardSideClass = topCellClass.rightClass;
        break;

      default:
        console.error(`Attribute side not existent: ${topCardAttributeSide}`);
        break;
    }

    if (!Rules.verifyPolymorphismMatch(topCardSideClass, bottomCell.card.class)) {
      return {
        success: false,
        error: error,
      };
    }

    return { success: true };
  },
};
