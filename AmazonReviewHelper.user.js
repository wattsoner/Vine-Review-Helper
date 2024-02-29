// ==UserScript==
// @name         Amazon Review Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Assistant in writing Reviews for amazon, with a custom template inserter and review backups using Discord Webhooks.
// @author       Wattie :3
// @match        https://www.amazon.co.uk/review/create-review*
// @match        https://www.amazon.com/review/create-review*
// @match        https://www.amazon.ca/review/create-review*
// @match        https://www.amazon.fr/review/create-review*
// @match        https://www.amazon.es/review/create-review*
// @match        https://www.amazon.jp/review/create-review*
// @match        https://www.amazon.it/review/create-review*
// @match        https://www.amazon.de/review/create-review*
// @match        https://www.amazon.co.uk/reviews/create-review*
// @match        https://www.amazon.com/reviews/create-review*
// @match        https://www.amazon.ca/reviews/create-review*
// @match        https://www.amazon.fr/reviews/create-review*
// @match        https://www.amazon.es/reviews/create-review*
// @match        https://www.amazon.jp/reviews/create-review*
// @match        https://www.amazon.it/reviews/create-review*
// @match        https://www.amazon.de/reviews/create-review*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .custom-settings-dropdown {
            display: none;
            position: fixed;
            background-color: #f9f9f9;
            min-width: 250px;
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
            padding: 12px 16px;
            z-index: 1000;
            top: 20px; right: 20px;
            border-radius: 5px;
        }

        .custom-settings-dropdown input[type="text"],
        .custom-settings-dropdown textarea,
        .custom-settings-dropdown button {
            width: 100%;
            padding: 8px;
            margin: 4px 0;
            box-sizing: border-box;
        }

        .custom-settings-dropdown-btn, .custom-button {
            cursor: pointer;
            font-size: 16px;
            color: white;
            padding: 8px 15px;
            margin: 5px;
            border-radius: 4px;
            font-weight: bold;
            text-shadow: 0 1px 0 rgba(0,0,0,.2);
        }

        .custom-settings-button {
            background-color: grey !important; /* Grey */
            border: 1px solid grey !important;
        }

        .custom-send-button {
            background-color: #7289DA !important; /* Discord Blue */
            border: 1px solid grey !important;
        }

        .custom-insert-button {
            background-color: #f0c14b !important; /* Submit Review Button Yellow */
            border: 1px solid grey !important;
        }
    `);

    const settingsDropdown = document.createElement("div");
    settingsDropdown.className = "custom-settings-dropdown";

    const predefinedTextArea = document.createElement("textarea");
    predefinedTextArea.placeholder = "Predefined Text";
    predefinedTextArea.value = GM_getValue("predefinedText", "");
    predefinedTextArea.style.height = "80px";
    predefinedTextArea.style.resize = "vertical";

    const discordWebhookInput = document.createElement("input");
    discordWebhookInput.type = "text";
    discordWebhookInput.placeholder = "Discord Webhook URL";
    discordWebhookInput.value = GM_getValue("discordWebhookUrl", "");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.onclick = function() {
        GM_setValue("predefinedText", predefinedTextArea.value);
        GM_setValue("discordWebhookUrl", discordWebhookInput.value);
        settingsDropdown.style.display = "none";
    };

    settingsDropdown.appendChild(predefinedTextArea);
    settingsDropdown.appendChild(discordWebhookInput);
    settingsDropdown.appendChild(saveButton);
    document.body.appendChild(settingsDropdown);

    function addButton(text, onClickFunction, buttonClass) {
        const container = document.querySelector('div[data-hook="ryp-review-text-input"]');
        if (container) {
            const button = document.createElement("button");
            button.innerText = text;
            button.addEventListener("click", onClickFunction);
            button.className = "custom-button custom-" + buttonClass;
            container.parentNode.insertBefore(button, container.nextSibling);
        }
    }

    function addIconButton(icon, onClickFunction) {
        const container = document.querySelector('div[data-hook="ryp-review-text-input"]');
        if (container) {
            const button = document.createElement("button");
            button.innerHTML = icon;
            button.className = "custom-settings-dropdown-btn";
            button.addEventListener("click", onClickFunction);
            container.parentNode.insertBefore(button, container.nextSibling);
        }
    }

    function insertPredefinedText() {
        const reviewTextArea = document.querySelector('textarea[id="scarface-review-text-card-title"]');
        const predefinedText = GM_getValue("predefinedText", "");
        if (reviewTextArea && predefinedText) {
            const newText = predefinedText.split('\n').join('\n');
            reviewTextArea.value += newText;
        }
    }

function sendToDiscord() {
    const discordWebhookUrl = GM_getValue("discordWebhookUrl", "");
    const reviewText = document.querySelector('textarea[id="scarface-review-text-card-title"]').value;
    const productName = document.querySelector('span[data-hook="ryp-product-title"]').innerText;
    const productImageUrl = document.querySelector('div[data-hook="ryp-product-image-container"] img').getAttribute('src');
    const headline = document.querySelector('input[data-hook="ryp-review-title-input"]').value;
    const webhookAvatarUrl = "https://www.commercerev.com/storage/2020/09/AmazonVineLogo-150x150.png";
    const webhookName = "Vine Review Archiver";

    function translateStarCount() {
        const starImages = document.querySelectorAll('.ryp__star__button img');

        let filledStarCount = 0;
        let emptyStarCount = 0;
        for (const starImage of starImages) {
            const imageUrl = starImage.src;
            if (imageUrl === "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzgiIGhlaWdodD0iMzUiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjUwJSIgeDI9IjUwJSIgeTE9IjI3LjY1JSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkNFMDAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkE3MDAiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGlkPSJiIiBkPSJNMTkgMGwtNS44NyAxMS41MkwwIDEzLjM3bDkuNSA4Ljk3TDcuMjYgMzUgMTkgMjkuMDIgMzAuNzUgMzVsLTIuMjQtMTIuNjYgOS41LTguOTctMTMuMTMtMS44NXoiLz48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48dXNlIGZpbGw9InVybCgjYSkiIHhsaW5rOmhyZWY9IiNiIi8+PHBhdGggc3Ryb2tlPSIjQTI2QTAwIiBzdHJva2Utb3BhY2l0eT0iLjc1IiBkPSJNMTkgMS4xbC01LjU0IDEwLjg4TDEuMSAxMy43Mmw4Ljk0IDguNDRMNy45MiAzNC4xIDE5IDI4LjQ2bDExLjA4IDUuNjQtMi4xMS0xMS45NCA4Ljk0LTguNDQtMTIuMzYtMS43NEwxOSAxLjF6Ii8+PC9nPjwvc3ZnPg==") {
                filledStarCount++;
            } else if (imageUrl === "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzgiIGhlaWdodD0iMzUiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJNMTkgMGwtNS44NyAxMS41MkwwIDEzLjM3bDkuNSA4Ljk3TDcuMjYgMzUgMTkgMjkuMDIgMzAuNzUgMzVsLTIuMjQtMTIuNjYgOS41LTguOTctMTMuMTMtMS44NXoiLz48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48dXNlIGZpbGw9InVybCgjYSkiIHhsaW5rOmhyZWY9IiNhIi8+PHBhdGggc3Ryb2tlPSIjQTI2QTAwIiBzdHJva2Utb3BhY2l0eT0iLjc1IiBkPSJNMTkgMS4xbC01LjU0IDEwLjg4TDEuMSAxMy43Mmw4Ljk0IDguNDRMNy45MiAzNC4xIDE5IDI4LjQ2bDExLjA4IDUuNjQtMi4xMS0xMS45NCA4Ljk0LTguNDQtMTIuMzYtMS43NEwxOSAxLjF6Ii8+PC9nPjwvc3ZnPg==") {
                emptyStarCount++;
            }
        }

        const starCount = filledStarCount + emptyStarCount;
        const starEmojis = [
            "⭐",
            "⭐⭐",
            "⭐⭐⭐",
            "⭐⭐⭐⭐",
            "⭐⭐⭐⭐⭐"
        ];

        if (starCount >= 1 && starCount <= 5) {
            return starEmojis[starCount - 1];
        } else {
            console.error("Invalid star count:", starCount);
            return "";
        }
    }

    if (discordWebhookUrl) {
        GM_xmlhttpRequest({
            method: "POST",
            url: discordWebhookUrl,
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify({
                username: webhookName,
                avatar_url: webhookAvatarUrl,
                embeds: [{
                    title: "here's your Review",
                    fields: [
                        {
                            name: "Product Name",
                            value: productName,
                            inline: false
                        },
                        {
                            name: "Title",
                            value: headline,
                            inline: false
                        },
                        {
                            name: "Stars",
                            value: translateStarCount(),
                            inline: true
                        },
                        {
                            name: "Review",
                            value: reviewText.length > 1024 ? reviewText.substring(0, 1021) + "..." : reviewText,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `Posted on ${new Date().toLocaleString()}, made by @wattie`
                    },
                    color: 5025616,
                    thumbnail: {
                        url: productImageUrl
                    }
                }]
            }),
            onload: function(response) {
                alert("Embed sent to Discord!");
            },
            onerror: function(error) {
                console.error("Error sending to Discord:", error);
            }
        });
    } else {
        console.log("Discord webhook URL is missing.");
    }
}

    function toggleSettingsDropdown() {
        settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (!mutation.addedNodes) return;

            for (let i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].querySelector('div[data-hook="ryp-review-text-input"]')) {
                    addButton("Insert Template", insertPredefinedText, "insert-button");
                    addButton("Send to Discord", sendToDiscord, "send-button");
                    addIconButton("⚙️", toggleSettingsDropdown);
                    break;
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
