const textElement = document.querySelector("h1");
document.addEventListener("DOMContentLoaded", () => {
    
    textTyping(textElement, 60);

});

function textTyping(element, typingSpeed) {
    const fullText = element.innerText;
    let index = 1;

    const interval = setInterval(() => {

        element.innerText = fullText.slice(0, index);
        index++;
        if (index > fullText.length){
            clearInterval(interval);
        }

    }, typingSpeed);
};