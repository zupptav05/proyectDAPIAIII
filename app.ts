interface Producto {
  id: number
  nombre: string
  precio: number
  categoria: string
  imagen: string
}

interface Usuario {
  id: number
  nombre: string
  email: string
  password: string
}

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

let productos: Producto[] = [
  { id: 1, nombre: "Auriculares Sony", precio: 1200, categoria: "auriculares", imagen: "https://picsum.photos/id/1010/200" },
  { id: 2, nombre: "Laptop Lenovo", precio: 9500, categoria: "laptops", imagen: "https://picsum.photos/id/1001/200" },
  { id: 3, nombre: "Mouse inalámbrico", precio: 350, categoria: "accesorios", imagen: "https://picsum.photos/id/1002/200" },
  { id: 4, nombre: "Teclado mecánico", precio: 700, categoria: "accesorios", imagen: "https://picsum.photos/id/1003/200" },
  { id: 5, nombre: "Laptop HP", precio: 11500, categoria: "laptops", imagen: "https://picsum.photos/id/1004/200" },
  { id: 6, nombre: "Auriculares JBL", precio: 1300, categoria: "auriculares", imagen: "https://picsum.photos/id/1005/200" }
]

let carrito: ItemCarrito[] = []
let usuarios: Usuario[] = []
let usuarioActivo: Usuario | null = null

function renderCatalogo(filtro: string = "todos") {
  const contenedor = document.getElementById("catalogo") as HTMLDivElement
  contenedor.innerHTML = ""

  const filtrados = filtro === "todos" ? productos : productos.filter(p => p.categoria === filtro)

  filtrados.forEach(p => {
    const div = document.createElement("div")
    div.className = "producto"
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
    `
    contenedor.appendChild(div)
  })
}

function agregarAlCarrito(id: number) {
  const prod = productos.find(p => p.id === id)
  if (!prod) return

  const item = carrito.find(i => i.producto.id === id)
  if (item) item.cantidad++
  else carrito.push({ producto: prod, cantidad: 1 })

  renderCarrito()
}

function renderCarrito() {
  const tabla = document.getElementById("tablaCarrito") as HTMLTableElement
  tabla.innerHTML = `
    <tr>
      <th>Producto</th>
      <th>Precio</th>
      <th>Cantidad</th>
      <th>Subtotal</th>
      <th>Acciones</th>
    </tr>
  `

  let total = 0
  carrito.forEach(item => {
    const subtotal = item.producto.precio * item.cantidad
    total += subtotal
    const fila = document.createElement("tr")
    fila.innerHTML = `
      <td>${item.producto.nombre}</td>
      <td>$${item.producto.precio}</td>
      <td>${item.cantidad}</td>
      <td>$${subtotal}</td>
      <td class="acciones">
        <button onclick="aumentar(${item.producto.id})">+</button>
        <button onclick="disminuir(${item.producto.id})">-</button>
        <button onclick="eliminar(${item.producto.id})">Eliminar</button>
      </td>
    `
    tabla.appendChild(fila)
  })

  const totalDiv = document.getElementById("total") as HTMLHeadingElement
  totalDiv.textContent = `Total: $${total}`
}

function aumentar(id: number) {
  const item = carrito.find(i => i.producto.id === id)
  if (item) item.cantidad++
  renderCarrito()
}

function disminuir(id: number) {
  const item = carrito.find(i => i.producto.id === id)
  if (item && item.cantidad > 1) item.cantidad--
  renderCarrito()
}

function eliminar(id: number) {
  carrito = carrito.filter(i => i.producto.id !== id)
  renderCarrito()
}

function mostrarRegistro() {
  const div = document.getElementById("auth") as HTMLDivElement
  div.innerHTML = `
    <h3>Registro</h3>
    <input id="nombre" placeholder="Nombre">
    <input id="email" placeholder="Email">
    <input id="password" type="password" placeholder="Contraseña">
    <button onclick="registrar()">Registrar</button>
  `
}

function mostrarLogin() {
  const div = document.getElementById("auth") as HTMLDivElement
  div.innerHTML = `
    <h3>Login</h3>
    <input id="emailLogin" placeholder="Email">
    <input id="passwordLogin" type="password" placeholder="Contraseña">
    <button onclick="login()">Iniciar Sesión</button>
  `
}

function registrar() {
  const nombre = (document.getElementById("nombre") as HTMLInputElement).value
  const email = (document.getElementById("email") as HTMLInputElement).value
  const password = (document.getElementById("password") as HTMLInputElement).value

  if (!nombre || !email || !password) {
    alert("Complete todos los campos")
    return
  }

  const nuevo: Usuario = { id: usuarios.length + 1, nombre, email, password }
  usuarios.push(nuevo)
  alert("Usuario registrado correctamente")
}

function login() {
  const email = (document.getElementById("emailLogin") as HTMLInputElement).value
  const password = (document.getElementById("passwordLogin") as HTMLInputElement).value

  const user = usuarios.find(u => u.email === email && u.password === password)
  if (user) {
    usuarioActivo = user
    alert(`Bienvenido, ${user.nombre}`)
    const div = document.getElementById("auth") as HTMLDivElement
    div.innerHTML = `<p>Usuario activo: <strong>${user.nombre}</strong></p>`
  } else {
    alert("Credenciales inválidas")
  }
}

function comprar() {
  if (!usuarioActivo) {
    alert("Debe iniciar sesión para comprar.")
    return
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío.")
    return
  }

  mostrarTicket()
}

function mostrarTicket() {
  const ticket = document.getElementById("ticket") as HTMLDivElement
  const contenido = document.getElementById("ticketContenido") as HTMLDivElement

  let total = 0
  let html = "<table><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>"
  carrito.forEach(item => {
    const sub = item.cantidad * item.producto.precio
    total += sub
    html += `<tr><td>${item.producto.nombre}</td><td>$${item.producto.precio}</td><td>${item.cantidad}</td><td>$${sub}</td></tr>`
  })
  html += `</table><h3>Total: $${total}</h3><p>Gracias por su compra, ${usuarioActivo?.nombre}!</p>`

  contenido.innerHTML = html
  ticket.style.display = "block"
}

function filtrarCategoria() {
  const categoria = (document.getElementById("categoriaSelect") as HTMLSelectElement).value
  renderCatalogo(categoria)
}

;(window as any).agregarAlCarrito = agregarAlCarrito
;(window as any).aumentar = aumentar
;(window as any).disminuir = disminuir
;(window as any).eliminar = eliminar
;(window as any).mostrarLogin = mostrarLogin
;(window as any).mostrarRegistro = mostrarRegistro
;(window as any).registrar = registrar
;(window as any).login = login
;(window as any).comprar = comprar
;(window as any).filtrarCategoria = filtrarCategoria

renderCatalogo()
