/**
 *  MIT License
 *
 *  Copyright (c) 2017 Jewel Mahanta
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
/*global chrome*/
import $ from "../lib/jquery-3.2.0.min";
import * as animeUtils from "./animeUtils";

// This content script handles global functionality like pins etc
// TODO: maybe add some animation to the anime item to indicate add success?
(function () {
    console.info("%c 9anime Companion loaded successfully", "color: orange; font-weight: bold;");

    animeUtils
        .loadSettings(["pinIconToggle", "adsToggle", "shareBarToggle"])
        .then(function (settings) {

            /**********************************************************************************************************/
            if (settings["pinIconToggle"]) {
                var animeItems = $(".list-film .item");

                // Web Accessible Resource URL's
                var pinImage = chrome.extension.getURL("assets/images/pin.png");

                // This portion deals with adding the pin to all
                // the anime items present in a page. The pin is
                // attached onto the bottom-left corner of the anime
                // cover image.
                $(animeItems)
                    .each(function (key, item) {
                        $(item).append(`<div class='pin_anime'><img src='${pinImage}'></div>`);
                    })
                    .promise()
                    .done(function () {

                        $(".pin_anime").on("click", function () {
                            var animeName = $(this).parent().find(".name").text();
                            var animeUrl = $(this).parent().find(".name").prop("href");

                            animeUtils
                                .addToPinnedList(animeName, animeUrl)
                                // .then(function (response) {
                                //     console.log(response);
                                // })
                                .catch(function (response) {
                                    console.error(response);
                                });

                        });
                    });
            }

            /**********************************************************************************************************/
            // Ads Locations
            // TODO: add a way to update the ads locations remotely via updates
            var adsLocationFilter = [
                ".a_d"
            ];

            function adsRemover() {
                // Generic Remover
                for (var i = 0; i < adsLocationFilter.length; i++) {
                    $(adsLocationFilter[i]).remove();
                }
            }

            // Ads Removal
            if (settings["adsToggle"]) {
                adsRemover();
            }

            /**********************************************************************************************************/
            // Share Bar Locations
            var shareBarLocationFilter = [
                ".addthis_native_toolbox",
                ".home-socials"
            ];

            function shareBarRemover() {
                for (var i = 0; i < shareBarLocationFilter.length; i++) {
                    $(shareBarLocationFilter[i]).remove();
                }
            }

            // Removes the social network share bar
            if (settings["shareBarToggle"]) {
                shareBarRemover();
            }
        });
    
    /******************************************************************************************************************/
    // Custom CSS Loader
    // CCL = custom css loader

    // Load our html template
    var ccl_template = require("../templates/custom_css_loader.html");

    // Attach the previewer style tag. All the temporary
    // previewing will go here.
    $("head").append(`<style id="_ccl_preview"></style>`);
    $("body")
        .append(`<div id="_ccl_open"></div>`)
        .append(ccl_template);

    $("#_ccl_open").on("click", function () {
        $(this).hide();
        $("#_ccl_widget").css({display: "block"}).addClass("ccl_slideLeft").removeClass("ccl_slideRight");
    });

    $("#_ccl_close").on("click", function () {
        $("#_ccl_open").show();
        $("#_ccl_widget").addClass("ccl_slideRight").removeClass("ccl_slideLeft");
    });
    
    $("#_ccl_preview_custom_css").on("click", function () {
        var customCssText = $("#_ccl_custom_css_text").val();
        console.log(customCssText);

        $("#_ccl_preview").text(customCssText);
    });
    
})();
