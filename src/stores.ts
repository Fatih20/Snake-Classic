import { readable, writable } from "svelte/store";
import type { cellCoordinate, direction } from "./utilities/types";
import { fetchItemFromLocalStorage } from "./utilities/utilities";

function createHighScore () {
    const candidateHighScore = fetchItemFromLocalStorage("highScore");
    const {subscribe, set} = writable(candidateHighScore ?? 0);

    function updateAndSave (newValue : number) {
        set(newValue);
        localStorage.setItem("highScore", JSON.stringify(newValue))
    }
    return {
        subscribe,
        updateAndSave
    }
}

export const gameIsPaused = writable(false);

export const highScore = createHighScore();

export const deviceWidth = readable(screen.width);

export const gameIsOver = writable(false);

function createWholeSnakeCoordinateList () {
    const candidateWholeSnakeCoordinateList = fetchItemFromLocalStorage("wholeSnakeList")
    const {subscribe, set} = writable(candidateWholeSnakeCoordinateList as cellCoordinate[] ?? undefined);

    function updateAndSave (newValue : cellCoordinate[]) {
        set(newValue);
        localStorage.setItem("wholeSnakeList", JSON.stringify(newValue))
    }

    function reset () {
        set(undefined);
        localStorage.removeItem("wholeSnakeList");
    }
    return {
        subscribe,
        updateAndSave,
        reset
    }
}

function createDirection () {
    const candidateWholeSnakeCoordinateList = fetchItemFromLocalStorage("direction")
    const {subscribe, set} = writable(candidateWholeSnakeCoordinateList as direction ?? undefined);

    function updateAndSave (newValue : direction) {
        set(newValue);
        localStorage.setItem("direction", JSON.stringify(newValue))
    }

    function reset () {
        set(undefined);
        localStorage.removeItem("wholeSnakeList");
    }

    return {
        subscribe,
        updateAndSave,
        reset
    }
}

function createFruitPositionList () {
    const candidateFruitPosition = fetchItemFromLocalStorage("fruitPosition")
    const {subscribe, set} = writable(candidateFruitPosition as cellCoordinate[] ?? undefined);

    function updateAndSave (newValue : cellCoordinate[]) {
        set(newValue);
        localStorage.setItem("fruitPosition", JSON.stringify(newValue))
    }

    function reset () {
        set(undefined);
        localStorage.removeItem("fruitPosition");
    }

    return {
        subscribe,
        updateAndSave,
        reset
    }
}

function createScore () {
    const candidateScore = fetchItemFromLocalStorage("score");
    const {subscribe, set} = writable(candidateScore ?? 0);

    function updateAndSave (newValue : number) {
        set(newValue);
        localStorage.setItem("score", JSON.stringify(newValue))
    }

    function reset () {
        set(undefined);
        localStorage.removeItem("score");
    }

    return {
        subscribe,
        updateAndSave,
        reset
    }
}

function createFruitEaten () {
    const candidateFruitEaten = fetchItemFromLocalStorage("fruitEaten");
    const {subscribe, set} = writable(candidateFruitEaten ?? 0);

    function updateAndSave (newValue : number) {
        set(newValue);
        localStorage.setItem("fruitEaten", JSON.stringify(newValue))
    }

    function reset () {
        set(undefined);
        localStorage.removeItem("FruitEaten");
    }

    return {
        subscribe,
        updateAndSave,
        reset
    }
}

export const savedScore = createScore();
export const savedFruitEaten = createFruitEaten();

export const savedWholeSnakeCoordinateList = createWholeSnakeCoordinateList();
export const savedDirection = createDirection();
export const savedFruitPositionList = createFruitPositionList();