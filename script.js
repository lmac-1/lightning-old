function hideElement(element) {
    if (!element.classList.contains('d-none')) {
        element.classList.add('d-none');
    }
}

function showElement(element) {
    if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
    }
}

document.querySelector('#hide').addEventListener('click', () => {
    hideElement(document.querySelector('#question'));
})