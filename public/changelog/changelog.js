// Load the 
(async () => {
    let changeDiv = document.getElementById('change-div')

    // load the text from the changelog
    const text = await (await fetch("./changelog.txt")).text();

    let commits = text.split('\n\n')
    let dates = commits.map((x) => 
        x.match(/\d\d\d\d-\d\d-\d\d/)
    )

    let dateMap = new Map();

    for (const commit of commits) {
        let date = commit.match(/\d\d\d\d-\d\d-\d\d/)[0]
        let time = commit.match(/\d\d:\d\d:\d\d -\d\d\d\d/)[0]
        let message = commit.split(`${date} ${time} - `)[1].split('\n')[0]
        let files = commit.split('\n').slice(1,-1)
        let stats = commit.split('\n').slice(-1)[0]

        // if it's not there, add it
        if (dateMap.has(date)) {
            dateMap.set(date, [...dateMap.get(date), {
                time: time,
                message: message,
                files: files,
                stats: stats
            }])

        }
        else { // otherwise update it
            dateMap.set(date, [
                {
                    time: time,
                    message: message,
                    files: files,
                    stats: stats
                }
            ])
        }
    }

    // add to a hash table for the dates
    console.log(dateMap)
    
    for (const [date, commits] of dateMap) {
        let dateDiv = document.createElement("div")
        dateDiv.id = "changelog-list"

        let dateText = document.createElement("h3")
        dateText.innerText = date

        //dateDiv.appendChild(dateText)

        let commitList = document.createElement("ul")
        commitList.appendChild(dateText)
        for (const commit of commits) {
            let message = document.createElement("li")
            let messageString = `${commit.message} - ${commit.time}`
            message.appendChild(document.createTextNode(messageString))

            let files = document.createElement("ul")

            for (const file of commit.files) {
                let fileDetails = document.createElement("li")
                let strippedFile = file.split("public/")[1]
                fileDetails.appendChild(document.createTextNode(strippedFile))
                files.appendChild(fileDetails)
            }
            message.appendChild(files)


            commitList.appendChild(message)
        }
        dateDiv.appendChild(commitList)
        changeDiv.appendChild(dateDiv)
    }
})();