$(document).ready(function () {

    $("input[type=button]").button();

    $("input[Value=Save]").click(function(e) {
        save(e);
    });

    load();
});

function save(e) {
    options.saveWhitelist($("#whitelist").val());
    options.saveCss($("#css").val());
    options.saveTags($("input:radio[name=tags]:checked").val());

    // show a success msg
    var $success = $("<span/>")
        .css("color", "green")
        .css("font-weight", "bold")
        .html("All settings have been saved.")
        .insertAfter($(e.target));

    setTimeout(function() {
        $success.fadeOut(1000);
    }, 1000);
}

function load() {

    $("#whitelist").val(options.loadWhitelist());
    $("#css").val(options.loadCss());
    $("input[name='tags']")
        .filter("[value=" + options.loadTags() + "]")
        .attr("checked", "checked");
}

function resetCss() {
    if (confirm("If you have customized your CSS, your changes will be lost.\n\nAre you sure you want to reset the CSS?")) {
        options.resetCss();
        load();
        $("#css").effect("highlight", {}, 1000);
    }
}
