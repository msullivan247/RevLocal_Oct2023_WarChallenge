import React, { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import { Card, Rank, Suit } from "../model/Card";
import { Button, Typography } from "@mui/material";
import { FlipResult, GameState } from "../model/GameState";

export const Game = () => {
    const [gameState, setGameState] = useState({
        deckA: [],
        flippedA: null,
        deckB: [],
        flippedB: null,
        pot: [],
        flipResult: null,
        gameResult: null
    } as GameState);

    useEffect(() => {
        dealCards(setGameState);
    }, []);

    return (
        <Stack direction="row" width="100%" height="100%" justifyContent="space-around">
            <Stack direction="column">
                {gameState.deckA.map((card, index) => <CardName key={index} card={card} />)}
            </Stack>
            <Stack direction="column" minWidth="15rem" spacing="1rem">
                {gameState.gameResult === null &&
                    <Typography>{gameState.flippedA ? `Player A flipped: ${getCardName(gameState.flippedA as Card)}` : null}</Typography>
                }
                {gameState.gameResult === null &&
                    <Typography>{gameState.flippedA ? `Player B flipped: ${getCardName(gameState.flippedB as Card)}` : null}</Typography>
                }
                <Typography>{gameState.gameResult || gameState.flipResult}</Typography>
                {gameState.gameResult === null && 
                    <Button variant="contained" onClick={() => flip(gameState, setGameState)}>Flip</Button>
                }
                <Button variant="contained" onClick={() => dealCards(setGameState)}>Deal Again</Button>
            </Stack>
            <Stack direction="column">
                {gameState.deckB.map((card, index) => <CardName key={index} card={card} />)}
            </Stack>
        </Stack>
    );
};

const CardName: React.FC<{ card: Card; }> = ({card}) => <Typography variant="body1">{getCardName(card)}</Typography>;

const getCardName = (card: Card): string => `${Object.keys(Rank)[parseInt(card.rank) - 2]} of ${card.suit}`;

const flip = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>): void => {
    let nextState = {...gameState};

    if (nextState.flipResult === FlipResult.tie) {
        if (nextState.deckA.length < 4) {
            nextState.gameResult = FlipResult.playerB;
        } else if (nextState.deckB.length < 4) {
            nextState.gameResult = FlipResult.playerA;
        } else {
            nextState.pot.push(...nextState.deckA.splice(0, 3), ...nextState.deckB.splice(0, 3));
        }
    }

    if (!nextState.deckA.length) {
        nextState.gameResult = FlipResult.playerB;
    } else if (!nextState.deckB.length) {
        nextState.gameResult = FlipResult.playerA;
    }

    if (nextState.gameResult) {
        setGameState(nextState);
        return;
    }

    nextState.flippedA = nextState.deckA.splice(0, 1)[0];
    nextState.flippedB = nextState.deckB.splice(0, 1)[0];
    if (nextState.flippedA.rank === nextState.flippedB.rank) {
        nextState.flipResult = FlipResult.tie;
        nextState.pot.push(nextState.flippedA, nextState.flippedB);
    } else if (parseInt(nextState.flippedA.rank) > parseInt(nextState.flippedB.rank)) {
        nextState.flipResult = FlipResult.playerA;
        nextState.deckA.push(...randomizeWonCards(nextState));
        nextState.pot = [];
    } else {
        nextState.flipResult = FlipResult.playerB;
        nextState.deckB.push(...randomizeWonCards(nextState));
        nextState.pot = [];
    }

    setGameState(nextState);
}

const randomizeWonCards = (gameState: GameState): Card[] => {
    let wonCards: Card[] = [...gameState.pot, gameState.flippedA as Card, gameState.flippedB as Card];
    return wonCards.sort(() => Math.random() - 0.5);
};

const dealCards = (setGameState: React.Dispatch<React.SetStateAction<GameState>>): void => {
    let fullDeck: Card[] = [];
    let deckA: Card[] = [];
    let deckB: Card[] = [];
    Object.values(Suit).forEach(suit => {
        Object.values(Rank).forEach(rank => {
            fullDeck.push({ suit, rank: rank as Rank });
        });
    });

    while (fullDeck.length) {
        deckA.push(pullRandomCard(fullDeck));
        deckB.push(pullRandomCard(fullDeck));
    }

    setGameState({
        deckA,
        flippedA: null,
        deckB,
        flippedB: null,
        pot: [],
        flipResult: null,
        gameResult: null
    });
};

const pullRandomCard = (deck: Card[]): Card => {
    const index = Math.floor(Math.random() * deck.length);
    return deck.splice(index, 1)[0];
}