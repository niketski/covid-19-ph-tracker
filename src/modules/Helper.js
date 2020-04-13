export default class Helper {
       
    formatNumber(string) {
        return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    sortableTable(tableSelector) {
        
        function sortTableByColumn(table, column, asc = true) {
            const dirModifier = asc ? 1 : -1;
            const tBody = table.tBodies[0];
            const rows  = Array.from(tBody.querySelectorAll('tr')); 

            // sorted rows
            const sortedRows = rows.sort((a, b) => {
                const columnA = a.querySelector(`td:nth-child(${ column + 1}), th:nth-child(${ column + 1})`).textContent.trim();
                const columnB = b.querySelector(`td:nth-child(${ column + 1}), th:nth-child(${ column + 1})`).textContent.trim();
            
                return columnA < columnB ? (-1 * dirModifier) : (1 * dirModifier);
            });

            // remove existing rows
            while(tBody.firstChild) {
               tBody.removeChild(tBody.firstChild);
            }
            
            //append sorted rows
            tBody.append(...sortedRows)

            //remember how the column is currently sorted
            table.querySelectorAll('thead th').forEach(th => th.classList.remove('table-sort-asc', 'table-sort-des'));
            table.querySelector(`thead th:nth-child(${column + 1})`).classList.toggle('table-sort-asc', asc);
            table.querySelector(`thead th:nth-child(${column + 1})`).classList.toggle('table-sort-des', !asc);
        }

        //apply sorting to the specified selector
        document.querySelector(tableSelector).querySelectorAll('thead th').forEach(headerCell => {
            headerCell.addEventListener('click', function() {
                const table        = headerCell.parentElement.parentElement.parentElement;
                const headingIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell); 

                console.log(table);
                console.log(headingIndex);
            });
        });;
    } 
}