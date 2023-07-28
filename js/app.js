let stock;
let totalFormateado;

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("./js/stock.json")
    .then((response) => response.json())
    .then((productos) => {
        dibujarProductos(productos);
        stock = productos;
        mostrarCarrito();
        finalizarCompra()
    })


const contenedor = document.getElementById("section-cards")

///Dibujo las tarjetas de los productos
function dibujarProductos(productos) {

    contenedor.innerHTML = "";

    const div = document.createElement("div")
    div.classList.add("contenedor")

    contenedor.appendChild(div);

    productos.forEach((elemento) => {

        const card = document.createElement("div")
        card.classList.add("contenedor-items")

        card.innerHTML = `
        <img src="${elemento.imagen}" alt="${elemento.alt}" class="img-card">
        <div class="info">
        <h2 class="nombre">${elemento.nombre}</h2>
        <p class="precio">$${elemento.precio}</p>
        <button id="${elemento.id}" class="agregar">Agregar</button>
    </div>
        `
        div.appendChild(card)

        const agregar = document.getElementById(elemento.id)

        agregar.addEventListener("click", () => {
            agregarCarrito(elemento.id)
        })

    })
}

//Evento para buscar productos
const buscador = document.getElementById("buscador")

buscador.addEventListener("keyup", () => {
    const filtro = stock.filter(prod => prod.nombre.toLowerCase().includes(buscador.value.toLowerCase()))
    dibujarProductos(filtro)
})



///Se agregan los productos al local storage
function agregarCarrito(item) {
    if (!carrito.some((it) => it.id === item)) {
        let itemNuevo = stock.find((elemento) => elemento.id === item)
        carrito.push({ ...itemNuevo, cantidad: 1 })
    } else {
        let itemNuevo = carrito.find((elemento) => elemento.id === item)
        itemNuevo.cantidad++
    }
    localStorage.setItem("carrito", JSON.stringify(carrito))
    mostrarCarrito()
}

///Se dibujan los productos del carrito en la pagina
function mostrarCarrito() {
    const elementosCarrito = document.getElementById("elementos-carrito")
    elementosCarrito.innerHTML = ""

    const totalCarrito = document.getElementById("total-carrito");
    calculoTotal(totalCarrito)


    if (carrito.length > 0) {
        carrito.forEach(product => {
            const tarjetasCarrito = document.createElement("div")
            tarjetasCarrito.classList.add("tarjetas-carrito")
            tarjetasCarrito.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" class="img-card">
            <div class="info">
            <h2 class="nombre-carrito">${product.nombre}</h2>
            <p class="precio-carrito">$${product.precio}</p>
            <p class="cantidad">Cantidad: ${product.cantidad}</p>
            </div>
            <div class="contador">
            <button id="sumar-${product.id}" class="boton-sumar">+</button>
            <button id="bajar-${product.id}" class="boton-restar">-</button>
            </div>
            <button id="eliminar-${product.id}" class="boton-eliminar"><ion-icon name="trash-outline"></ion-icon></button>
            `;
            elementosCarrito.appendChild(tarjetasCarrito)

            const incrementar = document.getElementById(`sumar-${product.id}`)
            incrementar.addEventListener("click", () => {
                incrementarProductos(product.id)
            })

            const decrementar = document.getElementById(`bajar-${product.id}`)
            decrementar.addEventListener("click", () => {
                decrementarProductos(product.id)
            })

            const eliminar = document.getElementById(`eliminar-${product.id}`)
            eliminar.addEventListener("click", () => {
                eliminarProductos(product.id)
            })

        })

    } else {
        elementosCarrito.innerHTML = `<h2 class="carrito-vacio">No hay items en el carrito</h2>`
    }
}

///Funcionalidad para boton de incrementar
function incrementarProductos(id) {
    const producto = carrito.find((producto) => producto.id === id);
    producto.cantidad++;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

///Funcionalidad para boton decrementar
function decrementarProductos(id) {
    const producto = carrito.find((elemento) => elemento.id === id);
    if (producto.cantidad === 1) {
        eliminarProductos(producto.id)
    } else {
        producto.cantidad--;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }
}

///Funcionalidd para boton de eliminar
function eliminarProductos(id) {
    carrito = carrito.filter((producto) => producto.id !== id)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    mostrarCarrito()
}

///Funcionalidad para calcular total
function calculoTotal(producto) {
    const total = carrito.reduce((acc, elemento) => acc + elemento.precio * elemento.cantidad, 0);
    totalFormateado = total.toLocaleString();
    total === 0 ? producto.textContent = ` ` : producto.textContent = `El total de su compra es: $${totalFormateado}`;
}

function finalizarCompra() {
    const btnFinalizar = document.getElementById("btn-finalizar");
    btnFinalizar.onclick = () => {
        Swal.fire(
            'Compra finalizada',
            `El monto total es de: $${totalFormateado}`,
            'success'
        );
    };
}
