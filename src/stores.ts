import { readable, writable } from "svelte/store";
import { blankSavedGame, cellCoordinate, direction, ISavedGameInfo, ISavedGameProperty, possibleGameStateType } from "./utilities/types";
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

function createSavedGame () {
    const candidateSavedGame = fetchItemFromLocalStorage("savedGame");
    const {subscribe, set, update} = writable((candidateSavedGame === undefined || candidateSavedGame === null) ? blankSavedGame : candidateSavedGame);

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
        set(blankSavedGame);;
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
export const gameState = writable("startPage" as possibleGameStateType);

export const isLoggedIn = writable(false);