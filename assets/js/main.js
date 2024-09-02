document.addEventListener('DOMContentLoaded', function() {
    const recipes = ["Chocolate Cake", "Banana Bread", "Apple Pie", "Lemon Tart"];
    const inputElement = document.getElementById('inputInput');
    let recipeIndex = 0;
    let charIndex = 0;
    let direction = 1;
    const generateButton = document.getElementById('generateButton');
    const resetButton = document.getElementById('resetButton');
    const titleList = document.getElementById('titleList');
    const inputInput = document.getElementById('inputInput');
    const imageContainer = document.getElementById('imageContainer');

    function animatePlaceholder() {
        const currentRecipe = recipes[recipeIndex];
        inputElement.placeholder = "Enter a recipe (e.g., " + currentRecipe.slice(0, charIndex) + ")";

        charIndex += direction;

        if (charIndex === currentRecipe.length + 1) {
            direction = -1;
        } else if (charIndex === 0) {
            direction = 1;
            recipeIndex = (recipeIndex + 1) % recipes.length;
        }

        setTimeout(animatePlaceholder, 150); // Adjust speed by changing the timeout duration
    }

    animatePlaceholder();

    generateButton.addEventListener('click', function() {
        const input = inputInput.value.trim();
        if (!input) {
            alert('Please enter an input.');
            return;
        }

        imageContainer.innerHTML = `<div class="loader" style="max-width: 20%;"></div>`;
        imageContainer.classList.remove('hidden'); 
        titleList.innerHTML = '';
        
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCEsbXw-vF0VzOGO1FoBGxxHSI1GWNPrTY';

        const requestData = {
            contents: [
                {
                    parts: [
                        { text: "Give me the recipe for " + input + " in the following format: Ingredients  Directions Presentation" }
                    ]
                }
            ]
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(jsonResponse => {
            titleList.innerHTML = '';
            imageContainer.classList.add('hidden'); // Hide the loading image

            if (jsonResponse && jsonResponse.candidates && jsonResponse.candidates[0]) {
                let outputText = jsonResponse.candidates[0].content.parts[0].text;

                outputText = outputText.replace(/\*/g, '');

                const ingredients = outputText.split(/Ingredients:/i)[1]?.split(/Directions:/i)[0]?.trim();
                const directions = outputText.split(/Directions:/i)[1]?.split(/Presentation:/i)[0]?.trim();
                const presentation = outputText.split(/Presentation:/i)[1]?.trim();

                let formattedOutput = '';

                if (ingredients) {
                    formattedOutput += `<h3><hr class="separator"><h3><img src="assets/images/Ingredients.png" class="icon">Ingredients:</h3><p>${ingredients.replace(/\n/g, '<br>')}</p>`;
                }

                if (directions) {
                    formattedOutput += `<h3><hr class="separator"><h3><img src="assets/images/Directions.png" class="icon">Directions:</h3><p>${directions.replace(/\n/g, '<br>')}</p>`;
                }

                if (presentation) {
                    formattedOutput += `<h3><hr class="separator"><h3><img src="assets/images/Presentation.png" class="icon">Presentation:</h3><p>${presentation.replace(/\n/g, '<br>')}</p>`;
                }

                titleList.innerHTML = formattedOutput;

            } else {
                titleList.innerHTML = '<p>No response received. Please try again.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            imageContainer.innerHTML = '<img src="http://wordpress-test.local/wp-content/uploads/2024/03/error_image.png" alt="Error" style="max-width: 100%;">' +
                                       '<p>Oops! Something went wrong. Please try again.</p>';
        });
    });

    resetButton.addEventListener('click', function() {
        window.location.reload();
    });

    const copyButton = document.getElementById('copyButton');
    
    copyButton.addEventListener('click', function() {
        const textToCopy = document.getElementById('responseContainer').innerText;
        copyToClipboard(textToCopy);
    });

    function copyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            alert('Copied to clipboard!');
        } catch (err) {
            alert('Failed to copy text.');
            console.error('Unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    // For Buy Me a Coffee Loop Animation
    const lines = ["Buy me a Coffee !!", "Support me !!", "Click the coffee icon"];
    let currentIndex = 0;

    function loopText() {
        const loopTextDiv = document.getElementById('buymeacoffee');
        loopTextDiv.textContent = lines[currentIndex];
        currentIndex = (currentIndex + 1) % lines.length;
    }

    setInterval(loopText, 2000); // Change text every 2 seconds


});
