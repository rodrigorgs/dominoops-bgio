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
    static generateCsvFromData(combinedData: CombinedData) {
        const csvData = this.prepareCsvData(combinedData);
        const filePath = `${__dirname}/csv/${combinedData.match.seed}-${combinedData.turns[0].playerType}.csv`;

        // fs.writeFileSync(filePath, JSON.stringify(csvData));

        const stream = fs.createWriteStream(filePath, {
            flags: 'w',
        });

        write(csvData, { headers: true }).pipe(stream);
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
}
