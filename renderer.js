document.addEventListener('DOMContentLoaded', function() {
    const keypadButtons = document.querySelectorAll('.number, .delete, .enter');
    const resultInput = document.getElementById('result');
    const errorMsg = document.getElementById('error');

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
            if (button.classList.contains('enter')) {
                const inputValue = resultInput.value;
                if(inputValue == 1987) {
                    // Send IPC message to the main process to open the folder
                    window.ipcRenderer.send('open-folder', true);
                    
                    errorMsg.style.visibility = 'hidden';
                } else{
                    errorMsg.style.visibility = 'visible';
                }
            }
        });
    });
});
