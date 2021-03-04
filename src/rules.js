import { CARD_SIDES, getSideIndexes } from "./utils";

import { baseClasses } from "./data/base-classes";
import { baseObjects } from "./data/base-objects";

const Rules = {
  validateMove: (G, ctx, cellIndex, zIndex, card) => {
    if (!Rules.verifyCardsCombination(G, cellIndex, card)) {
      return false;
    }

    return true;
  },
  // TODO: Rename
  verifyCardsCombination: (G, cellIndex, currentCard) => {
    const { cells } = G;

    // id, rotation, zIndex, card, side
    const currentCell = currentCard;
    currentCell.card = baseObjects[currentCell.id];

    const sideCells = [];
    const sideIndexes = getSideIndexes(cellIndex);

    sideIndexes.forEach(({ position, side }, _) => {
      const cell = cells[position];
      if (cell !== null) {
        cell.card = baseObjects[cell.id];
        cell.side = side;
        sideCells.push(cell);
      }
    });

    let topCell = null;
    let bottomCell = null;
    let cellRelativePosition = 0;

    console.log(currentCell.zIndex);

    for (const index in sideCells) {
      const sideCell = sideCells[index];

      if (currentCell.zIndex < sideCell.zIndex) {
        topCell = sideCell;
        bottomCell = currentCell;

        // Transforms (Top <-> Bottom) & (Left <-> Right)
        cellRelativePosition = (sideCell.side + 2) % 4;
      } else {
        topCell = currentCell;
        bottomCell = sideCell;

        cellRelativePosition = sideCell.side;
      }

      const topCellClass = baseClasses.find((element) => {
        return element.class === topCell.card.class;
      });

      const topCardAttributeSide =
        Math.abs(cellRelativePosition - topCell.rotation) % 4;

      let topCardSideClass = "";

      switch (topCardAttributeSide) {
        case CARD_SIDES.TOP:
          topCardSideClass = topCellClass.topClass;

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

      console.log(`Top: ${topCardSideClass}\nBottom: ${bottomCell.card.class}`);

      if (topCardSideClass !== bottomCell.card.class) {
        return false;
      }
    }

    return true;
  },
};

export default Rules;
