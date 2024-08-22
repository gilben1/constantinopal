
(async () => {
    let changeDiv = document.getElementById('change-div')

    const text = await (await fetch("./changelog.txt")).text();
    changeDiv.innerText = text;
})();