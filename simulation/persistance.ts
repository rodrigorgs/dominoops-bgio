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
};

export type ResultData = {
    draw: boolean;
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

        data = { ...data, turns: [...oldTurnData, turnData] };

        this.setDataTo(key, data);
    }

    static saveResultData(
        key: string,
        winner: string = '',
        draw: boolean = false,
    ): void {}

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
