import { getSideIndexes } from '../src/utils';
import { Rules } from '../src/rules/RulesExporter';

export function retrieveAllPossibleMoves(
  cells,
  cards,
  sideCards,
  zIndex,
) {
  const possibleMoves = [];

  for (const card of cards) {
    for (
      let sideCardIndex = 0;
      sideCardIndex < sideCards.length;
      sideCardIndex++
    ) {
      const sideCard = sideCards[sideCardIndex];
      possibleMoves.push(
        ...retrieveCardPossibleMoves(
          cells,
          card,
          sideCard,
          sideCardIndex,
          zIndex,
        ),
      );
    }
  }

  return possibleMoves;
}

function retrieveCardPossibleMoves(
  cells,
  card,
  sideCard,
  sideCardIndex,
  zIndex,
) {
  const possibleMoves = [];

  for (const cell of getSideIndexes(sideCard)) {
    possibleMoves.push(
      ...retrieveCardPossibleMoveRotations(
        cells,
        cell,
        zIndex,
        card,
        sideCardIndex,
      ),
    );

    possibleMoves.push(
      ...retrieveCardPossibleMoveRotations(
        cells,
        cell,
        -zIndex,
        card,
        sideCardIndex,
      ),
    );
  }

  return possibleMoves;
}

function retrieveCardPossibleMoveRotations(
  cells,
  cell,
  zIndex,
  card,
  sideCardIndex,
) {
  const possibleMoves = [];

  for (let rotation = 1; rotation <= 4; rotation++) {
    const simulatedCard = { ...card, rotation };
    const result = Rules.validateMove(
      cells,
      cell.position,
      zIndex,
      simulatedCard,
    );

    if (result.success == true) {
      possibleMoves.push({
        card: simulatedCard,
        cardId: simulatedCard.id,
        rotation,
        zIndex,
        cellIndex: cell.position,
        sideCardIndex,
      });
    }
  }

  return possibleMoves;
}
