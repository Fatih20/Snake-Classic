import { cellCoordinate, direction, makePossibleCoordinate } from "./types";
import { gridSize } from "../config";
import { possibleDirection } from "./types";

function randomizeFrom1ToN (N : number) {
    return Math.floor(Math.random() * N) + 1
}

export function randomCoordinate () {
    return {x : makePossibleCoordinate(randomizeFrom1ToN(gridSize)), y : makePossibleCoordinate(randomizeFrom1ToN(gridSize))} as cellCoordinate;
}

export function randomDirection () {
    return possibleDirection[(randomizeFrom1ToN(4)-1)] as direction;
}