export interface Card {
    readonly suit: Suit;
    readonly rank: Rank;
}

export enum Suit {
    clubs = "♣",
    diamonds = "♦",
    hearts = "♥",
    spades = "♠"
}

export enum Rank {
    two = "2",
    three = "3",
    four = "4",
    five = "5",
    six = "6",
    seven = "7",
    eight = "8",
    nine = "9",
    ten = "10",
    jack = "11",
    queen = "12",
    king = "13",
    ace = "14"
}