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
    return {
        subscribe,
        updateAndSave
    }
}

function createDirection () {
    const candidateWholeSnakeCoordinateList = fetchItemFromLocalStorage("direction")
    const {subscribe, set} = writable(candidateWholeSnakeCoordinateList as direction ?? undefined);

    function updateAndSave (newValue : direction) {
        set(newValue);
        localStorage.setItem("direction", JSON.stringify(newValue))
    }
    return {
        subscribe,
        updateAndSave
    }
}

export const savedWholeSnakeCoordinateList = createWholeSnakeCoordinateList();
export const savedDirection = createDirection();