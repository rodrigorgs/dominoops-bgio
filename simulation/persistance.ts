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
        };

        this.setDataTo(key, data);
    }

    static saveResultData(
        key: string,
        winner: string = '',
        draw: boolean = false,
    ): void {
        let data = this.getDataFrom(key);

        data = {
            ...data,
            result: {
                draw,
                winner,
            },
        };
        this.setDataTo(key, data);
    }

    static printSingleCsv(): void {
        PersistanceCsv.generateSingleCsv(Object.values(this.allData));
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
