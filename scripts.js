document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("userInput");
    const combinedEmojiOutput = document.getElementById("combinedEmojiOutput");
    const nonCombinedEmojiOutput = document.getElementById("nonCombinedEmojiOutput");
    const categorySection = document.getElementById("categorySection");

    // Font categories with Unicode mappings and custom transformations
    const fontCategories = {
        "All": {},
        "Emoji Mix": { transform: (char) => "✨" + char + "🌟" },
        "Hearts": { transform: (char) => "❤️" + char + "💖" },
        "Stars": { transform: (char) => "⭐" + char + "🌠" },
        "Fire": { transform: (char) => "🔥" + char + "🔥" },
        "Magic": { transform: (char) => "🔮" + char + "✨" },
        "Ghostly": { transform: (char) => "👻" + char + "💀" },
        "Cool": { transform: (char) => "😎" + char + "🔥" },
        "Wavy": { transform: (char) => char + "〰️" },
        "Zalgo": { transform: (char) => char + "̶" + "͞" },
        "Circled Emoji": { transform: (char) => "⭕" + char + "⭕" },
        "Sparkles": { transform: (char) => "✨" + char + "✨" },
        "Shadow": { transform: (char) => char + "𝚀" },
        "Strikethrough": { transform: (char) => char + "̶" },
        "Underline": { transform: (char) => char + "̲" },
        "Superscript": { transform: (char) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[char] || char },
        "Subscript": { transform: (char) => "₀₁₂₃₄₅₆₇₈₉"[char] || char },
        "Fullwidth": { transform: (char) => String.fromCodePoint(char.charCodeAt(0) + 0xFF00 - 0x20) },
        "Circled": { transform: (char) => String.fromCodePoint(0x24B6 + (char.charCodeAt(0) - 65)) },
        "Negative Circled": { transform: (char) => String.fromCodePoint(0x1F150 + (char.charCodeAt(0) - 65)) },
        "Squared": { transform: (char) => String.fromCodePoint(0x1F130 + (char.charCodeAt(0) - 65)) },
        "Parenthesized": { transform: (char) => "(" + char + ")" },
        "Regional Indicators": { transform: (char) => String.fromCodePoint(0x1F1E6 + (char.charCodeAt(0) - 65)) },
        "Bold": { transform: (char) => String.fromCodePoint(char.charCodeAt(0) + 0x1D400 - 0x41) },
        "Italic": { transform: (char) => String.fromCodePoint(char.charCodeAt(0) + 0x1D434 - 0x41) },
        "Bold Italic": { transform: (char) => String.fromCodePoint(char.charCodeAt(0) + 0x1D468 - 0x41) },
        "Fancy": { transform: (char) => "𝒻𝒶𝓃𝒸𝓎"[char] || char },
        "Gothic": { transform: (char) => "𝔊𝔬𝔱𝔥𝔦𝔠"[char] || char },
        "Script": { transform: (char) => "𝓢𝓬𝓻𝓲𝓹𝓽"[char] || char },
        "Fraktur": { transform: (char) => "𝕱𝖗𝖆𝖐𝖙𝖚𝖗"[char] || char },
        "Double-Struck": { transform: (char) => "𝔻𝕠𝕦𝕓𝕝𝕖"[char] || char },
        "Monospace": { transform: (char) => "𝙼𝚘𝚗𝚘"[char] || char },
        "Emoji Fun": { transform: (char) => "🤣" + char + "😂" },
    };

    for (let category in fontCategories) {
        const button = document.createElement("div");
        button.classList.add("category");
        button.textContent = category;
        button.addEventListener("click", () => applyCategory(category));
        categorySection.appendChild(button);
    }

    function applyCategory(category) {
        const inputText = userInput.value.trim();
        if (!inputText) {
            combinedEmojiOutput.innerHTML = "<p>Enter text to generate stylish versions...</p>";
            nonCombinedEmojiOutput.innerHTML = "";
            return;
        }

        let combinedHTML = "";
        let nonCombinedHTML = "";

        if (category === "All") {
            for (let cat in fontCategories) {
                if (cat === "All") continue;
                const convertedText = transformText(inputText, fontCategories[cat]);
                if (isCombinedEmoji(convertedText)) {
                    combinedHTML += `<p>${convertedText} <button class="copy-button" onclick="copyToClipboard('${convertedText}', this)">Copy</button></p>`;
                } else {
                    nonCombinedHTML += `<p>${convertedText} <button class="copy-button" onclick="copyToClipboard('${convertedText}', this)">Copy</button></p>`;
                }
            }
        } else {
            const convertedText = transformText(inputText, fontCategories[category]);
            if (isCombinedEmoji(convertedText)) {
                combinedHTML += `<p>${convertedText} <button class="copy-button" onclick="copyToClipboard('${convertedText}', this)">Copy</button></p>`;
            } else {
                nonCombinedHTML += `<p>${convertedText} <button class="copy-button" onclick="copyToClipboard('${convertedText}', this)">Copy</button></p>`;
            }
        }

        combinedEmojiOutput.innerHTML = combinedHTML;
        nonCombinedEmojiOutput.innerHTML = nonCombinedHTML;
    }

    function transformText(input, style) {
        let convertedText = "";
        for (let char of input) {
            if (style.transform) {
                convertedText += style.transform(char);
            } else {
                convertedText += char;
            }
        }
        return convertedText;
    }

    function isCombinedEmoji(text) {
        // Check if the text contains combined emojis (e.g., multiple emojis or emojis with modifiers)
        const emojiRegex = /\p{Emoji}/gu;
        const matches = text.match(emojiRegex);
        return matches && matches.length > 1;
    }

    window.copyToClipboard = function (text, button) {
        navigator.clipboard.writeText(text).then(() => {
            button.textContent = "Copied!";
            button.classList.add("copied");
            setTimeout(() => {
                button.textContent = "Copy";
                button.classList.remove("copied");
            }, 1500);
        }).catch(() => {
            button.textContent = "Failed";
            setTimeout(() => {
                button.textContent = "Copy";
            }, 1500);
        });
    };

    userInput.addEventListener("input", () => {
        applyCategory("All");
    });
});