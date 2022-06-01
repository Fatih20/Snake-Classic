import { readable, writable } from "svelte/store";
import { blankSavedGame, cellCoordinate, direction, ISavedGameInfo, ISavedGameProperty } from "./utilities/types";
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

function createSavedGame () {
    const candidateSavedGame = fetchItemFromLocalStorage("savedGame");
    const {subscribe, set, update} = writable(candidateSavedGame as ISavedGameInfo ?? blankSavedGame);

    // function updateAndSave (propertyName : ISavedGameProperty, newValue : cellCoordinate[]| direction | number) {
    //     switch ()
    // }

    function updateFruitPosition (newValue : cellCoordinate[]) {
        update(previousSavedGame => {
            let newSavedGame = previousSavedGame;
            newSavedGame.fruitPositionList = newValue;
            localStorage.setItem("savedGame", JSON.stringify(newSavedGame));
            return newSavedGame;
        })
    }

    function updateWholeSnakeCoordinate (newValue : cellCoordinate[]) {
        update(previousSavedGame => {
            let newSavedGame = previousSavedGame;
            newSavedGame.wholeSnakeCoordinateList = newValue;
            localStorage.setItem("savedGame", JSON.stringify(newSavedGame));
            return newSavedGame;
        })  
    }

    function updateDirection (newValue : direction) {
        update(previousSavedGame => {
            let newSavedGame = previousSavedGame;
            newSavedGame.direction = newValue;
            localStorage.setItem("savedGame", JSON.stringify(newSavedGame));
            return newSavedGame;
        })
    }

    function updateScore (newValue : number) {
        update(previousSavedGame => {
            let newSavedGame = previousSavedGame;
            newSavedGame.score = newValue;
            localStorage.setItem("savedGame", JSON.stringify(newSavedGame));
            return newSavedGame;
        })
    }

    function updateFruitEaten (newValue : number) {
        update(previousSavedGame => {
            let newSavedGame = previousSavedGame;
            newSavedGame.fruitEaten = newValue;
            localStorage.setItem("savedGame", JSON.stringify(newSavedGame));
            return newSavedGame;
        })
    }

    function reset () {
        set(undefined);
        localStorage.removeItem("savedGame");
    }

    return {
        subscribe,
        updateScore,
        updateDirection,
        updateFruitEaten,
        updateFruitPosition,
        updateWholeSnakeCoordinate,
        reset
    }
}

export const savedGame = createSavedGame();

export const savedWholeSnakeCoordinateList = createWholeSnakeCoordinateList();
export const savedFruitPositionList = createFruitPositionList();
export const savedDirection = createDirection();
export const savedScore = createScore();
export const savedFruitEaten = createFruitEaten();