export type MatchData = {
    seed: string;
};

export type TurnData = {
    playerId: string;
    playerType: string;

    played: boolean;
    pickedCard: boolean;

    playData?: {
        cardId: number;
        cellIndex: number;
        rotation: number;
        zIndex: number;
    };

    possiblePlaysAmount: number;
    cardsInHandAmount?: number;
};

export type ResultData = {
    leadChangesAmount?: number;

    turnsAmount?: number;
    cardPickAmount?: number;
    cardPlayAmount?: number;

    totalPossiblePlaysAmount?: number;

    draw?: boolean;
    winner?: string;
};

export type CombinedData = {
    match: MatchData;
    turns: TurnData[];
    result: ResultData;
};

export class Persistence {
    static allData: {
        [name: string]: CombinedData;
    } = {};

    static saveMatchData(key: string, matchData: MatchData): void {
        let data = this.getDataFrom(key);
        data = { ...data, match: matchData };
        this.setDataTo(key, data);
    }

    static saveTurnData(key: string, turnData: TurnData): void {
        let data = this.getDataFrom(key);
        let oldTurnData = data.turns || [];

        data = {
            ...data,
            turns: [...oldTurnData, turnData],
            result: this.applyTurnToResultData(key, turnData),
        };

        this.setDataTo(key, data);
    }

    private static applyTurnToResultData(
        key: string,
        turnData: TurnData,
    ): ResultData {
        const data = this.getDataFrom(key);
        const oldResultData: ResultData = data.result || {
            leadChangesAmount: 0,
            turnsAmount: 0,
            cardPickAmount: 0,
            cardPlayAmount: 0,
            totalPossiblePlaysAmount: 0,
        };

        const resultData = {
            ...oldResultData,
            // leadChangesAmount: oldResultData.leadChangesAmount,
            turnsAmount: oldResultData.turnsAmount! + 1,
            cardPickAmount: turnData.pickedCard
                ? oldResultData.cardPickAmount! + 1
                : oldResultData.cardPickAmount!,
            cardPlayAmount: turnData.played
                ? oldResultData.cardPlayAmount! + 1
                : oldResultData.cardPlayAmount!,
            totalPossiblePlaysAmount:
                oldResultData.totalPossiblePlaysAmount! +
                turnData.possiblePlaysAmount!,
        };

        return resultData;
    }

    static saveResultData(
        key: string,
        winner: string = '',
        draw: boolean = false,
    ): void {
        let data = this.getDataFrom(key);
        let oldResultData = data.result;

        data = {
            ...data,
            result: {
                ...oldResultData,
                draw,
                winner,
            },
        };
        this.setDataTo(key, data);
    }

    static print(key: string): void {
        console.log(this.allData[key].match);
        console.log(this.allData[key].turns);
        console.log(this.allData[key].result);
    }

    private static getDataFrom(key: string): CombinedData {
        return this.allData[key];
    }

    private static setDataTo(key: string, newData: CombinedData): void {
        this.allData[key] = newData;
    }
}
