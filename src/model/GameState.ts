import { Card } from "./Card";

export interface GameState {
    readonly deckA: Card[];
    readonly flippedA: Card | null;
    readonly deckB: Card[];
    readonly flippedB: Card | null;
    readonly pot: Card[];
    readonly flipResult: FlipResult | null;
    readonly gameResult: FlipResult | null;
}

export enum FlipResult {
    playerA = "Player A Wins!",
    playerB = "Player B Wins!",
    tie = "Tie! This means WAR!"
}