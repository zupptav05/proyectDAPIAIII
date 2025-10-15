var productos = [
    { id: 1, nombre: "Auriculares Sony", precio: 1200, categoria: "auriculares", imagen: "https://picsum.photos/id/1010/200" },
    { id: 2, nombre: "Laptop Lenovo", precio: 9500, categoria: "laptops", imagen: "https://picsum.photos/id/1001/200" },
    { id: 3, nombre: "Mouse inalámbrico", precio: 350, categoria: "accesorios", imagen: "https://picsum.photos/id/1002/200" },
    { id: 4, nombre: "Teclado mecánico", precio: 700, categoria: "accesorios", imagen: "https://picsum.photos/id/1003/200" },
    { id: 5, nombre: "Laptop HP", precio: 11500, categoria: "laptops", imagen: "https://picsum.photos/id/1004/200" },
    { id: 6, nombre: "Auriculares JBL", precio: 1300, categoria: "auriculares", imagen: "https://picsum.photos/id/1005/200" }
];
var carrito = [];
var usuarios = [];
var usuarioActivo = null;
function renderCatalogo(filtro) {
    if (filtro === void 0) { filtro = "todos"; }
    var contenedor = document.getElementById("catalogo");
    contenedor.innerHTML = "";
    var filtrados = filtro === "todos" ? productos : productos.filter(function (p) { return p.categoria === filtro; });
    filtrados.forEach(function (p) {
        var div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = "\n      <img src=\"".concat(p.imagen, "\" alt=\"").concat(p.nombre, "\">\n      <h3>").concat(p.nombre, "</h3>\n      <p>$").concat(p.precio, "</p>\n      <button onclick=\"agregarAlCarrito(").concat(p.id, ")\">Agregar al carrito</button>\n    ");
        contenedor.appendChild(div);
    });
}
function agregarAlCarrito(id) {
    var prod = productos.find(function (p) { return p.id === id; });
    if (!prod)
        return;
    var item = carrito.find(function (i) { return i.producto.id === id; });
    if (item)
        item.cantidad++;
    else
        carrito.push({ producto: prod, cantidad: 1 });
    renderCarrito();
}
function renderCarrito() {
    var tabla = document.getElementById("tablaCarrito");
    tabla.innerHTML = "\n    <tr>\n      <th>Producto</th>\n      <th>Precio</th>\n      <th>Cantidad</th>\n      <th>Subtotal</th>\n      <th>Acciones</th>\n    </tr>\n  ";
    var total = 0;
    carrito.forEach(function (item) {
        var subtotal = item.producto.precio * item.cantidad;
        total += subtotal;
        var fila = document.createElement("tr");
        fila.innerHTML = "\n      <td>".concat(item.producto.nombre, "</td>\n      <td>$").concat(item.producto.precio, "</td>\n      <td>").concat(item.cantidad, "</td>\n      <td>$").concat(subtotal, "</td>\n      <td class=\"acciones\">\n        <button onclick=\"aumentar(").concat(item.producto.id, ")\">+</button>\n        <button onclick=\"disminuir(").concat(item.producto.id, ")\">-</button>\n        <button onclick=\"eliminar(").concat(item.producto.id, ")\">Eliminar</button>\n      </td>\n    ");
        tabla.appendChild(fila);
    });
    var totalDiv = document.getElementById("total");
    totalDiv.textContent = "Total: $".concat(total);
}
function aumentar(id) {
    var item = carrito.find(function (i) { return i.producto.id === id; });
    if (item)
        item.cantidad++;
    renderCarrito();
}
function disminuir(id) {
    var item = carrito.find(function (i) { return i.producto.id === id; });
    if (item && item.cantidad > 1)
        item.cantidad--;
    renderCarrito();
}
function eliminar(id) {
    carrito = carrito.filter(function (i) { return i.producto.id !== id; });
    renderCarrito();
}
function mostrarRegistro() {
    var div = document.getElementById("auth");
    div.innerHTML = "\n    <h3>Registro</h3>\n    <input id=\"nombre\" placeholder=\"Nombre\">\n    <input id=\"email\" placeholder=\"Email\">\n    <input id=\"password\" type=\"password\" placeholder=\"Contrase\u00F1a\">\n    <button onclick=\"registrar()\">Registrar</button>\n  ";
}
function mostrarLogin() {
    var div = document.getElementById("auth");
    div.innerHTML = "\n    <h3>Login</h3>\n    <input id=\"emailLogin\" placeholder=\"Email\">\n    <input id=\"passwordLogin\" type=\"password\" placeholder=\"Contrase\u00F1a\">\n    <button onclick=\"login()\">Iniciar Sesi\u00F3n</button>\n  ";
}
function registrar() {
    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if (!nombre || !email || !password) {
        alert("Complete todos los campos");
        return;
    }
    var nuevo = { id: usuarios.length + 1, nombre: nombre, email: email, password: password };
    usuarios.push(nuevo);
    alert("Usuario registrado correctamente");
}
function login() {
    var email = document.getElementById("emailLogin").value;
    var password = document.getElementById("passwordLogin").value;
    var user = usuarios.find(function (u) { return u.email === email && u.password === password; });
    if (user) {
        usuarioActivo = user;
        alert("Bienvenido, ".concat(user.nombre));
        var div = document.getElementById("auth");
        div.innerHTML = "<p>Usuario activo: <strong>".concat(user.nombre, "</strong></p>");
    }
    else {
        alert("Credenciales inválidas");
    }
}
function comprar() {
    if (!usuarioActivo) {
        alert("Debe iniciar sesión para comprar.");
        return;
    }
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    mostrarTicket();
}
function mostrarTicket() {
    var ticket = document.getElementById("ticket");
    var contenido = document.getElementById("ticketContenido");
    var total = 0;
    var html = "<table><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>";
    carrito.forEach(function (item) {
        var sub = item.cantidad * item.producto.precio;
        total += sub;
        html += "<tr><td>".concat(item.producto.nombre, "</td><td>$").concat(item.producto.precio, "</td><td>").concat(item.cantidad, "</td><td>$").concat(sub, "</td></tr>");
    });
    html += "</table><h3>Total: $".concat(total, "</h3><p>Gracias por su compra, ").concat(usuarioActivo === null || usuarioActivo === void 0 ? void 0 : usuarioActivo.nombre, "!</p>");
    contenido.innerHTML = html;
    ticket.style.display = "block";
}
function filtrarCategoria() {
    var categoria = document.getElementById("categoriaSelect").value;
    renderCatalogo(categoria);
}
;
window.agregarAlCarrito = agregarAlCarrito;
window.aumentar = aumentar;
window.disminuir = disminuir;
window.eliminar = eliminar;
window.mostrarLogin = mostrarLogin;
window.mostrarRegistro = mostrarRegistro;
window.registrar = registrar;
window.login = login;
window.comprar = comprar;
window.filtrarCategoria = filtrarCategoria;
renderCatalogo();
