const sel_from = document.getElementById("from");
const sel_to = document.getElementById("to");
const inp_text = document.getElementById("inp_text");
const text_area_of_output = document.getElementById("text_area_of_output");
const main_submit_btn = document.getElementById("main_submit_btn");
const menu_icon = document.getElementById("menu_icon");
const side_nav = document.querySelector(".side_nav");
const inp_speaker_div = document.querySelector("#inp_speaker_div");
let side_nav_flag = false;
menu_icon.addEventListener("click", () => {
    console.log(side_nav_flag);
    if (!side_nav_flag) {
        side_nav.style.left = 0;
        side_nav_flag = true;
    } else {
        side_nav.style.left = "-20vw";
        side_nav_flag = false;
    }
});
let from_value = null;
let to_value = null;
main_submit_btn.addEventListener("click", async (e) => {
    from_value = sel_from.value;
    to_value = sel_to.value;
    // console.log(
    //     `/input/from/${from_value}/to/${to_value}/text/${inp_text.value}`
    // );
    try {
        fetch(`/input/from/${from_value}/to/${to_value}/text/${inp_text.value}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Received JSON data:", data);
                len = data.length;
                console.log(len);
                let last_add = null;
                text_area_of_output.value = "";
                if (len != 1) {
                    data.forEach((ele, idx, arr) => {
                        // console.log(text_area_of_output.value);
                        if (idx + 1 <= len - 1) {
                            if (
                                ele[0] == arr[idx + 1][0] &&
                                ele[1] == arr[idx + 1][1]
                            ) {
                                text_area_of_output.value += ele;
                                last_add = ele;
                                console.log(last_add, "before");
                            } else if (idx == 0 || last_add == null) {
                                {
                                    text_area_of_output.value += ele;
                                    last_add = ele;
                                    console.log(last_add, "before");
                                }
                            }
                        } else if (idx == len - 1 && last_add != null) {
                            console.log(last_add, "after");
                            if (
                                ele[0] != last_add[0] &&
                                ele[1] != last_add[1]
                            ) {
                                text_area_of_output.value += ele;
                                last_add = ele;
                            }
                        } else {
                            text_area_of_output.value += ele;
                        }
                    });
                } else {
                    originalString = data[0];
                    const splitString = originalString.split(
                        "Can't load full resultsTry againRetrying..."
                    );
                    text_area_of_output.value += splitString[0];
                }
                // console.log(typeof );
            })
            .catch((error) => {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            });
    } catch (error) {
        console.log(error);
    }
});

// =============================================================================
const btn = document.getElementById("audio_icon_btn");
const txtarea = document.getElementById("inp_text");
window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new window.SpeechRecognition();
let msg_container = "";

let recognizing = false;

function toggleRecognition() {
    if (!recognizing) {
        recognition.start();
        btn.innerHTML = `<i class="ri-mic-fill"></i>`;
        btn.style.backgroundColor = `#cc0000`;
        btn.style.color = `#fff`;
        recognizing = true;
    } else {
        recognition.stop();
        btn.innerHTML = `<i class="ri-mic-line"></i>`;
        btn.style.color = `#000`;
        btn.style.backgroundColor = `#fff`;
        recognizing = false;
    }
}

btn.addEventListener("click", toggleRecognition);

recognition.onresult = (event) => {
    document.querySelector("#inp_speaker_div").style.display = "block";
    const last = event.results.length - 1;
    const message = event.results[last][0].transcript;
    msg_container += " " + message;
    txtarea.innerText = msg_container;
};

recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
    // Handle the error, display a message to the user, or take appropriate action
};

recognition.onend = () => {
    if (recognizing) {
        recognition.start();
    }
};

// Function to save the last recognized message to storage
function save_last_message() {
    // Implement saving the last message to local storage or a database
}

// You can call save_last_message() to store the last message when needed

const voice_lang = document.getElementById("main_lang");
const Region = document.getElementById("lang_Region");

const leftCodeLanguage = {
    ar: "Arabic",
    bn: "Bangla",
    cs: "Czech",
    da: "Danish",
    de: "German",
    el: "Greek",
    en: "English",
    es: "Spanish",
    fi: "Finnish",
    fr: "French",
    he: "Hebrew",
    hi: "Hindi",
    hu: "Hungarian",
    id: "Indonesian",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    nl: "Dutch",
    no: "Norwegian",
    pl: "Polish",
    pt: "Portuguese",
    ro: "Romanian",
    ru: "Russian",
    sk: "Slovak",
    sv: "Swedish",
    ta: "Tamil",
    th: "Thai",
    tr: "Turkish",
    zh: "Chinese",
};

const RightCodeRegion = {
    "Saudi Arabia": "SA",
    Bangladesh: "BD",
    India: "IN",
    "Czech Republic": "CZ",
    Denmark: "DK",
    Austria: "AT",
    Switzerland: "CH",
    Germany: "DE",
    Greece: "GR",
    Australia: "AU",
    Canada: "CA",
    "United Kingdom": "GB",
    Ireland: "IE",
    Finland: "FI",
    Belgium: "BE",
    Israel: "IL",
    Hungary: "HU",
    Indonesia: "ID",
    Italy: "IT",
    Japan: "JP",
    "Republic of Korea": "KR",
    Netherlands: "NL",
    Norway: "NO",
    Poland: "PL",
    Brazil: "BR",
    Portugal: "PT",
    Romania: "RO",
    "Russian Federation": "RU",
    Slovakia: "SK",
    Sweden: "SE",
    "Sri Lanka": "LK",
    Thailand: "TH",
    Turkey: "TR",
    China: "CN",
    "Hong Kong": "HK",
    Taiwan: "TW",
};

// // Example: Retrieving region for a specific right code, e.g., 'DE'
// console.log(rightCodeRegion['DE']);

const languageRegions = {
    Arabic: ["Saudi Arabia"],
    Bangla: ["Bangladesh", "India"],
    Czech: ["Czech Republic"],
    Danish: ["Denmark"],
    German: ["Germany", "Austria", "Switzerland"],
    Greek: ["Greece"],
    English: [
        "United States",
        "Australia",
        "Canada",
        "United Kingdom",
        "Ireland",
        "New Zealand",
        "South Africa",
        "India",
    ],
    Spanish: [
        "Spain",
        "Argentina",
        "Chile",
        "Columbia",
        "Mexico",
        "United States",
    ],
    Finnish: ["Finland"],
    French: ["France", "Belgium", "Canada", "Switzerland"],
    Hebrew: ["Israel"],
    Hindi: ["India"],
    Hungarian: ["Hungary"],
    Indonesian: ["Indonesia"],
    Italian: ["Italy", "Switzerland"],
    Japanese: ["Japan"],
    Korean: ["Republic of Korea"],
    Dutch: ["Belgium", "The Netherlands"],
    Norwegian: ["Norway"],
    Polish: ["Poland"],
    Portuguese: ["Portugal", "Brazil"],
    Romanian: ["Romania"],
    Russian: ["Russian Federation"],
    Slovak: ["Slovakia"],
    Swedish: ["Sweden"],
    Tamil: ["India", "Sri Lanka"],
    Thai: ["Thailand"],
    Turkish: ["Turkey"],
    Chinese: ["China", "Hong Kong", "Taiwan"],
};

// Example: Retrieving regions for a specific language, e.g., English
// console.log(languageRegions["English"]);

var options = "";
for (const key in leftCodeLanguage) {
    options += `<option value="${key}" lang_name="${leftCodeLanguage[key]}" >${leftCodeLanguage[key]}</option>`;
}

voice_lang.innerHTML = options;

const events = new Event("change");
Region.dispatchEvent(events);
// voice_lang.dispatchEvent(events);
voice_lang.addEventListener("change", () => {
    options = "";
    const selectedOption = voice_lang.options[voice_lang.selectedIndex];
    const langName = selectedOption.getAttribute("lang_name");
    const lists = languageRegions[langName];
    lists.forEach((e, idx) => {
        if (idx == 0) {
            options += `<option value="${RightCodeRegion[e]}" selected>${e}</option>`;
        }
        options += `<option value="${RightCodeRegion[e]}">${e}</option>`;
    });
    Region.innerHTML = options;

    // console.log(Region.value, voice_lang.value, "line290");
});

Region.addEventListener("change", () => {
    setRecognitionLanguage(`${voice_lang.value}-${Region.value}`);
});

function setRecognitionLanguage(languageCode) {
    console.log("changing to ", languageCode);
    recognition.lang = languageCode;
}

// ============================================================================

inp_speaker_div.addEventListener("click", () => {
    const textToRead = inp_text.value;
    if (textToRead !== "") {
        const speech = new SpeechSynthesisUtterance();
        speech.text = textToRead;
        speech.lang = recognition.lang;
        window.speechSynthesis.speak(speech);
    } else {
        console.log("The text area is empty.");
    }
});
