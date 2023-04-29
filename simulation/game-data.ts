import { ResultData } from './persistance-data';

export type MoveData = {
    card: any;
    cardId: number;
    rotation: number;
    zIndex: number;
    cellIndex: number;
    sideCardIndex: number;
};

export type GameResult = ResultData & {
    finished: boolean;
    message?: string;
};
