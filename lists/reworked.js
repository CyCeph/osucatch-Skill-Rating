localStorage.setItem("sort", "SR");
let request = new XMLHttpRequest();
request.onreadystatechange = async () => {
  // TODO Unnecessary to keep requesting for new data; store on finished request event then sort on user change event
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = `
            <tr class="text-white bg-[#2f382e] h-2 hover:duration-150 duration-300 hover:saturate-200 hover:drop-shadow-sm whitespace-nowrap  hover:scale-110">
                <td class='opacity-30'>Loading</td>
            </tr>
        `;
  if (request.readyState == 4 && request.status == 200) {
    let csvText = await csv().fromString(request.responseText);
    let sortedData = await sortJson(csvText);

    tbody.innerHTML = await createTable(sortedData);

    function sortJson(json) {
      return new Promise((resolve) => {
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
              return parseFloat(b[localStorage.getItem("sort")].replace(/\,?\%?/g, "")) - parseFloat(a[localStorage.getItem("sort")].replace(/\,?\%?/g, ""));
            case "Length":
              let bSplit = b[localStorage.getItem("sort")].split(":");
              let aSplit = a[localStorage.getItem("sort")].split(":");
              return parseFloat(bSplit[0] * 60 * 24 + bSplit[1] * 60 + bSplit[2]) - parseFloat(aSplit[0] * 60 * 24 + aSplit[1] * 60 + aSplit[2]);
            case "Title":
              let order = ["Creator", "Grandmaster", "GM Candidate", "Honorary GM", "Dan", "Master", "Expert", "Advanced", "Amateur", "Beginner", "Untitled"];
              let indexOfA = a[localStorage.getItem("sort")].includes("Dan") ? order.indexOf("Dan") : order.indexOf(a[localStorage.getItem("sort")]);
              let indexOfB = b[localStorage.getItem("sort")].includes("Dan") ? order.indexOf("Dan") : order.indexOf(b[localStorage.getItem("sort")]);
              //TODO: Figure out Dan order. Currently set after Honorary GM and is not sorted by in correct order.
              if (indexOfA < indexOfB) {
                return -1;
              }
              if (indexOfA > indexOfB) {
                return 1;
              }
              return 0;
            case "Usernames":
              return a[localStorage.getItem("sort")].localeCompare(b[localStorage.getItem("sort")]);
            default:
              return parseFloat(b["SR"].replace(",", "")) - parseFloat(a["SR"].replace(",", ""));
          }
        });
        resolve(json);
      });
    }
    function createTable(sortedJson) {
      return new Promise((resolve) => {
        let html = "";
        sortedJson.forEach((row, index) => {
          html += `
                        <tr class="text-[#6a7069] bg-[#2f382e] h-2 hover:duration-150 duration-300 hover:saturate-200 hover:drop-shadow-sm whitespace-nowrap  hover:scale-110">
                            <td class="rounded-l pl-2 pr-2 text-left text-white"> #${index + 1} </td>
                            <td class="text-left">
                            <a class="block hover:underline text-white" href="../profiles/profile.html#${row.uID}">
                                <div class="">
                                    ${row.Usernames}
                                </div>
                            </a>
                            </td>
                            <td class="${localStorage.getItem("sort") == "PP" ? "text-white" : ""}">${row.PP}</td>
                            <td class="${localStorage.getItem("sort") == "SR" ? "text-white" : ""}">${row.SR}</td>
                            <td class="${localStorage.getItem("sort") == "Title" ? "text-white" : ""}">${row.Title}</td>
                            <td class="${localStorage.getItem("sort") == "Acc (%)" ? "text-white" : ""}">${row["Acc (%)"]}</td>
                            <td class="${localStorage.getItem("sort") == "✰R" ? "text-white" : ""}">${row["✰R"]}</td>
                            <td class="${localStorage.getItem("sort") == "CS" ? "text-white" : ""}">${row.CS}</td>
                            <td class="${localStorage.getItem("sort") == "AR" ? "text-white" : ""}">${row.AR}</td>
                            <td class="${localStorage.getItem("sort") == "Length" ? "text-white" : ""} rounded-r pr-2">${row.Length}</td>
                        </tr>
                    `;
        });
        resolve(html);
      });
    }
  } else if (request.readyState == 4 && request.status == 400) {
    tbody.innerHTML = `
            <tr class="text-white bg-[#2f382e] h-2 hover:duration-150 duration-300 hover:saturate-200 hover:drop-shadow-sm whitespace-nowrap  hover:scale-110">
                <td class='opacity-30'>Failed to load</td>
            </tr>
        `;
  }
};

let onChangeView = (args) => {
  if (localStorage.getItem("sort") != args) {
    if (args) {
      localStorage.setItem("sort", args);
    } else if (!localStorage.getItem("sort")) {
      localStorage.setItem("sort", "SR");
    }
    request.open("GET", "https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=1043073592", true);
    request.send();
  }
};

onChangeView();
