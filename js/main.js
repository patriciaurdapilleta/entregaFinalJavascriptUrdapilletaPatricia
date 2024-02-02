// Definición de la variable global "productos"
let productos = [];

// Fetch para obtener los productos desde el archivo JSON
fetch("../productos.json")
    .then(response => response.json())  // Parsea la respuesta JSON
    .then(data => {
        productos = data;  // Almacena los productos en la variable global
    })
    .then(() => cargarProductos(productos))  // Carga los productos en la interfaz
    .catch(error => console.error('Error al cargar el archivo JSON:', error));  // Manejo de errores con catch

// Selección de elementos del DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const btnsCategorias = document.querySelectorAll(".btn-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let btnsAgregar = document.querySelectorAll(".producto-agregar");
const contador = document.querySelector("#contador");

// Asigna un listener a cada botón de categoría para filtrar productos
btnsCategorias.forEach(btn => {
    btn.addEventListener("click", (e) => {
    btnsCategorias.forEach(btn => btn.classList.remove("active"));

    e.currentTarget.classList.add("active");

    if (e.currentTarget.id != "todos") {
        const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
        tituloPrincipal.innerText = productoCategoria.categoria.nombre;
        const productosBtn = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
    
        cargarProductos(productosBtn);
    } else {
        tituloPrincipal.innerText = "Todos los productos";
        cargarProductos(productos);
    }
})
});

// Función para cargar productos en la interfaz
function cargarProductos(productosSeleccionados) {
    contenedorProductos.innerHTML = "";

    productosSeleccionados.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
        actualizarBtnsAgregar();
    });

    // Asigna un listener a cada botón "Agregar al carrito"
    btnsAgregar.forEach(btn => {
        btn.addEventListener("click", agregarAlCarrito);
    });
}

// Función para actualizar el estado de los botones "Agregar al carrito"
function actualizarBtnsAgregar() {
    btnsAgregar = document.querySelectorAll(".producto-agregar");
}

// Inicialización de la variable de productos en el carrito desde el almacenamiento local
let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarContador();
} else {
    productosEnCarrito = [];
}

// Función para agregar un producto al carrito
function agregarAlCarrito(e) {
    // Muestra un mensaje de notificación (toast) al agregar un producto
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        // Configuración de estilos del toast
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        // Posición del toast en la interfaz
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
    }).showToast();

    // Obtiene el ID del producto a partir del botón clickeado
    const idbtn = e.currentTarget.id;
    // Busca el producto correspondiente en la lista de productos
    const productoAgregado = productos.find(producto => producto.id === idbtn);

    // Verifica si el producto ya está en el carrito
    if (productosEnCarrito.some(producto => producto.id === idbtn)) {
        // Si existe, incrementa la cantidad
        const index = productosEnCarrito.findIndex(producto => producto.id === idbtn);
        productosEnCarrito[index].cantidad++;
    } else {
        // Si no existe, agrega el producto al carrito con cantidad 1
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    // Actualiza el contador del carrito y guarda la información en el almacenamiento local
    actualizarContador();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Función para actualizar el contador del carrito
function actualizarContador() {
    let nuevoContador = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    contador.innerText = nuevoContador;
}
