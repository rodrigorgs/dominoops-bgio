import { constants } from 'crypto';
import { write } from 'fast-csv';
import fs from 'fs';

import {
    MatchData,
    TurnData,
    ResultData,
    CombinedData,
} from './persistance-data';

type CsvReadyData = {
    turn: number;
} & MatchData &
    TurnData &
    ResultData;

export class PersistanceCsv {
    static generateSingleCsv(allCombinedData: CombinedData[]) {
        const filePath = `${__dirname}/csv/test.csv`;
        let csvData: CsvReadyData[] = [];

        for (const combinedData of allCombinedData) {
            csvData = [...csvData, ...this.prepareCsvData(combinedData)];
        }

        this.saveDataAsCsv(filePath, csvData);
    }

    static generateCsvFromData(combinedData: CombinedData) {
        const filePath = `${__dirname}/csv/${combinedData.match.seed}-${combinedData.turns[0].playerType}.csv`;
        const csvData = this.prepareCsvData(combinedData);

        this.saveDataAsCsv(filePath, csvData);
    }

    static prepareCsvData(combinedData: CombinedData): CsvReadyData[] {
        const csvData = [];

        let turn = 1;
        for (const turnData of combinedData.turns) {
            csvData.push({
                turn,
                ...combinedData.match,
                ...turnData,
                ...combinedData.result,
            });

            turn++;
        }

        return csvData;
    }

    private static saveDataAsCsv(filePath: string, csvData: CsvReadyData[]) {
        const stream = fs.createWriteStream(filePath, {
            flags: 'w',
        });

        write(csvData, { headers: true }).pipe(stream);
    }
}
