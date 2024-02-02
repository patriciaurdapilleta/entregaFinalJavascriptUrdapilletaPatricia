// Obtener productos en el carrito desde el almacenamiento local o inicializar como array vacío
const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Seleccionar elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let btnsEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const btnVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const btnComprar = document.querySelector("#carrito-acciones-comprar");


// Función para cargar productos en el carrito
function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        // Mostrar elementos relacionados con productos en el carrito
        
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        // Limpiar el contenedor de productos antes de agregar nuevos elementos
        contenedorCarritoProductos.innerHTML = "";

        // Iterar sobre los productos en el carrito y agregar al DOM
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto");
            const elemento = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            div.innerHTML += elemento;
            contenedorCarritoProductos.append(div);
        });

        // Actualizar eventos de los botones de eliminar
        actualizarBtnsEliminar();

        // Actualizar el total
        actualizarTotal();
    } else {
        // Mostrar el contenedor vacío si no hay productos en el carrito
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// Función para actualizar eventos de los botones de eliminar
function actualizarBtnsEliminar() {
    btnsEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    btnsEliminar.forEach(btn => {
        btn.addEventListener("click", eliminarDelCarrito);
    });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
    const idbtn = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idbtn);

    productosEnCarrito.splice(index, 1);

    // Recargar la lista de productos en el carrito
    cargarProductosCarrito();

    // Actualizar el almacenamiento local con la nueva lista de productos en el carrito
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Evento para vaciar completamente el carrito
btnVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            // Vaciar el array de productos en el carrito
            productosEnCarrito.length = 0;

            // Actualizar el almacenamiento local con la lista de productos vacía
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Recargar la lista de productos en el carrito
            cargarProductosCarrito();
        }
    });
}

// Función para actualizar el total de la compra
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

// Evento para finalizar la compra
btnComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    // Vaciar el array de productos en el carrito
    productosEnCarrito.length = 0;

    // Actualizar el almacenamiento local con la lista de productos vacía
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Mostrar el contenedor de compra realizada y ocultar el resto
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}

// Cargar productos en el carrito al cargar la página
cargarProductosCarrito();
