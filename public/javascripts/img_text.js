var language_codes = {
    Abaza: "abq",
    Adyghe: "ady",
    Afrikaans: "af",
    Angika: "ang",
    Arabic: "ar",
    Assamese: "as",
    Avar: "ava",
    Azerbaijani: "az",
    Belarusian: "be",
    Bulgarian: "bg",
    Bihari: "bh",
    Bhojpuri: "bho",
    Bengali: "bn",
    Bosnian: "bs",
    "Simplified Chinese": "ch_sim",
    "Traditional Chinese": "ch_tra",
    Chechen: "che",
    Czech: "cs",
    Welsh: "cy",
    Danish: "da",
    Dargwa: "dar",
    German: "de",
    English: "en",
    Spanish: "es",
    Estonian: "et",
    "Persian (Farsi)": "fa",
    French: "fr",
    Irish: "ga",
    "Goan Konkani": "gom",
    Hindi: "hi",
    Croatian: "hr",
    Hungarian: "hu",
    Indonesian: "id",
    Ingush: "inh",
    Icelandic: "is",
    Italian: "it",
    Japanese: "ja",
    Kabardian: "kbd",
    Kannada: "kn",
    Korean: "ko",
    Kurdish: "ku",
    Latin: "la",
    Lak: "lbe",
    Lezghian: "lez",
    Lithuanian: "lt",
    Latvian: "lv",
    Magahi: "mah",
    Maithili: "mai",
    Maori: "mi",
    Mongolian: "mn",
    Marathi: "mr",
    Malay: "ms",
    Maltese: "mt",
    Nepali: "ne",
    Newari: "new",
    Dutch: "nl",
    Norwegian: "no",
    Occitan: "oc",
    Pali: "pi",
    Polish: "pl",
    Portuguese: "pt",
    Romanian: "ro",
    Russian: "ru",
    "Serbian (cyrillic)": "rs_cyrillic",
    "Serbian (latin)": "rs_latin",
    Nagpuri: "sck",
    Slovak: "sk",
    Slovenian: "sl",
    Albanian: "sq",
    Swedish: "sv",
    Swahili: "sw",
    Tamil: "ta",
    Tabassaran: "tab",
    Telugu: "te",
    Thai: "th",
    Tajik: "tjk",
    Tagalog: "tl",
    Turkish: "tr",
    Uyghur: "ug",
    Ukranian: "uk",
    Urdu: "ur",
    Uzbek: "uz",
    Vietnamese: "vi",
};
const select_img = document.querySelector("#img_from");
const select_out_img = document.querySelector("#img_to");
options = "";
for (const key in language_codes) {
    if (String(key) == "English") {
        options += `<option value="${language_codes[key]}" selected>${key}</option>`;
    } else {
        options += `<option value="${language_codes[key]}">${key}</option>`;
    }
}
// select_out_img.innerHTML += options;
select_img.innerHTML += options;

const menu_icon = document.getElementById("menu_icon");
const side_nav = document.querySelector(".side_nav");
// const text_area_of_output = document.querySelector("#text_area_of_output");
let side_nav_flag = false;

const main_right = document.querySelector(".main .right");

let add_btn_ones = false;

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
document.getElementById("uploadButton").addEventListener("click", async () => {
    const files = document.getElementById("fileInput").files;
    if (files.length == 0) {
        alert("Please select an image to upload.");
        return;
    }
    const formData = new FormData();
    formData.append("imageFile", files[0]);
    try {
        const response = await fetch(`/upload/${select_img.value}`, {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            const result = await response.json();
            console.log("Image uploaded successfully:", result);
            console.log(text_area_of_output);
            if (!add_btn_ones) {
                main_right.innerHTML +=
                    '<div class="btn"><button id="Translate">Translate this</button></div>';
                document.querySelector("#img_to").style.marginTop = "9vh";
                add_btn_ones = true;
            }
            document.querySelector("#text_area_of_output").value = result[0];
            document.querySelector(
                "#img_uploaded"
            ).src = `/images/${result[1]}`;
            document.querySelector("#img_uploaded").style.display =
                "inline-block";
            document
                .querySelector("#Translate")
                .addEventListener("click", TranslateCall);
        } else {
            console.error(
                "Failed to upload image:",
                response.status,
                response.statusText
            );
        }
    } catch (error) {
        console.log(error);
    }
});

async function TranslateCall() {
    let from_value = select_img.value,
        to_value = select_out_img.value,
        text_value = document.querySelector("#text_area_of_output").value;
    try {
        fetch(`/input/from/${from_value}/to/${to_value}/text/${text_value}`)
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
                        if (idx + 1 <= len - 1) {
                            if (
                                ele[0] == arr[idx + 1][0] &&
                                ele[1] == arr[idx + 1][1]
                            ) {
                                text_area_of_output.value += ele;
                                last_add = ele;
                                console.log(last_add, "before");
                            } else {
                                {
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
}
