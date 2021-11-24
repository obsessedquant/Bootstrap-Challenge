// This function will be run at the start or refresh of the page
var myFilter = 5;
function read_data(myFilter) {
  let data = [];
  d3.json("stoch_rsi.json").then(function (stoch_rsi) {
    let tbody1 = d3.select("#tbody1");
    tbody1.html("");
    data = stoch_rsi.data.filter((x) => x[10] < myFilter);
    console.log("data", data);
    data.forEach((x) => {
      let row = tbody1.append("tr");
      Object.entries(x).forEach(([head, value]) =>
        row.append("td").text(value)
      );
    });
  });
  return data;
}
read_data(myFilter);

d3.json("ichimoku.json").then(function (ichimoku) {
  console.log("data", ichimoku);
  console.log("data.data", ichimoku.data);
  console.log("data.data[0]", ichimoku.data[0]);
  // console.log('data.ADX.keys'),data.ADX['3605'];

  let tbody2 = d3.select("#tbody2");

  ichimoku.data.forEach((x) => {
    let row = tbody2.append("tr");
    Object.entries(x).forEach(([head, value]) => row.append("td").text(value));
  });
});

/**
 * Sorts a HTML table.
 *
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending order
 */

function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    // console.log(a);
    // console.log(b);
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    // console.log(aColText);
    // console.log(bColText);

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  // console.log(sortedRows);
  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}

sortTableByColumn(document.querySelector("table"), 1, false);

document.querySelectorAll(".table-sortable th").forEach((headerCell) => {
  headerCell.addEventListener("click", () => {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );
    const currentIsAscending = headerCell.classList.contains("th-sort-asc");

    sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
  });
});
