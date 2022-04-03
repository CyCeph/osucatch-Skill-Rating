if (!localStorage.getItem("sort")) {
    localStorage.setItem("sort", "SR");
}
let request = new XMLHttpRequest();
request.onreadystatechange = (() => { // TODO Unnecessary to keep requesting for new data; store on finished request event then sort on user change event
    if (request.readyState == 4 && request.status == 200) {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        csv().fromString(request.responseText).then((json) => {
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
            }).forEach((row, index) => {
                tbody.innerHTML += `
                    <tr class="ranking-page-table__row">
                        <td class="ranking-page-table__column"> #${index + 1} </td>
                        <td class="ranking-page-table__column username">
                            <div class="ranking-page-table__user-link">
                                <a href="profileview.html#${row["uID"]}">${row["Usernames"]}</a>
                            </div>
                        </td>
                        <td class="ranking-page-table__column ranking-page-table__column--dimmed">${row["PP"]}</td>
                        <td class="ranking-page-table__column ranking-page-table__column--focused">${row["SR"]}</td>
                        <td class="ranking-page-table__column ranking-page-table__column--dimmed">${row["Title"]}</td>
                        <td class="ranking-page-table__column ranking-page-table__column--dimmed">${row["Acc (%)"]}</td>
                        <td class="ranking-page-table__column ranking-page-table__column--dimmed">${row["✰R"]}</td>
                        <td class="ranking-page-table__column ranking-page-table__column--dimmed">${row["CS"]}</td>
                        <td class="ranking-page-table__column ranking-page-table__column--dimmed">${row["AR"]}</td>
                        <td class="test ranking-page-table__column ranking-page-table__column--dimmed">${row["Length"]}</td>
                    </tr>`;
            });
        });
    }
});
request.open("GET", "https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=1043073592", true);
request.send();

let onChangeView = (() => {
    let order = document.getElementById("order");
    localStorage.setItem("sort", order.options[order.selectedIndex].value);
    request.open("GET", "https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=1043073592", true);
    request.send();
});