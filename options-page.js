import { loadCss, loadTags, loadWhitelist, resetCss, saveCss, saveTags, saveWhitelist } from "./options.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

async function save(e) {
    e.preventDefault();

    await saveWhitelist(document.forms.optionsForm.whitelist.value);
    await saveCss(document.forms.optionsForm.css.value);
    await saveTags(document.forms.optionsForm.tags.value);

    // show a success msg
    var successEl = document.createElement("span");
    successEl.style.color = "green";
    successEl.style.fontWeight = "bold";
    successEl.style.marginLeft = "10px";
    successEl.innerHTML = "✓ All settings have been saved.";
    e.target.after(successEl);

    setTimeout(function() {
        successEl.remove();
    }, 2000);
}

async function load() {
    document.forms.optionsForm.whitelist.value = await loadWhitelist();
    document.forms.optionsForm.css.value = await loadCss();
    document.forms.optionsForm.tags.value = await loadTags();
}

async function confirmAndResetCss(e) {
    e.preventDefault();
    if (confirm("If you have customized your CSS, your changes will be lost.\n\nAre you sure you want to reset the CSS?")) {
        await resetCss();
        await load();
    }
}

$$("button.save").forEach(btn => btn.addEventListener("click", save));
$("button.resetCss").addEventListener("click", confirmAndResetCss);
await load();