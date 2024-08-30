// Load the 
(async () => {
    let changeDiv = document.getElementById('change-div')

    // load the text from the changelog
    const text = await (await fetch("changelog/changelog.txt")).text();

    let commits = text.split('>==').slice(1)
    let dates = commits.map((x) => 
        x.match(/\d\d\d\d-\d\d-\d\d/)
    )

    let dateMap = new Map();

    for (const commit of commits) {

        /*
            Format:
            DATE TIME - TITLE
            ===
            DETAILS
            ===
            file1
            file2
            ...
            fileN
            N files changes, X insertions, Y deletions
        */
        let sections = commit.split("===")

        let date = sections[0].match(/\d\d\d\d-\d\d-\d\d/)[0]
        let time = sections[0].match(/\d\d:\d\d:\d\d -\d\d\d\d/)[0]
        let message = sections[0].split(`${date} ${time} - `)[1].split('\n')[0]
        let details = sections[1].split("\n").filter((item) => {return item != ""} )
        let files = sections[2].split('\n').slice(1,-3)
        let stats = sections[2].split('\n').slice(-3)[0]

        // if it's not there, add it
        if (dateMap.has(date)) {
            dateMap.set(date, [...dateMap.get(date), {
                time: time,
                message: message,
                details: details,
                files: files,
                stats: stats
            }])

        }
        else { // otherwise update it
            dateMap.set(date, [
                {
                    time: time,
                    message: message,
                    details: details,
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

        let commitList = document.createElement("ul")
        commitList.appendChild(dateText)
        for (const commit of commits) {
            let message = document.createElement("li")
            let messageString = `${commit.message} - ${commit.time}`
            message.appendChild(document.createTextNode(messageString))

            let details = document.createElement("p")
            for (const detail of commit.details) {
                let entry = document.createElement("div")
                entry.innerText = detail
                details.appendChild(entry)
            }
            if (commit.details.length > 0) {
                message.appendChild(details)
            }

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