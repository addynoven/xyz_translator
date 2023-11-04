const { default: axios } = require("axios");
var express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");
var router = express.Router();
const multer = require("multer");
const { File } = require("buffer");
const img_to_text = require("../controller/run_img_text");
arr_obj = {
    af: "Afrikaans",
    sq: "Albanian",
    am: "Amharic",
    ar: "Arabic",
    hy: "Armenian",
    as: "Assamese",
    ay: "Aymara",
    az: "Azerbaijani",
    bm: "Bambara",
    eu: "Basque",
    be: "Belarusian",
    bn: "Bengali",
    bho: "Bhojpuri",
    bs: "Bosnian",
    bg: "Bulgarian",
    ca: "Catalan",
    ceb: "Cebuano",
    ny: "Chichewa",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    co: "Corsican",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    dv: "Dhivehi",
    doi: "Dogri",
    nl: "Dutch",
    en: "English",
    eo: "Esperanto",
    et: "Estonian",
    ee: "Ewe",
    tl: "Filipino",
    fi: "Finnish",
    fr: "French",
    fy: "Frisian",
    gl: "Galician",
    ka: "Georgian",
    de: "German",
    el: "Greek",
    gn: "Guarani",
    gu: "Gujarati",
    ht: "Haitian Creole",
    ha: "Hausa",
    haw: "Hawaiian",
    iw: "Hebrew",
    hi: "Hindi",
    hmn: "Hmong",
    hu: "Hungarian",
    is: "Icelandic",
    ig: "Igbo",
    ilo: "Ilocano",
    id: "Indonesian",
    ga: "Irish",
    it: "Italian",
    ja: "Japanese",
    jw: "Javanese",
    kn: "Kannada",
    kk: "Kazakh",
    km: "Khmer",
    rw: "Kinyarwanda",
    gom: "Konkani",
    ko: "Korean",
    kri: "Krio",
    ku: "Kurdish (Kurmanji)",
    ckb: "Kurdish (Sorani)",
    ky: "Kyrgyz",
    lo: "Lao",
    la: "Latin",
    lv: "Latvian",
    ln: "Lingala",
    lt: "Lithuanian",
    lg: "Luganda",
    lb: "Luxembourgish",
    mk: "Macedonian",
    mai: "Maithili",
    mg: "Malagasy",
    ms: "Malay",
    ml: "Malayalam",
    mt: "Maltese",
    mi: "Maori",
    mr: "Marathi",
    "mni-Mtei": "Meiteilon (Manipuri)",
    lus: "Mizo",
    mn: "Mongolian",
    my: "Myanmar (Burmese)",
    ne: "Nepali",
    no: "Norwegian",
    or: "Odia (Oriya)",
    om: "Oromo",
    ps: "Pashto",
    fa: "Persian",
    pl: "Polish",
    pt: "Portuguese",
    pa: "Punjabi",
    qu: "Quechua",
    ro: "Romanian",
    ru: "Russian",
    sm: "Samoan",
    sa: "Sanskrit",
    gd: "Scots Gaelic",
    nso: "Sepedi",
    sr: "Serbian",
    st: "Sesotho",
    sn: "Shona",
    sd: "Sindhi",
    si: "Sinhala",
    sk: "Slovak",
    sl: "Slovenian",
    so: "Somali",
    es: "Spanish",
    su: "Sundanese",
    sw: "Swahili",
    sv: "Swedish",
    tg: "Tajik",
    ta: "Tamil",
    tt: "Tatar",
    te: "Telugu",
    th: "Thai",
    ti: "Tigrinya",
    ts: "Tsonga",
    tr: "Turkish",
    tk: "Turkmen",
    ak: "Twi",
    uk: "Ukrainian",
    ur: "Urdu",
    ug: "Uyghur",
    uz: "Uzbek",
    vi: "Vietnamese",
    cy: "Welsh",
    xh: "Xhosa",
    yi: "Yiddish",
    yo: "Yoruba",
    zu: "Zulu",
};
let key_lists = [],
    value_lists = [];
for (const key in arr_obj) {
    value_lists.push(arr_obj[key]);
}

for (const key in arr_obj) {
    key_lists.push(key);
}

const my_space = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, "./public/images");
    },
    filename: function (req, file, cd) {
        cd(
            null,
            `${fs.readdirSync("./public/images").length}_${file.originalname}`
        );
    },
});

const upload = multer({ storage: my_space });

router.get("/", function (req, res, next) {
    res.render("index", { key: key_lists, value: value_lists });
});

router.get(
    "/input/from/:sl/to/:tl/text/:text_data",
    async function (req, res, next) {
        try {
            let result = [];
            let sl = req.params.sl,
                tl = req.params.tl,
                text_data = req.params.text_data;
            console.log(sl, tl, text_data);
            url = `https://translate.google.com/?sl=${sl}&tl=${tl}&text=${encodeURIComponent(
                text_data
            )}`;
            console.log(url);
            await (async () => {
                const browser = await puppeteer.launch({ headless: "new" });
                const page = await browser.newPage();
                await page.goto(url);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                const content = await page.content();
                console.log("done");
                const $ = cheerio.load(content);
                const targetedSpans = $(`span[lang="${tl}"]`);
                targetedSpans.each((index, element) => {
                    let val = $(element).text();
                    result.push(val);
                });
                console.log(result);
                await browser.close();
                result.splice(0, 1);
                await console.log(result);
                res.json(result);
            })();
        } catch (error) {
            res.json("error line 190");
        }
    }
);

router.get("/img_text", function (req, res, next) {
    res.render("img_text", { key: key_lists, value: value_lists });
});

router.post(
    "/upload/:lang",
    upload.single("imageFile"),
    async function (req, res, next) {
        try {
            const lang = req.params.lang;
            // console.log(lang, "line 221");
            let file_name = `${fs.readdirSync("./public/images").length - 1}_${
                req.file.originalname
            }`;
            // console.log(file_name, "line 225");
            let data = await img_to_text(file_name, lang);
            console.log(data);
            let ans = [data, file_name];
            res.json(ans);
        } catch (error) {
            res.json(`done with error of main index`);
        }
    }
);

// router.post("/input", function (req, res, next) {
//     data = req.body;
//     url = `https://translate.google.com/?sl=${data.sl}&tl=${
//         data.tl
//     }&text=${encodeURIComponent(data.text)}`;
//     (async () => {
//         const browser = await puppeteer.launch({ headless: "new" });
//         const page = await browser.newPage();
//         await page.goto(url);
//         await new Promise((resolve) => setTimeout(resolve, 5000));
//         const content = await page.content();
//         console.log("done");
//         let result = [];
//         const $ = cheerio.load(content);
//         const targetedSpans = $(`span[lang="${data.tl}"]`);
//         targetedSpans.each((index, element) => {
//             let val = $(element).text();
//             result.push(val);
//         });
//         console.log(result);
//         await browser.close();
//     })();
//     res.render("index", { key: key_lists, value: value_lists });
// });

module.exports = router;
