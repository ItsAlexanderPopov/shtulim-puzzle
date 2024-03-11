document.addEventListener('DOMContentLoaded', function() {
    const keypadButtons = document.querySelectorAll('.number, .delete, .enter');
    const resultInput = document.getElementById('result');
    const errorMsg = document.getElementById('error');
    const buttons = document.querySelectorAll('button');
    let processing = false;

    // Function to disable all buttons
    function disableButtons() {
        buttons.forEach(button => {
            button.disabled = true;
        });
    }

    // Function to enable all buttons
    function enableButtons() {
        buttons.forEach(button => {
            button.disabled = false;
        });
    }

    function showLoadingAnimation() {
        let countdown = 29;
        const countdownInterval = setInterval(() => {
            if (countdown < 0) {
                clearInterval(countdownInterval);
                errorMsg.textContent = 'Error: Wrong Answer, Try Again in (30 seconds)';
            } else {
                errorMsg.textContent = `Error: Wrong Answer, Try Again in (${countdown} seconds)`;
                countdown--;
            }
        }, 1000);
    }

    keypadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent;

            // Handle number buttons
            if (button.classList.contains('number')) {
                if (resultInput.value.length < 4) {
                    resultInput.value += buttonText;
                    errorMsg.style.visibility = 'hidden';
                }
            }

            // Handle delete button
            if (button.classList.contains('delete')) {
                resultInput.value = resultInput.value.slice(0, -1); // Remove last character
                errorMsg.style.visibility = 'hidden';
            }

            // Handle enter button
            if (button.classList.contains('enter') && !processing) {
                processing = true;
                disableButtons();
                const inputValue = resultInput.value;
                if(inputValue == 1987) {
                    // Send IPC message to the main process to open the folder
                    window.ipcRenderer.send('open-folder', true);
                    processing = false;
                    enableButtons();
                    errorMsg.style.visibility = 'hidden';
                } else {
                    showLoadingAnimation();
                    errorMsg.style.visibility = 'visible';
                    // Disable user interaction for 30 seconds
                    setTimeout(() => {
                        processing = false;
                        errorMsg.style.visibility = 'hidden';
                        /* errorMsg.textContent = 'Error: Wrong Answer, Try Again in (30 seconds)'; */
                        enableButtons();
                    }, 30000);
                }
            }
        });
    });
});
