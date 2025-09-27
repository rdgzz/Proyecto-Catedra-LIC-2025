// Elementos
const randomBtn = document.getElementById('randomBtn');
const sortBtn = document.getElementById('sortBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const velotxt = document.getElementById('velotxt');
const datostxt = document.getElementById('datostxt');
const graphicContent = document.getElementById('graphic-content');
const txtDatos = document.getElementById('txtDatos');
const tiempoText = document.getElementById('tiempoText');

let datos = [];
let sorting = false;
let velocidad = 50;
let cantidad = 12;
let tiempo = 0;

// Inicializar datos
function generarDatosAleatorios() {
    datos = Array.from({length: cantidad}, () => Math.floor(Math.random() * 200 - 100));
    renderDatos();
}

function renderDatos(highlight = -1, insertIdx = -1) {
    graphicContent.innerHTML = '';
    const maxAbs = Math.max(...datos.map(n => Math.abs(n)), 100);
    datos.forEach((num, idx) => {
        // Contenedor de palito
        const stickContainer = document.createElement('div');
        stickContainer.style.display = 'inline-flex';
        stickContainer.style.flexDirection = 'column';
        stickContainer.style.alignItems = 'center';
        stickContainer.style.width = '24px';
        stickContainer.style.margin = '0 8px';

        // Palito
        const stick = document.createElement('div');
        stick.style.width = '8px';
        stick.style.height = `${Math.abs(num) * 120 / maxAbs + 30}px`;
        stick.style.background = idx === highlight
            ? '#ff9800'
            : (idx === insertIdx
                ? '#43a047'
                : '#1976d2');
        stick.style.borderRadius = '4px';
        stick.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        stick.style.marginBottom = '6px';
        stickContainer.appendChild(stick);

        // Número en la base
        const label = document.createElement('span');
        label.textContent = num;
        label.style.fontWeight = 'bold';
        label.style.fontSize = '13px';
        label.style.color = idx === highlight ? '#ff9800' : (idx === insertIdx ? '#43a047' : '#1976d2');
        stickContainer.appendChild(label);

        graphicContent.appendChild(stickContainer);
    });
}

// Insertion Sort animado
async function insercionSortAnimado() {
    sorting = true;
    stopBtn.disabled = false;
    startBtn.disabled = true;
    tiempo = 0;
    for (let i = 1; i < datos.length && sorting; i++) {
        let key = datos[i];
        let j = i - 1;
        renderDatos(i, j);
        await sleep(velocidad);
        while (j >= 0 && datos[j] > key && sorting) {
            datos[j + 1] = datos[j];
            renderDatos(i, j);
            await sleep(velocidad);
            j = j - 1;
        }
        datos[j + 1] = key;
        tiempo += 1;
        tiempoText.textContent = `${tiempo} segundos`;
        renderDatos(i, j + 1);
        await sleep(velocidad);
    }
    sorting = false;
    stopBtn.disabled = true;
    startBtn.disabled = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Eventos
randomBtn.onclick = () => {
    generarDatosAleatorios();
};

sortBtn.onclick = () => {
    datos = [...datos].sort(() => Math.random() - 0.5);
    renderDatos();
};

startBtn.onclick = () => {
    if (!sorting) insercionSortAnimado();
};

stopBtn.onclick = () => {
    sorting = false;
    stopBtn.disabled = true;
    startBtn.disabled = false;
};

velotxt.oninput = (e) => {
    velocidad = 150 - parseInt(e.target.value, 10) + 10;
};

datostxt.oninput = (e) => {
    cantidad = parseInt(e.target.value, 10);
    generarDatosAleatorios();
};

txtDatos.onchange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && datos.length < cantidad) {
        datos.push(val);
        renderDatos();
        txtDatos.value = '';
    }
};

// Inicializar
window.onload = () => {
    generarDatosAleatorios();
    tiempoText.textContent = '0 segundos';
};
