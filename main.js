var form = document.getElementById('my-form');
var itemList = document.getElementById('items');
var userDetailsList = [];
var totalValue = 0; // Variable to store the total value

form.addEventListener('submit', onSubmit);
itemList.addEventListener('click', deleteItem); // Add event listener to the item list

function onSubmit(e) {
    e.preventDefault();
    var price = parseFloat(document.getElementById('selling').value); // Parse float to handle decimal values
    var name = document.getElementById('product').value;
    var li = createListItem(price, name);
    itemList.appendChild(li);

    var userDetails = {
        price: price,
        name: name
    }

    // Save the new item to the API
    axios.post("https://crudcrud.com/api/10e142c7a027485e92625067a8c1fe4e/sellingprice", userDetails)
        .then((res) => {
            console.log(res);
            // Update the JavaScript variable with the new data
            userDetails._id = res.data._id;
            userDetailsList.push(userDetails);
            // Update totalValue by adding the new price
            totalValue += price;
            // Update the total value in the API
            updateTotalValueInAPI(totalValue);
            // Update the total value in the UI
            updateTotalValueUI(totalValue);
        })
        .catch((err) => {
            console.log(err);
        });

    form.reset();
}

function createListItem(price, name, itemId) {
    var li = document.createElement('li');
    li.className = 'list-group';
    li.appendChild(document.createTextNode(price.toFixed(2))); // Display price with two decimal places
    li.appendChild(document.createTextNode(" " + name + " "));
    li.setAttribute('data-item-id', itemId); // Use 'data-item-id' attribute to store the item ID

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn delete'; // Add delete class to the button
    deleteBtn.appendChild(document.createTextNode('delete Product'));

    li.appendChild(deleteBtn);
    return li;
}

function deleteItem(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Are you sure you want to delete this product?')) {
            var li = e.target.parentElement;
            var listItemPrice = parseFloat(li.childNodes[0].textContent);
            itemList.removeChild(li);

            // Delete the item from the API
            var itemId = li.getAttribute('data-item-id');
            axios.delete(`https://crudcrud.com/api/10e142c7a027485e92625067a8c1fe4e/sellingprice/${itemId}`)
                .then((res) => {
                    console.log(res);
                    // Update the JavaScript variable after successful deletion
                    userDetailsList = userDetailsList.filter(user => user._id !== itemId);
                    // Update totalValue by subtracting the deleted price
                    totalValue -= listItemPrice;
                    // Update the total value in the API
                    updateTotalValueInAPI(totalValue);
                    // Update the total value in the UI
                    updateTotalValueUI(totalValue);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}

function updateTotalValueInAPI(value) {
    // Update the total value in the API
    
    axios.put(`https://crudcrud.com/api/10e142c7a027485e92625067a8c1fe4e/totalvalue`, { totalValue: value })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
}

function updateTotalValueUI(value) {
    // Update the total value in the UI
    
    var totalValueElement = document.getElementById('total-value');
    totalValueElement.textContent = 'Total Value Worth of Products: Rs ' + value.toFixed(2);
}

function loadItems() {
    // Fetch data from the API and display the list items
    axios.get("https://crudcrud.com/api/10e142c7a027485e92625067a8c1fe4e/sellingprice")
        .then((response) => {
            var data = response.data;
            userDetailsList = data; // Update the JavaScript variable with the fetched data
            // Create and append list items using a for loop
            for (var i = 0; i < data.length; i++) {
                var user = data[i];
                var li = createListItem(user.price, user.name, user._id);
                li.setAttribute('data-item-id', user._id);
                itemList.appendChild(li);
                // Calculate totalValue when loading items
                totalValue += user.price;
            }
            // Update the total value in the UI
            updateTotalValueUI(totalValue);
            // Update the total value in the API
            updateTotalValueInAPI(totalValue);
        })
        .catch((error) => {
            console.log(error);
        });
}

// Load items from the API when the page loads
loadItems();
