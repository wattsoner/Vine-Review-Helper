// ==UserScript==
// @name         Amazon Review Helper (Updated)
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  Assistant in writing Reviews for Amazon, with a custom template inserter and review backups using Discord Webhooks.
// @author       Wattie :3
// @match        https://www.amazon.co.uk/review/create-review*
// @match        https://www.amazon.com/review/create-review*
// @match        https://www.amazon.ca/review/create-review*
// @match        https://www.amazon.fr/review/create-review*
// @match        https://www.amazon.es/review/create-review*
// @match        https://www.amazon.it/review/create-review*
// @match        https://www.amazon.de/review/create-review*
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
            border: 1px solid #2ecc71 !important;
            outline-color: #2ecc71 !important;
        }

        .custom-button {
            cursor: pointer;
            font-size: 16px;
            color: white;
            padding: 8px 15px;
            margin: 5px;
            border-radius: 4px;
            font-weight: bold;
        }

        .custom-insert-button {
            background-color: #3498db !important;
            border: 1px solid #2980b9 !important;
        }

        .custom-send-button {
            background-color: #7289DA !important;
            border: 1px solid #6271C3 !important;
        }

        .custom-settings-button {
            background-color: #e67e22 !important;
            border: 1px solid #d35400 !important;
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
        const container = document.querySelector('textarea#reviewText');
        if (container) {
            const button = document.createElement("button");
            button.innerText = text;
            button.addEventListener("click", onClickFunction);
            button.className = "custom-button " + buttonClass;
            container.parentNode.appendChild(button);
        }
    }

    function insertPredefinedText() {
        const reviewTextArea = document.querySelector('textarea#reviewText');
        const predefinedText = GM_getValue("predefinedText", "");
        if (reviewTextArea && predefinedText) {
            reviewTextArea.value += "\n" + predefinedText;
        }
    }

   function sendToDiscord(event) {
    event.preventDefault();

    const discordWebhookUrl = GM_getValue("discordWebhookUrl", "");
    const webhookName = "Vine Review Archiver";
    const webhookAvatarUrl = "https://raw.githubusercontent.com/wattsoner/Vine-Review-Helper/main/images/Vine-Logo.png";
    const reviewText = document.querySelector('textarea#reviewText').value;
    const productLink = window.location.href;
    const productImage = document.querySelector('div[data-testid="in-context-ryp__product-header"] img').getAttribute('src');
    const reviewTitle = document.querySelector('input.a-input-text.in-context-ryp__form-field--reviewTitle').value;

    if (!discordWebhookUrl || !reviewText || !productLink || !productImage || !reviewTitle) {
        alert("Please ensure all required fields (Webhook URL, Review Title, Review Text, Product Link, Product Image) are filled.");
        return;
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: discordWebhookUrl,
        headers: {"Content-Type": "application/json"},
        data: JSON.stringify({
            username: webhookName,
            avatar_url: webhookAvatarUrl,
            embeds: [{
                title: "Here's your Review!",
                fields: [
                    {
                        name: "Review Link",
                        value: `[here](${productLink})`,
                        inline: false
                    },
                    {
                        name: "Title",
                        value: reviewTitle,
                        inline: false
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
                    url: productImage
                }
            }]
        }),
        onload: function(response) {
            alert("Your review has been successfully sent to Discord & archived.");
        },
        onerror: function(error) {
            console.error("Uh oh! There's been an error sending your review to Discord: ", error);
        }
    });
}


    function toggleSettingsDropdown() {
        settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
    }

    function checkAndAddButtons() {
        const container = document.querySelector('textarea#reviewText');
        if (container && !document.querySelector('.custom-insert-button')) {
            addButton("Insert Template", insertPredefinedText, "custom-insert-button");
            addButton("Send to Discord", sendToDiscord, "custom-send-button");
        }

        if (!document.querySelector('.custom-settings-button')) {
            const settingsButton = document.createElement("button");
            settingsButton.innerText = "Settings";
            settingsButton.addEventListener("click", toggleSettingsDropdown);
            settingsButton.className = "custom-button custom-settings-button";
            document.body.appendChild(settingsButton);
        }
    }

    checkAndAddButtons();

    const observer = new MutationObserver(() => checkAndAddButtons());
    observer.observe(document.body, { childList: true, subtree: true });
})();
