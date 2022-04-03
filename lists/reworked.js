let request = new XMLHttpRequest();
request.onreadystatechange = (() => { // TODO Unnecessary to keep requesting for new data; store on finished request event then sort on user change event
    if (request.readyState == 4 && request.status == 200) {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = `
            <tr class="text-white bg-[#2f382e] h-2 hover:duration-150 duration-300 hover:saturate-200 hover:drop-shadow-sm whitespace-nowrap  hover:scale-110">
                <td class='opacity-30'>Loading</td>
            </tr>
        `;
        csv().fromString(request.responseText).then((json) => {
            new Promise((resolve) => {
                json.sort((a, b) => {
                    switch (localStorage.getItem("sort")) {
                        case "ACC":
                        case "AR":
                        case "Acc (%)":
                        case "CS":
                        case "Diff":
                        case "Last update":
                        case "PP":
                        case "PRE":
                        case "Pre-Rework SR":
                        case "REA":
                        case "RFX":
                        case "RFX":
                        case "SR":
                        case "STA":
                        case "TEN":
                        case "WRM":
                        case "✰R":
                            return parseFloat(b[localStorage.getItem("sort")].replace(/\,?\%?/g, ""))
                                    - parseFloat(a[localStorage.getItem("sort")].replace(/\,?\%?/g, ""));
                        case "Length":
                            let bSplit = b[localStorage.getItem("sort")].split(":");
                            let aSplit = a[localStorage.getItem("sort")].split(":");
                            return parseFloat(bSplit[0] * 60 * 24 + bSplit[1] * 60 + bSplit[2])
                                    - parseFloat(aSplit[0] * 60 * 24 + aSplit[1] * 60 + aSplit[2]);
                        case "Title": // TODO Sort by Grandmaster to Beginner/Untitled
                        case "Usernames":
                            return a[localStorage.getItem("sort")].localeCompare(b[localStorage.getItem("sort")]);
                        default:
                            return parseFloat(b["SR"].replace(",", "")) - parseFloat(a["SR"].replace(",", ""));
                    }
                });
                resolve();
            }).then(() => {
                tbody.innerHTML = "";
                json.forEach((row, index) => {
                    tbody.innerHTML += `
                        <tr class="text-white bg-[#2f382e] h-2 hover:duration-150 duration-300 hover:saturate-200 hover:drop-shadow-sm whitespace-nowrap  hover:scale-110">
                            <td class="rounded-l pl-2 pr-2 text-left"> #${index + 1} </td>
                            <td class="text-left">
                            <a class="block hover:underline" href="../profiles/profile.html#${row.uID}">
                                <div class="">
                                    ${row.Usernames}
                                </div>
                            </a>
                            </td>
                            <td class="opacity-30">${row.PP}</td>
                            <td class="">${row.SR}</td>
                            <td class="opacity-30">${row.Title}</td> 
                            <td class="opacity-30">${row["Acc (%)"]}</td>
                            <td class="opacity-30">${row["✰R"]}</td>
                            <td class="opacity-30">${row.CS}</td>
                            <td class="opacity-30">${row.AR}</td>
                            <td class="opacity-30 rounded-r pr-2">${row.Length}</td>
                        </tr>
                    `;
                });
            });
        });
    }
});

let onChangeView = ((args) => {
    if (args) {
        localStorage.setItem("sort", args);
    } else if (!localStorage.getItem("sort")) {
        localStorage.setItem("sort", "SR");
    }
    request.open("GET", "https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=1043073592", true);
    request.send();
});

onChangeView();