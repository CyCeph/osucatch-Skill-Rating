let data = [];
let order = [];

/*Note from K3: Would recommend deleting the notes if it no longer serves the function for understanding the code/etcs.
  Note from K3: I noticed that you have been using `function name() {}` and `let name = () => {};`. Would recommend you choose
                one over the other for readability and consistency since both of these do the exact same thing and can be called
                the same way with `name();`. I would argue that `let name = () => {}` is better over the `function name() {}`
                because it's more simple to read, consistent with dynamic-typed variables and easier to understand that the variable is a function.*/
let showData = async () => {
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = `
    <tr class="text-white bg-[#2f382e] h-2 hover:duration-150 duration-300 hover:saturate-200 hover:drop-shadow-sm whitespace-nowrap  hover:scale-110">
        <td class='opacity-30'>Loading</td>
    </tr>
  `;
  if (data.length > 0) {
    let sortJson = (json) => {
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
              //TODO from K3: Include all necessary Titles (see note in `order of titles` note)
              let indexOfA = order.indexOf(a[localStorage.getItem("sort")]);
              let indexOfB = order.indexOf(b[localStorage.getItem("sort")]);
              //TODO: Figure out Dan order. Currently set after Honorary GM and is not sorted by in correct order.
              //TODO from K3: use gid=637350582 for the Dan and others.
              return indexOfA > indexOfB ? 1 : indexOfA < indexOfB ? -1 : 0;
            case "Usernames":
              return a[localStorage.getItem("sort")].localeCompare(b[localStorage.getItem("sort")]);
            default:
              return parseFloat(b.SR.replace(",", "")) - parseFloat(a.SR.replace(",", ""));
          }
        });
        resolve(json);
      });
    };

    let createTable = (sortedJson) => {
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
    };

    let sortedData = await sortJson(data);
    tbody.innerHTML = await createTable(sortedData);
  } else {
    tbody.innerHTML = `
      <tr class="text-white bg-[#2f382e] h-2 hover:duration-150 duration-300 hover:saturate-200 hover:drop-shadow-sm whitespace-nowrap  hover:scale-110">
          <td class='opacity-30'>Failed to load</td>
      </tr>
    `;
  }
};

let onChangeView = (args) => {
  if (args) {
    localStorage.setItem("sort", args);
  } else if (!localStorage.getItem("sort")) {
    localStorage.setItem("sort", "SR");
  }
  showData();
};

// data of users
let request = new XMLHttpRequest();
request.onreadystatechange = async () => {
  if (request.readyState == 4 && request.status == 200) {
    data = await csv().fromString(request.responseText);
    onChangeView();
  } else if (request.readyState == 4 && request.status != 200) {
    onChangeView();
  }
};
request.open("GET", "https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=1043073592", true);
request.send();

// order of titles
/*Note from K3: Would also recommend that the spreadsheet information based on the Title is consistent: there are no information on "Honorary GM" and "Untitled" (plus
                "GM Candidate" is "Grandmaster Candidate" which can make this a bit annoying and is recommended to choose one over the other
                for better automation) which if it should be title, it should be mentioned. The reason for this is that we can let the computer do all the processing for the order without
                having to update it each time for both the source code of the spreadsheets and javascript. Only the spreadsheets will need to be updated and the javascript
                will just refer to the spreadsheets based on the information.*/
let getOrder = new XMLHttpRequest();
getOrder.onreadystatechange = async () => {
  if (getOrder.readyState == 4 && getOrder.status == 200) {
    let orderInformation = await csv().fromString(getOrder.responseText);
    let found = false;
    orderInformation.every((obj) => {
      if (obj.field2 == "" && found) {
        return false;
      } else if (found) {
        order.push(obj.field2);
      } else if (obj.field2 == "Title" && !found) {
        found = true;
      }
      return true;
    });
  }
};
getOrder.open("GET", "https://docs.google.com/spreadsheets/d/1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc/export?format=csv&id=1s-ItBZwDzWb_taDPD2L2jrUbNzl4pxjSgXcE5dza4tc&gid=308409034", true);
getOrder.send();
