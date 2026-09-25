const API_URL = '/items';

document.getElementById('item-form').addEventListener('submit', handleFormSubmit);

// Fetch items on initial load
document.addEventListener('DOMContentLoaded', fetchItems);

async function fetchItems() {
    try {
        const response = await fetch(API_URL);
        const items = await response.json();
        renderTable(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

function renderTable(items) {
    const tableBody = document.getElementById('items-table-body');
    const noDataEl = document.getElementById('no-data');
    tableBody.innerHTML = '';

    if (items.length === 0) {
        noDataEl.style.display = 'block';
        return;
    }
    noDataEl.style.display = 'none';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>
                <button class="btn btn-edit" onclick="editItem(${item.id}, '${item.name}', ${item.price})">Edit</button>
                <button class="btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;

    const itemData = { name, price: parseFloat(price) };

    try {
        if (id) {
            // Update mode
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData)
            });
        } else {
            // Create mode
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData)
            });
        }
        resetForm();
        fetchItems();
    } catch (error) {
        console.error('Error saving item:', error);
    }
}

function editItem(id, name, price) {
    document.getElementById('item-id').value = id;
    document.getElementById('item-name').value = name;
    document.getElementById('item-price').value = price;
    
    document.getElementById('form-title').innerText = 'Edit Item';
    document.getElementById('submit-btn').innerText = 'Update Item';
    document.getElementById('cancel-btn').classList.remove('hidden');
}

function resetForm() {
    document.getElementById('item-id').value = '';
    document.getElementById('item-form').reset();
    
    document.getElementById('form-title').innerText = 'Add New Item';
    document.getElementById('submit-btn').innerText = 'Save Item';
    document.getElementById('cancel-btn').classList.add('hidden');
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
}
