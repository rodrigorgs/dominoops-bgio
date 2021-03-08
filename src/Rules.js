import { CARD_SIDES, getSideIndexes } from './utils';

import { baseClasses } from './data/base-classes';
import { baseObjects } from './data/base-objects';

export const Rules = {
  validateMove: (G, ctx, cellIndex, zIndex, card) => {
    if (!Rules.verifyCardsCombination(G, cellIndex, card, zIndex)) {
      return false;
    }

    return true;
  },
  // TODO: Rename
  verifyCardsCombination: (G, cellIndex, currentCard, zIndex) => {
    const { cells } = G;

    const currentCell = { ...currentCard };
    currentCell.card = baseObjects[currentCell.id];

    const sideCells = [];
    const sideIndexes = getSideIndexes(cellIndex);

    sideIndexes.forEach(({ position, side }, _) => {
      if (cells[position] !== null) {
        const cell = { ...cells[position] };
        cell.card = baseObjects[cell.id];
        cell.side = side;
        sideCells.push(cell);
      }
    });

    let topCell = null;
    let bottomCell = null;
    let cellRelativePosition = 0;

    for (const index in sideCells) {
      const sideCell = sideCells[index];

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
          console.log('top');
          break;

        case CARD_SIDES.BOTTOM:
          topCardSideClass = topCellClass.bottomClass;
          console.log('bot');
          break;

        case CARD_SIDES.LEFT:
          topCardSideClass = topCellClass.leftClass;
          console.log('left');
          break;

        case CARD_SIDES.RIGHT:
          topCardSideClass = topCellClass.rightClass;
          console.log('right');
          break;

        default:
          console.error(`Attribute side not existent: ${topCardAttributeSide}`);
          break;
      }

      if (topCardSideClass !== bottomCell.card.class) {
        return false;
      }
    }

    return true;
  },
};
