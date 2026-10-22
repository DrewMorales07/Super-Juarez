document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formSoporte');
    const descripcion = document.getElementById('descripcion');
    const contadorCaracteres = document.getElementById('contadorCaracteres');
    const alertaExito = document.getElementById('alertaExito');
    const listaSolicitudes = document.getElementById('listaSolicitudes');

    // 1. Detectar el evento 'input' para contar caracteres de la descripción en tiempo real
    descripcion.addEventListener('input', () => {
        const cantidad = descripcion.value.length;
        contadorCaracteres.textContent = cantidad;

        if (cantidad >= 280) {
            contadorCaracteres.classList.add('text-danger', 'fw-bold');
        } else {
            contadorCaracteres.classList.remove('text-danger', 'fw-bold');
        }
    });

    // Cargar registros existentes en LocalStorage al iniciar
    cargarLocalStorage();

    // 2. Detectar el evento 'submit' al enviar el formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Validar formato de correo y campos obligatorios
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Obtener datos ingresados
        const nuevaSolicitud = {
            id: Date.now(),
            nombre: document.getElementById('nombre').value.trim(),
            correo: document.getElementById('correo').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            descripcion: descripcion.value.trim(),
            fecha: new Date().toLocaleString()
        };

        // Guardar información en LocalStorage
        guardarEnLocalStorage(nuevaSolicitud);

        // Mostrar mensaje de confirmación
        alertaExito.classList.remove('d-none');

        // Limpiar formulario y resetear contadores
        form.reset();
        form.classList.remove('was-validated');
        contadorCaracteres.textContent = '0';

        // Ocultar mensaje tras 4 segundos
        setTimeout(() => {
            alertaExito.classList.add('d-none');
        }, 4000);

        // Modificar elementos del DOM para actualizar la lista
        cargarLocalStorage();
    });

    // Guardar en el LocalStorage del navegador
    function guardarEnLocalStorage(solicitud) {
        let datos = JSON.parse(localStorage.getItem('solicitudesSuperJuarez')) || [];
        datos.push(solicitud);
        localStorage.setItem('solicitudesSuperJuarez', JSON.stringify(datos));
    }

    // Acceder a elementos del DOM para mostrar los datos guardados
    function cargarLocalStorage() {
        const datos = JSON.parse(localStorage.getItem('solicitudesSuperJuarez')) || [];
        listaSolicitudes.innerHTML = '';

        if (datos.length === 0) {
            listaSolicitudes.innerHTML = '<p class="text-muted small mb-0 p-2">No existen solicitudes registradas en el almacenamiento local.</p>';
            return;
        }

        datos.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'list-group-item bg-white border-success-subtle mb-2 rounded shadow-sm';
            div.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <h6 class="mb-1 text-success fw-bold"><i class="fa-solid fa-user me-1"></i>${item.nombre}</h6>
                    <small class="text-muted">${item.fecha}</small>
                </div>
                <p class="mb-1 text-dark small">${item.descripcion}</p>
                <small class="text-muted"><i class="fa-solid fa-envelope me-1"></i>${item.correo} | <i class="fa-solid fa-phone me-1"></i>${item.telefono}</small>
            `;
            listaSolicitudes.appendChild(div);
        });
    }
});