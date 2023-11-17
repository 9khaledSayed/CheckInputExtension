
(() => {
    var popup = document.createElement('div');
    popup.innerHTML = '<button id="start-activity">Start Activity</button>'
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#fff';
    popup.style.color = 'black';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #000';
    popup.style.zIndex = '9999';




    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "execute_content_script") {
            document.body.appendChild(popup);

            const startActivityBtn = document.getElementById('start-activity');
            startActivityBtn.addEventListener('click', startActivity);
        }
    });



    function startActivity() {
        const isFormInputsFound = document.querySelectorAll("form input , form textarea, form select").length > 0;

        if (isFormInputsFound) {
            popup.innerHTML = 'form fields found!';
            chrome.runtime.sendMessage({ action: 'field_found' }, (response) => {

                fetch(response.reply)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        return response.json();
                    })
                    .then(data => {
                        const quoteContent = data[0];

                        popup.innerHTML = `
                            <p>Content : ${quoteContent.content}</p></br>
                            <p>Author : ${quoteContent.author}</p></br>
                            <p>Tags : ${quoteContent.tags[0]}</p></br>
                            <p>DateAdded : ${quoteContent.dateAdded}</p>
                        `;
                        console.log('Response from background script:', quoteContent);
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                    });

            });


        } else {
            popup.innerHTML = 'ops no form fields found!';

            chrome.runtime.sendMessage({ action: 'no_field_found' }, (response) => {
                popup.innerHTML = `<img src='${response.reply}'>`;
            });
        }
    }

})();


