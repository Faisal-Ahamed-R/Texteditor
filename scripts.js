// Function to convert text to a single line with specific formatting
function convertToSingleLine() {
    console.log('convertToSingleLine called'); // Debugging
    const inputTextarea = document.getElementById('inputText1');
    const outputTextarea = document.getElementById('outputText1');
    
    // Store the current cursor position in the input textarea
    const cursorPosition = inputTextarea.selectionStart;
    
    let inputText = inputTextarea.value;

    // Replace all occurrences of "&" with "and" in the input
    inputText = inputText.replace(/&/g, 'and');

    const sentences = inputText.split('\n')
        .map(sentence => sentence.trim())
        .filter(sentence => sentence !== "" && !/^[\d.,!@#$%^&*()\-+=\[\]{}<>?\/\\|~`"':;]+$/.test(sentence)); // Remove cells with only numbers or special characters

    // Capitalize the first letter of each word except articles, conjunctions, and prepositions
    const capitalizeWord = word => {
        const lowerCaseWord = word.toLowerCase();
        const exceptions = ["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "so", "the", "to", "up", "yet"];
        return exceptions.includes(lowerCaseWord) ? lowerCaseWord : word.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
    };

    const formattedSentences = sentences.map(sentence =>
        sentence.split(' ').map(capitalizeWord).join(' ')
    );

    // Join sentences with a comma and space, ending with " & " between the last two items
    const outputText = formattedSentences.length > 1
        ? formattedSentences.slice(0, -1).join(', ') + ' & ' + formattedSentences.slice(-1)
        : formattedSentences.join('');

    // Set the output text
    outputTextarea.value = outputText;

    // Restore the cursor position in the input textarea
    inputTextarea.setSelectionRange(cursorPosition, cursorPosition);

    // Update character count and repeated words
    updateCharacterCount('outputText1');
    updateRepeatedWords('outputText1');

    // Trigger auto-select after output has been updated
    triggerAutoSelect(outputTextarea);
}

// Function to automatically select the entire output text
function triggerAutoSelect(textarea) {
    console.log('triggerAutoSelect called'); // Debugging
    textarea.select();
}

// Event listener for input textarea to update the output in real-time
document.getElementById('inputText1').addEventListener('input', () => {
    console.log('Input event detected'); // Debugging
    convertToSingleLine(); // Call the function to update the output in real-time
});

// Event listener for output textarea to update character count and repeated words
document.getElementById('outputText1').addEventListener('input', () => {
    console.log('Output event detected'); // Debugging
    updateCharacterCount('outputText1');
    updateRepeatedWords('outputText1');
});

// Function to update character count and repeated words
function updateCharacterCount(textareaId) {
    const textarea = document.getElementById(textareaId);
    const text = textarea.value;

    // Update character count
    const charCount = text.length;
    document.getElementById(`characterCount${textareaId.slice(-1)}`).innerText = `Character Count: ${charCount}`;

    // Example repeated words logic
    const words = text.split(/\s+/).filter(Boolean);
    const wordCounts = {};
    words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    const repeatedWords = Object.keys(wordCounts).filter(word => wordCounts[word] > 1).join(', ');
    document.getElementById(`repeatedWords${textareaId.slice(-1)}`).innerText = `Repeated Words: ${repeatedWords}`;
}




// Function to convert text to N x 2 format
function convertToNby2() {
    const inputText = document.getElementById('inputText2').value;
    const lines = inputText.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const n = lines.length;
    const outputLines = [];

    for (let i = 0; i < n; i += 2) {
        outputLines.push(lines.slice(i, i + 2).join(' '));
    }

    const outputText = outputLines.join('\n');

    document.getElementById('outputText2').value = outputText;
    updateCharacterCount('outputText2');
}

let isTypingColumn = false; // Flag to check if user is actively typing
let typingTimeout; // Timer for debouncing the input

// Function to format column text vertically and update in real-time
function formatColumnText() {
    const inputText = document.getElementById('inputText3').value;

    // Split the input into lines, trim each line, and filter out any empty lines
    const lines = inputText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Ensure all lines end with <br> except the last one
    const formattedText = lines.map((line, index) => 
        index === lines.length - 1 ? line : line + '<br>'
    ).join('\n'); // Ensure vertical output by joining with newline

    // Set the formatted text as the output
    const outputTextarea = document.getElementById('outputText3');
    outputTextarea.value = formattedText;

    // Automatically select the entire output for easy copying
    outputTextarea.select();

    // Update character count and repeated words information
    updateCharacterCount('outputText3');
}

// Function to copy text to clipboard
function copyText(textareaId) {
    const textarea = document.getElementById(textareaId);
    textarea.select();
    document.execCommand('copy');
}

// Function to update character count and repeated words
function updateCharacterCount(textareaId) {
    const textarea = document.getElementById(textareaId);
    const text = textarea.value;

    // Update character count
    const charCount = text.length;
    document.getElementById(`characterCount${textareaId.slice(-1)}`).innerText = `Character Count: ${charCount}`;

    // Example repeated words logic
    const words = text.split(/\s+/).filter(Boolean);
    const wordCounts = {};
    words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    const repeatedWords = Object.keys(wordCounts).filter(word => wordCounts[word] > 1).join(', ');
    document.getElementById(`repeatedWords${textareaId.slice(-1)}`).innerText = `Repeated Words: ${repeatedWords}`;
}

// Debounced input handler to avoid auto-updating while typing
document.getElementById('inputText3').addEventListener('input', () => {
    clearTimeout(typingTimeout); // Clear any previous timer

    isTypingColumn = true; // Mark as typing
    typingTimeout = setTimeout(() => {
        isTypingColumn = false; // Stop typing
        formatColumnText(); // Only format when user pauses typing
    }, 1000); // 1 second delay after typing stops
});

// Initialize character count and repeated words on page load
window.onload = function() {
    updateCharacterCount('inputText3');
    updateCharacterCount('outputText3');
};



// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const sections = document.querySelectorAll('.section');
    const textareas = document.querySelectorAll('textarea');
    const buttons = document.querySelectorAll('button');
    const characterCounts = document.querySelectorAll('[id^="characterCount"]');
    const repeatedWords = document.querySelectorAll('[id^="repeatedWords"]');

    body.classList.toggle('dark-mode');
    sections.forEach(section => section.classList.toggle('dark-mode'));
    textareas.forEach(textarea => textarea.classList.toggle('dark-mode'));
    buttons.forEach(button => button.classList.toggle('dark-mode'));
    characterCounts.forEach(count => count.classList.toggle('dark-mode'));
    repeatedWords.forEach(word => word.classList.toggle('dark-mode'));
}

// Check localStorage for dark mode preference
document.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        toggleDarkMode(); // Apply dark mode if previously enabled
    }

    // Create a toggle button for dark mode and add it to the top
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Dark Mode';
    toggleButton.classList.add('dark-mode-toggle');
    toggleButton.onclick = () => {
        toggleDarkMode();
        // Save the current mode in localStorage
        const darkModeEnabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', darkModeEnabled);
    };

    // Append the toggle button to the header
    document.querySelector('header').appendChild(toggleButton);
});
// Function to display example data for each section
function showExample(section) {
    let exampleText = '';

    switch(section) {
        case 'single-line':
            exampleText = `Laptop Hinge Repair\n
Cracked LCD Screen Repair\n
Same Day Computer Repair\n
Battery Replacement\n
Apple Laptop Repair\n
Water Spill Repair\n
Custom Gaming PC Build & Repair\n
Virus Malware Scan and Removal\n
Data Transfer and Recovery\n
Not Turning On / Power Issue\n
Computer Recycling`;
            break;

        case 'n-by-2':
            exampleText = `Provincial Vehicle Inspection\n
$45.00\n
Vehicle Inspection\n
$35.00\n
Tire Rotation\n
$10.00\n
Wheel Balancing\n
From $13.50\n
4 Wheel Alignment\n
$89.95\n
Scanner\n
$70.00\n
Brake Inspection\n
$35.00\n
Front Disc Brakes\n
Ask About Price\n
Brake Fluid Flush\n
$60.00\n
Charging System Diagnosis\n
$35.95\n
Replacing Serpentine Belt\n
Ask About Price\n
Gas Service\n
$129.99`;
            break;

        case 'format-columns':
            exampleText = `Hardware Diagnostic $30\n
Screen Replace $80\n
Hard Drive Clone $60\n
Windows 10 or 11 $60\n
Power Supply $60\n
Power Jack $100\n
Data Recovery Starting at $80 to $200`;
            break;

        default:
            exampleText = 'No example available.';
    }

    const exampleTextArea = document.createElement('textarea');
    exampleTextArea.value = exampleText;
    exampleTextArea.setAttribute('readonly', true);
    exampleTextArea.style.width = '100%';
    exampleTextArea.style.height = '150px';
    exampleTextArea.style.margin = '10px 0';
    exampleTextArea.style.padding = '12px';
    exampleTextArea.style.fontSize = '16px';
    exampleTextArea.style.border = '1px solid #ccc';
    exampleTextArea.style.borderRadius = '8px';
    exampleTextArea.style.backgroundColor = '#fff';
    exampleTextArea.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1)';
    exampleTextArea.style.overflow = 'auto';

    const sectionElement = document.querySelector(`.section.${section}`);
    sectionElement.appendChild(exampleTextArea);
}
// Function to show info in an alert
function showInfo(infoType) {
    let infoMessage = '';
    switch (infoType) {
        case 'singleLineInfo':
            infoMessage = "This function converts columns of words or sentences into single with commas.\n\nFor example:\nInput:\n" +
                          "laptop Hinge Repair\ncracked LCD screen Repair\nsame Day Computer Repair\n...\n\n" +
                          "Output:\nLaptop Hinge Repair, Cracked Lcd Screen Repair, Same Day Computer Repair, ...";
            break;
        case 'nBy2Info':
            infoMessage = "This function converts columns of words or sentences into N x 2 Format. This is helpful for editing prices.\n\nFor example:\n" +
                          "Input:\nProvincial Vehicle Inspection\n$45.00\n...\n\n" +
                          "Output:\nProvincial Vehicle Inspection $45.00\nVehicle Inspection $35.00\n...";
            break;
        case 'formatColumnTextInfo':
            infoMessage = "This function removes the extra line space in columns of words or sentences.\n\nFor example:\n" +
                          "Input:\nHardware Diagnostic $30\n\nScreen Replace $80\n...\n\n" +
                          "Output:\nHardware Diagnostic $30\nScreen Replace $80\n...";
            break;
        default:
            infoMessage = "No information available.";
    }
    alert(infoMessage);
}