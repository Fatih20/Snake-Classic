import { readable, writable } from "svelte/store";
import { fetchHighScoreFromLocalStorage } from "./utilities/utilities";

function createHighScore () {
    const candidateHighScore = fetchHighScoreFromLocalStorage();
    const {subscribe, set, update} = writable((candidateHighScore !== null ? candidateHighScore : 0))

    function updateAndSave (newValue : number) {
        update(oldValue => newValue);
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