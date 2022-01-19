// Campos del Formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const tlfInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

// Clases
class Citas{
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI{
    imprimirAlerta(mensaje, tipo){
        // Crear el div
        const divMsj = document.createElement('div');
        divMsj.classList.add('text-center','alert', 'd-block', 'col-12');

        // Agregar clase segun tipo
        if(tipo === 'error'){
            divMsj.classList.add('alert-danger');
        } else {
            divMsj.classList.add('alert-success');
        }

        // Mensaje de error
        divMsj.textContent = mensaje;

        // agregar al DOM
        document.querySelector('#contenido').insertBefore(divMsj, document.querySelector('.agregar-cita'));

        // quitar la alerta
        setInterval(() => {
            divMsj.remove();
        }, 5000);
    }

    imprimirCitas({citas}){

        this.limpiarHTML();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // scripting de los elementos de la cita
            const mascotaParrfo = document.createElement('h2');
            mascotaParrfo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrfo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const tlfParrafo = document.createElement('p');
            tlfParrafo.innerHTML = `
                <span class="font-weight-bolder">Telefono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const sistomasParrafo = document.createElement('p');
            sistomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
            `;


            // Boton para eleminar esta cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg> `;

            btnEliminar.onclick = () => eliminarCita(id);

            // Boton de Editar cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg> `;

            btnEditar.onclick = () => cargarEdicion(cita);
        
            // Agrega los parrafos al divCita
            divCita.appendChild(mascotaParrfo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(tlfParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sistomasParrafo);  
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);   
                        
            // agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

// Instancia
const ui = new UI();
const adminCitas = new Citas();

// Registrar Eventos
eventListener();
function eventListener(){
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    tlfInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita)
}

// Objeto con la info de las citas
const citasObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '', 
    sintomas: ''
}

// Agrega Datos al Obj de Citas
function datosCita(e){
    citasObj[e.target.name] = e.target.value;
}

// valida y agrega una nueva cita
function nuevaCita(e){
    e.preventDefault();

    // Extrae la info del Obj Cita
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citasObj;

    // validar 
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el Obj de la cita a edicion
        adminCitas.editarCita({...citasObj});

        // Regresar el txt del boton a estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
        
        // Salir del modo Edicion
        editando = false

    } else {
        // generar ID
        citasObj.id = Date.now();

        // Creando nueva Cita
        adminCitas.agregarCita({...citasObj});

        // mensaje de agregado correctamente
        ui.imprimirAlerta('Se agrego correctamente');
    }
    
    // reiniciar el Obj
    reiniciarObj();

    // Reinicia el form
    formulario.reset();
    
    // mostrar el HTML de las Citas
    ui.imprimirCitas(adminCitas);
}

// Reinicia el obj de citas
function reiniciarObj(){
    citasObj.mascota = '';
    citasObj.propietario = '';
    citasObj.telefono = '';
    citasObj.fecha = '';
    citasObj.hora = '';
    citasObj.sintomas = '';
}

function eliminarCita(id){
    // Eliminar la Cita
    adminCitas.eliminarCita(id);

    // Muestre un mensaje
    ui.imprimirAlerta('La cita se elimino correctamente');

    // Refrescar las citas
    ui.imprimirCitas(adminCitas);

}

// Carga los dato y el modo Edicion
function cargarEdicion(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    
    // Llenar los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    tlfInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el obj
    citasObj.mascota = mascota;
    citasObj.propietario = propietario;
    citasObj.telefono = telefono;
    citasObj.fecha = fecha;
    citasObj.hora = hora;
    citasObj.sintomas = sintomas;
    citasObj.id = id;

    // Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
    
}