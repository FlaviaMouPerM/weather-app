import { getLatAndLong } from "./script.js";
import { localization } from "./script.js";


const form = document.querySelector(".form");

form.addEventListener("submit", getLatAndLong);
 localization();
updateWeatherUI();