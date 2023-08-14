"use strict";
var form = document.getElementById('my-form');
var itemList = document.getElementById('items');
var userDetailsList = [];
var totalValue = 0.00; // Variable to store the total value

form.addEventListener('submit', onSubmit);
itemList.addEventListener('click', deleteItem); // Add event listener to the item list
async function onSubmit(e) {
    e.preventDefault();
    var price = parseFloat(document.getElementById('selling').value);
    var name = document.getElementById('product').value;
    var li = createListItem(price, name);
    itemList.appendChild(li);

    var userDetails = {
        price: price,
        name: name
    }

    try {
        const response = await axios.post("https://crudcrud.com/api/2c97b74e219f462b83d1a8fcd8234f3d/sellingprice", userDetails);
        console.log(response);
        userDetails._id = response.data._id;

        totalValue += price;
        await updateTotalValueInAPI(totalValue);
        updateTotalValueUI(totalValue);
    } catch (error) {
        console.log(error);
    }

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

async function deleteItem(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Are you sure you want to delete this product?')) {
            var li = e.target.parentElement;
            var listItemPrice = parseFloat(li.childNodes[0].textContent);
            itemList.removeChild(li);

            var itemId = li.getAttribute('data-item-id');

            try {
                const response = await axios.delete(`https://crudcrud.com/api/2c97b74e219f462b83d1a8fcd8234f3d/sellingprice/${itemId}`);
                console.log(response);
                totalValue -= listItemPrice;
                await updateTotalValueInAPI(totalValue);
                updateTotalValueUI(totalValue);
            } catch (error) {
                console.log(error);
            }
        }
    }
}


async function updateTotalValueInAPI(value) {
    try {
        const response = await axios.put(`https://crudcrud.com/api/2c97b74e219f462b83d1a8fcd8234f3d/totalvalue`, { totalValue: value });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

function updateTotalValueUI(value) {
    // Update the total value in the UI
    
    var totalValueElement = document.getElementById('total-value');
    totalValueElement.textContent = 'Total Value Worth of Products: Rs ' + value.toFixed(2);
}

async function loadItems() {
    try {
        const response = await axios.get("https://crudcrud.com/api/2c97b74e219f462b83d1a8fcd8234f3d/sellingprice");
        var data = response.data;
        userDetailsList = data;

        for (var i = 0; i < data.length; i++) {
            var user = data[i];
            var li = createListItem(user.price, user.name, user._id);
            li.setAttribute('data-item-id', user._id);
            itemList.appendChild(li);
            totalValue += user.price;
        }
        updateTotalValueUI(totalValue);
        await updateTotalValueInAPI(totalValue);
    } catch (error) {
        console.log(error);
    }
}


// Load items from the API when the page loads
loadItems();
//updated  code
