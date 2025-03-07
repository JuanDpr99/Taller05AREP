const API_URL = 'http://localhost:8080/properties';  // URL del backend
let currentPage = 1;

// Cargar propiedades desde el backend con paginación
async function loadProperties(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        const data = await response.json();

        console.log("Datos recibidos:", data);

        const propertyTable = document.getElementById('property-table');
        propertyTable.innerHTML = '';

        data.forEach(property => {
            const row = `<tr>
                <td>${property.propertyId}</td>
                <td>${property.address}</td>
                <td>${property.price}</td>
                <td>${property.size}</td>
                <td>${property.description}</td>
                <td>
                    <button onclick="editProperty(${property.propertyId})">Editar</button>
                    <button onclick="deleteProperty(${property.propertyId})">Eliminar</button>
                </td>
            </tr>`;
            propertyTable.innerHTML += row;
        });

    } catch (error) {
        console.error('Error cargando propiedades:', error);
    }
}

// Buscar propiedad por dirección
async function searchProperty() {
    const searchValue = document.getElementById('search').value.trim();
    if (!searchValue || isNaN(searchValue)) {
        alert("Por favor ingresa un ID válido.");
        return;
    }

    try {
        console.log("Buscando propiedad con ID:", searchValue);
        const response = await fetch(`${API_URL}/${searchValue}`);

        if (!response.ok) throw new Error("Propiedad no encontrada.");

        const property = await response.json();
        console.log("Datos recibidos:", property);

        const tableBody = document.getElementById('property-table');
        tableBody.innerHTML = `
            <tr>
                <td>${property.propertyId}</td>
                <td>${property.address}</td>
                <td>${property.price}</td>
                <td>${property.size}</td>
                <td>${property.description}</td>
                <td>
                    <button onclick="editProperty(${property.propertyId})">Editar</button>
                    <button onclick="deleteProperty(${property.propertyId})">Eliminar</button>
                </td>
            </tr>
        `;
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        alert("No se encontró ninguna propiedad con ese ID.");
    }
}


// Aplicar filtros
async function applyFilters() {
    const location = document.getElementById('location').value.trim();
    const price = document.getElementById('price').value.trim();
    const size = document.getElementById('size').value.trim();

    // Ajustar los nombres de los parámetros si el backend usa otros nombres
    const params = new URLSearchParams();
    if (location) params.append('address', location);  // Asegura que coincida con el backend
    if (price) params.append('price', price);
    if (size) params.append('size', size);

    try {
        console.log("Aplicando filtros:", params.toString()); // Depuración
        const response = await fetch(`${API_URL}?${params.toString()}`);

        if (!response.ok) throw new Error("Error al filtrar propiedades.");

        const data = await response.json();
        console.log("Propiedades filtradas:", data);

        const tableBody = document.getElementById('property-table');
        if (data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6'>No se encontraron propiedades.</td></tr>";
            return;
        }

        tableBody.innerHTML = data.map(property => `
            <tr>
                <td>${property.propertyId}</td>
                <td>${property.address}</td>
                <td>${property.price}</td>
                <td>${property.size}</td>
                <td>${property.description}</td>
                <td>
                    <button onclick="editProperty(${property.propertyId})">Editar</button>
                    <button onclick="deleteProperty(${property.propertyId})">Eliminar</button>
                </td>
            </tr>`).join('');
    } catch (error) {
        console.error('Error aplicando filtros:', error);
        alert("Hubo un error al aplicar los filtros. Intenta nuevamente.");
    }
}


// Agregar una nueva propiedad
function showAddForm() {
    document.getElementById("add-property-form").classList.remove("hidden");
}

function closeForm() {
    document.getElementById("add-property-form").classList.add("hidden");
}

function saveProperty() {
    const address = document.getElementById("new-address").value.trim();
    const price = document.getElementById("new-price").value.trim();
    const size = document.getElementById("new-size").value.trim();
    const description = document.getElementById("new-description").value.trim();

    if (!address || !price || !size || !description) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const newProperty = {
        address,
        price: parseFloat(price),
        size: parseFloat(size),
        description
    };

    // Llamar a la API para guardar en el backend
    fetch("http://localhost:8080/properties", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProperty)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            addPropertyToTable(data); // Agrega la propiedad a la tabla
            closeForm();
            showFeedback("Propiedad agregada con éxito", "success");
        })
        .catch(error => {
            console.error("Error:", error);
            showFeedback("Error en la conexión con el servidor", "error");
        });

}


function addPropertyToTable(property) {
    const table = document.getElementById("property-table");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${property.propertyId}</td>
        <td>${property.address}</td>
        <td>${property.price}</td>
        <td>${property.size}</td>
        <td>${property.description}</td>
        <td>
            <button onclick="editProperty(${property.propertyId})">Editar</button>
            <button onclick="deleteProperty(${property.propertyId})">Eliminar</button>
        </td>
    `;

    table.appendChild(row);
}

function showFeedback(message, type) {
    const feedback = document.getElementById("feedback");
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    setTimeout(() => {
        feedback.className = "feedback hidden";
    }, 3000);
}

// Editar propiedad
async function editProperty(id) {
    try {
        // Obtener los datos actuales de la propiedad
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("No se pudo obtener la propiedad.");

        const property = await response.json();

        // Pedir nuevos valores con prompt (mostrando los valores actuales por defecto)
        const newAddress = prompt('Nueva dirección:', property.address);
        const newPrice = prompt('Nuevo precio:', property.price);
        const newSize = prompt('Nuevo tamaño:', property.size);
        const newDescription = prompt('Nueva descripción:', property.description);

        if (!newAddress || !newPrice || !newSize || !newDescription) {
            alert("Debes completar todos los campos.");
            return;
        }

        // Crear objeto con los valores actualizados
        const updatedProperty = {
            address: newAddress,
            price: parseFloat(newPrice),
            size: parseFloat(newSize),
            description: newDescription
        };

        // Enviar la actualización al backend
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProperty)
        });

        // Recargar la tabla
        loadProperties();
    } catch (error) {
        console.error('Error editando propiedad:', error);
    }
}

// Eliminar propiedad
async function deleteProperty(id) {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadProperties();
    } catch (error) {
        console.error('Error eliminando propiedad:', error);
    }
}

// Manejo de paginación
function nextPage() {
    currentPage++;
    loadProperties(currentPage);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadProperties(currentPage);
    }
}

// Cargar propiedades al inicio
loadProperties();
