export type MatchData = {
    seed: string;
};

export type TurnData = {
    playerId: string;
    playerType: string;

    played: boolean;
    pickedCard: boolean;

    playedCardId?: number;
    playedCellIndex?: number;
    playedRotation?: number;
    playedZIndex?: number;

    possiblePlaysAmount: number;
    cardsInHandAmount?: number;
};

export type ResultData = {
    draw?: boolean;
    winner?: string;
};

export type CombinedData = {
    match: MatchData;
    turns: TurnData[];
    result: ResultData;
};
