import { PersistanceCsv } from './persistance-csv';
import {
    MatchData,
    TurnData,
    ResultData,
    CombinedData,
} from './persistance-data';

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

    static printCsv(key: string): void {
        PersistanceCsv.generateCsvFromData(this.allData[key]);
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
