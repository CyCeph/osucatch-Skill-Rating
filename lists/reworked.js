async function rework() {
    const main = document.querySelector("tbody");
    const url = "https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=1043073592";
    let result = await fetch(url)

    let text = await result.text()
    let csvText = await csv().fromString(text)
    console.log(csvText)
    let html = "";
    csvText.forEach(async (row, index) => {
        html += `
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
    }
    );
    main.innerHTML = html;
}
rework();