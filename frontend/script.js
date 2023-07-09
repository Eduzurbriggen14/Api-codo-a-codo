document.addEventListener("DOMContentLoaded", function () {
  const productosTable = document.getElementById("productosTable");
  const productosBody = document.getElementById("productosBody");
  const formulario = document.getElementById("formulario");
  const codigoInput = document.getElementById("codigo");
  const nombreInput = document.getElementById("nombre");
  const descripcionInput = document.getElementById("descripcion");
  const precioInput = document.getElementById("precio");
  const stockInput = document.getElementById("stock");
  const categoriaInput = document.getElementById("categoria");
  const imagenInput = document.getElementById("imagen");

  const ventanaEmergente = document.getElementById("ventanaEmergente");
  const formularioEditar = document.getElementById("formularioEditar");
  const codigoEditarInput = document.getElementById("codigoEditar");
  const nombreEditarInput = document.getElementById("nombreEditar");
  const descripcionEditarInput = document.getElementById("descripcionEditar");
  const precioEditarInput = document.getElementById("precioEditar");
  const stockEditarInput = document.getElementById("stockEditar");
  const categoriaEditarInput = document.getElementById("categoriaEditar");
  const imagenEditarInput = document.getElementById("imagenEditar");

  const ventanaFormulario = document.getElementById("ventanaFormulario");

  const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
  btnMostrarFormulario.addEventListener("click", mostrarFormulario);

  const btnAgregarFormulario = document.getElementById("btnAgregarFormulario");
  btnAgregarFormulario.addEventListener("click", agregarProducto);

  const btnCancelarFormulario = document.getElementById(
    "btnCancelarFormulario"
  );
  btnCancelarFormulario.addEventListener("click", cancelarAgregarProducto);

  const btnCerrar = document.getElementById("btnCerrar");
  btnCerrar.addEventListener("click", ocultarFormularioEditar);

  obtenerProductos();

  function mostrarFormulario() {
    ventanaFormulario.style.display = "block";
    formulario.style.display = "flex";
  }

  function cancelarAgregarProducto() {
    limpiarFormulario();
    ventanaFormulario.style.display = "none";
    formulario.style.display = "none";
  }

  function agregarProducto() {
    const producto = {
      nombre: nombreInput.value,
      descripcion: descripcionInput.value,
      precio: precioInput.value,
      stock: stockInput.value,
      categoria: categoriaInput.value,
      imagen: imagenInput.value,
    };

    fetch("http://127.0.0.1:5000/producto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((data) => {
        obtenerProductos();
        limpiarFormulario();
        cancelarAgregarProducto();  //----------------------------------------------------------------
      })
      .catch((error) => console.log(error));
  }

  function obtenerProductos() {
    fetch("http://127.0.0.1:5000/productos")
      .then((response) => response.json())
      .then((data) => {
        mostrarProductos(data);
      })
      .catch((error) => console.log(error));
  }

  function mostrarProductos(productos) {
    productosBody.innerHTML = "";

    productos.forEach((producto) => {
      const row = document.createElement("tr");
      row.setAttribute("data-codigo", producto.codigo);

      const codigoCell = document.createElement("td");
      codigoCell.textContent = producto.codigo;
      row.appendChild(codigoCell);

      const nombreCell = document.createElement("td");
      nombreCell.textContent = producto.nombre;
      row.appendChild(nombreCell);

      const descripcionCell = document.createElement("td");
      descripcionCell.textContent = producto.descripcion;
      row.appendChild(descripcionCell);

      const precioCell = document.createElement("td");
      precioCell.textContent = producto.precio;
      row.appendChild(precioCell);

      const stockCell = document.createElement("td");
      stockCell.textContent = producto.stock;
      row.appendChild(stockCell);

      const categoriaCell = document.createElement("td");
      categoriaCell.textContent = producto.categoria;
      row.appendChild(categoriaCell);

      const imagenCell = document.createElement("td");
      const imagen = document.createElement("img");
      imagen.src = producto.imagen;
      imagen.alt = producto.nombre;
      imagenCell.appendChild(imagen);
      row.appendChild(imagenCell);

      const accionesCell = document.createElement("td");

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.addEventListener("click", editarProducto);
      accionesCell.appendChild(btnEditar);

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", eliminarProducto);
      accionesCell.appendChild(btnEliminar);

      row.appendChild(accionesCell);

      productosBody.appendChild(row);
    });
  }

  function editarProducto(event) {
    if (
      event.target.tagName === "BUTTON" &&
      event.target.textContent === "Editar"
    ) {
      const row = event.target.closest("tr");
      const codigo = row.dataset.codigo;

      // Obtener los datos del producto de la fila correspondiente
      //const codigo =row.querySelector("td:nth-child(1)").textContent
      const nombre = row.querySelector("td:nth-child(2)").textContent;
      const descripcion = row.querySelector("td:nth-child(3)").textContent;
      const precio = row.querySelector("td:nth-child(4)").textContent;
      const stock = row.querySelector("td:nth-child(5)").textContent;
      const categoria = row.querySelector("td:nth-child(6)").textContent;
      const imagen = row.querySelector("img").src;

      // Cargar los datos del producto en el formulario de edición
      // const codigoEditarInput = document.getElementById("codigoEditar");
      // const nombreEditarInput = document.getElementById("nombreEditar");
      // const descripcionEditarInput = document.getElementById("descripcionEditar");
      // const precioEditarInput = document.getElementById("precioEditar");
      // const stockEditarInput = document.getElementById("stockEditar");
      // const categoriaEditarInput = document.getElementById("categoriaEditar");
      // const imagenEditarInput = document.getElementById("imagenEditar");

      codigoEditarInput.value = codigo;
      nombreEditarInput.value = nombre;
      descripcionEditarInput.value = descripcion;
      precioEditarInput.value = precio;
      stockEditarInput.value = stock;
      categoriaEditarInput.value = categoria;
      imagenEditarInput.value = imagen;

    ventanaEmergente.style.display = "flex";
    formularioEditar.style.display = "block";

    const btnActualizar = document.getElementById("btnActualizar");
    btnActualizar.addEventListener("click", actualizarProducto);

    const btnCancelar = document.getElementById("btnCancelar");
    btnCancelar.addEventListener("click", cancelarEdicion);
  }}

  function actualizarProducto() {
    const codigo = codigoEditarInput.value;
    const nombre = nombreEditarInput.value;
    const descripcion = descripcionEditarInput.value;
    const precio = precioEditarInput.value;
    const stock = stockEditarInput.value;
    const categoria = categoriaEditarInput.value;
    const imagen = imagenEditarInput.value;

    const producto = {
      codigo: codigo,
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      stock: stock,
      categoria: categoria,
      imagen: imagen,
    };

    fetch(`http://127.0.0.1:5000/update/${codigo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((data) => {
        obtenerProductos();
        limpiarFormulario();
        ventanaEmergente.style.display = "none";
        formularioEditar.style.display = "none";
      })
      .catch((error) => console.log(error));
  }

  function cancelarEdicion() {
    limpiarFormulario();
    ventanaEmergente.style.display = "none";
    formularioEditar.style.display = "none";
  }

  function ocultarFormularioEditar() {
    ventanaEmergente.style.display = "none";
    formularioEditar.style.display = "none";
  }

  function eliminarProducto(event) {
    const codigo = event.target.closest("tr").getAttribute("data-codigo");

    fetch(`http://127.0.0.1:5000/delete/${codigo}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        obtenerProductos();
        limpiarFormulario();
      })
      .catch((error) => console.log(error));
  }

  function limpiarFormulario() {
    nombreInput.value = "";
        descripcionInput.value = "";
        precioInput.value = "";
        stockInput.value = "";
        categoriaInput.value = "";
        imagenInput.value = "";
  }
});
