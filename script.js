if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
            console.log('Zerbimek Offline Listo!', reg.scope);
        }).catch((err) => {
            console.log('Error PWA: ', err);
        });
    });
}

document.querySelectorAll('.auto-select').forEach(input => {
    input.addEventListener('focus', function() {
        this.select();
    });
});

function handleEnter(e, buttonId) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById(buttonId).click();
    }
}

// --- NAVEGACIÓN HOME / MÓDULOS ---
function abrirModulo(modulo) {
    document.getElementById("home_screen").style.display = "none";
    document.getElementById("btn_volver").style.display = "block";
    
    document.getElementById("modulo_cnc").style.display = "none";
    document.getElementById("modulo_pesos").style.display = "none";
    document.getElementById("modulo_trigo").style.display = "none";

    if (modulo === 'cnc') {
        document.getElementById("modulo_cnc").style.display = "block";
        document.getElementById("header_subtitle").innerText = "Calculadora CNC";
    } else if (modulo === 'pesos') {
        document.getElementById("modulo_pesos").style.display = "block";
        document.getElementById("header_subtitle").innerText = "Calculadora de Pesos";
        cambiarFormaPeso(); 
    } else if (modulo === 'trigo') {
        document.getElementById("modulo_trigo").style.display = "block";
        document.getElementById("header_subtitle").innerText = "Trivagometría";
        cambiarFormaTrigo();
    }
}

function irInicio() {
    document.getElementById("modulo_cnc").style.display = "none";
    document.getElementById("modulo_pesos").style.display = "none";
    document.getElementById("modulo_trigo").style.display = "none";
    document.getElementById("home_screen").style.display = "flex";
    document.getElementById("btn_volver").style.display = "none";
    document.getElementById("header_subtitle").innerText = "Centro de Herramientas";
}

// --- LOGICA PCD (CÍRCULO DE AGUJEROS) ---
function calcularPCD() {
    let xc = parseFloat(document.getElementById('pcd_xc').value);
    let yc = parseFloat(document.getElementById('pcd_yc').value);
    let d = parseFloat(document.getElementById('pcd_d').value);
    let n = parseInt(document.getElementById('pcd_n').value);
    let ang_ini = parseFloat(document.getElementById('pcd_ang').value) || 0;

    if (isNaN(xc) || isNaN(yc) || isNaN(d) || isNaN(n) || d <= 0 || n <= 0) {
        alert("Rellena todos los campos correctamente.");
        return;
    }

    let r = d / 2;
    let step = 360 / n;
    let html_res = "";

    for (let i = 0; i < n; i++) {
        let angle_deg = 90 - (ang_ini + (i * step));
        let angle_rad = angle_deg * Math.PI / 180;

        let x_hole = xc + r * Math.cos(angle_rad);
        let y_hole = yc + r * Math.sin(angle_rad);

        if (Math.abs(x_hole) < 0.0001) x_hole = 0;
        if (Math.abs(y_hole) < 0.0001) y_hole = 0;

        html_res += `<p><b>Agujero ${i+1}:</b> <span>X <span class="highlight">${x_hole.toFixed(3)}</span> &nbsp;|&nbsp; Y <span class="highlight">${y_hole.toFixed(3)}</span></span></p>`;
    }

    document.getElementById('res_pcd_list').innerHTML = html_res;
    document.getElementById('res_pcd').style.display = 'block';
}

// --- LOGICA TRIVAGOMETRÍA Y NUEVAS FUNCIONES ---
const svgTrigo = {
    'triangulo': `<svg viewBox="0 0 160 140" style="height:120px; max-width:100%;">
                    <polygon points="30,110 120,110 120,30" fill="#f0f7ff" stroke="#E3000F" stroke-width="3" />
                    <rect x="110" y="100" width="10" height="10" fill="none" stroke="#E3000F" stroke-width="1.5" />
                    <path d="M 52 110 A 20 20 0 0 0 46 95" fill="none" stroke="#E3000F" stroke-width="1.5" />
                    <text x="62" y="105" class="svg-cota" style="font-size: 13px;">&alpha;</text>
                    <text x="75" y="130" class="svg-cota">A</text>
                    <text x="132" y="75" class="svg-cota">B</text>
                    <text x="65" y="60" class="svg-cota">C</text>
                </svg>`,
    'chaflan': `<svg viewBox="0 0 240 210" style="height:180px; max-width:100%;">
                    <polygon points="15,60 70,60 160,130 160,205 15,205" fill="#f0f7ff" stroke="none" />
                    <polyline points="15,60 70,60 160,130 160,205" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="70" y1="60" x2="160" y2="60" stroke="#E3000F" stroke-width="1.5" stroke-dasharray="7.5,4.5" />
                    <line x1="160" y1="60" x2="160" y2="130" stroke="#E3000F" stroke-width="1.5" stroke-dasharray="7.5,4.5" />
                    <line x1="70" y1="30" x2="160" y2="30" class="svg-linea" />
                    <line x1="70" y1="22.5" x2="70" y2="55" class="svg-linea" />
                    <line x1="160" y1="22.5" x2="160" y2="55" class="svg-linea" />
                    <text x="115" y="21" text-anchor="middle" class="svg-cota">A</text>
                    <line x1="187.5" y1="60" x2="187.5" y2="130" class="svg-linea" />
                    <line x1="165" y1="60" x2="195" y2="60" class="svg-linea" />
                    <line x1="165" y1="130" x2="195" y2="130" class="svg-linea" />
                    <text x="202.5" y="100" text-anchor="start" alignment-baseline="middle" class="svg-cota">B</text>
                    <path d="M 160 95 A 35 35 0 0 0 132.4 108.5" fill="none" stroke="#E3000F" stroke-width="1.5" />
                    <text x="140" y="90" text-anchor="middle" alignment-baseline="middle" class="svg-cota" style="font-size: 19px;">&alpha;</text>
                    <text x="100" y="112" class="svg-cota">C</text>
                </svg>`,
    'pcd': `<svg viewBox="0 0 160 160" style="height:120px; max-width:100%;">
                <line x1="80" y1="20" x2="80" y2="120" stroke="#aaa" stroke-width="1" stroke-dasharray="4,4" />
                <line x1="25" y1="70" x2="135" y2="70" stroke="#aaa" stroke-width="1" stroke-dasharray="4,4" />
                <path d="M 75 70 L 85 70 M 80 65 L 80 75" stroke="#222" stroke-width="1.5" />
                <circle cx="80" cy="70" r="40" fill="none" stroke="#E3000F" stroke-width="1.5" stroke-dasharray="4,4"/>
                <circle cx="80" cy="30" r="4" fill="#E3000F" /> 
                <circle cx="114.6" cy="50" r="4" fill="#E3000F" />
                <circle cx="114.6" cy="90" r="4" fill="#E3000F" />
                <circle cx="80" cy="110" r="4" fill="#E3000F" />
                <circle cx="45.4" cy="90" r="4" fill="#E3000F" />
                <circle cx="45.4" cy="50" r="4" fill="#E3000F" />
                <path d="M 80 45 A 25 25 0 0 1 92.5 48.3" fill="none" stroke="#222" stroke-width="1.5"/>
                <text x="89" y="42" font-family="sans-serif" font-size="12" font-weight="bold" fill="#222">&alpha;</text>
                <line x1="40" y1="140" x2="72" y2="140" class="svg-linea" stroke="#E3000F"/>
                <line x1="88" y1="140" x2="120" y2="140" class="svg-linea" stroke="#E3000F"/>
                <line x1="40" y1="135" x2="40" y2="145" class="svg-linea" stroke="#E3000F"/>
                <line x1="120" y1="135" x2="120" y2="145" class="svg-linea" stroke="#E3000F"/>
                <text x="80" y="145" class="svg-cota" fill="#E3000F" text-anchor="middle">D</text>
            </svg>`,
    'avellanado': `<svg viewBox="0 0 260 220" style="height:180px; max-width:100%;">
                    <polygon points="50,50 210,50 170,120 170,200 90,200 90,120" fill="#f0f7ff" stroke="#222" stroke-width="2.5"/>
                    <line x1="130" y1="20" x2="130" y2="210" stroke="#E3000F" stroke-dasharray="10,5,3,5" stroke-width="1.5"/>
                    <line x1="50" y1="30" x2="210" y2="30" stroke="#E3000F" stroke-width="1.5"/>
                    <line x1="50" y1="22" x2="50" y2="38" stroke="#E3000F" stroke-width="1.5"/>
                    <line x1="210" y1="22" x2="210" y2="38" stroke="#E3000F" stroke-width="1.5"/>
                    <rect x="115" y="16" width="30" height="20" fill="#fff" />
                    <text x="130" y="32" text-anchor="middle" class="svg-cota" font-size="18">D</text>
                    <line x1="90" y1="180" x2="170" y2="180" stroke="#E3000F" stroke-width="1.5"/>
                    <line x1="90" y1="172" x2="90" y2="188" stroke="#E3000F" stroke-width="1.5"/>
                    <line x1="170" y1="172" x2="170" y2="188" stroke="#E3000F" stroke-width="1.5"/>
                    <rect x="115" y="166" width="30" height="20" fill="#fff" />
                    <text x="130" y="182" text-anchor="middle" class="svg-cota" font-size="18">d</text>
                    <line x1="210" y1="50" x2="245" y2="50" stroke="#E3000F" stroke-width="1.5"/>
                    <line x1="170" y1="120" x2="245" y2="120" stroke="#E3000F" stroke-width="1.5"/>
                    <line x1="230" y1="50" x2="230" y2="120" stroke="#E3000F" stroke-width="1.5"/>
                    <text x="245" y="90" alignment-baseline="middle" class="svg-cota" font-size="18">Z</text>
                    <line x1="170" y1="50" x2="170" y2="120" stroke="#E3000F" stroke-dasharray="4,4" stroke-width="1.5"/>
                    <path d="M 170 80 A 40 40 0 0 1 189.8 85.3" fill="none" stroke="#E3000F" stroke-width="2"/>
                    <text x="178" y="70" class="svg-cota" font-size="16" font-weight="bold">&alpha;</text>
                </svg>`,
    'arco': `<svg viewBox="0 0 160 140" style="height:120px; max-width:100%;">
                <path d="M 20 80 Q 80 160 140 80" fill="#f0f7ff" stroke="#222" stroke-width="3"/>
                <line x1="20" y1="80" x2="140" y2="80" stroke="#E3000F" stroke-dasharray="4,4" stroke-width="1.5"/>
                <text x="80" y="70" text-anchor="middle" class="svg-cota">C (Cuerda)</text>
                <line x1="80" y1="80" x2="80" y2="117" class="svg-linea" stroke="#E3000F"/>
                <text x="88" y="103" class="svg-cota" fill="#E3000F">F</text>
                <line x1="75" y1="80" x2="85" y2="80" stroke="#E3000F" stroke-width="1.5"/>
                <line x1="75" y1="117" x2="85" y2="117" stroke="#E3000F" stroke-width="1.5"/>
            </svg>`,
    'ranura_t': `<svg viewBox="0 0 280 220" style="height:200px; max-width:100%;">
                    <!-- Pieza (Sección) -->
                    <path d="M 40 10 L 40 60 L 100 60 L 100 160 L 40 160 L 40 210" fill="none" stroke="#222" stroke-width="3" />
                    <rect x="0" y="10" width="40" height="200" fill="#f0f7ff" />
                    
                    <!-- Fresa en T (Dibujo realista) -->
                    <g transform="translate(0, 20)">
                        <!-- Mango/Cuello -->
                        <rect x="110" y="85" width="120" height="10" fill="#999" stroke="#444" stroke-width="1"/>
                        <!-- Cuerpo de la fresa (Disco) -->
                        <rect x="60" y="70" width="50" height="40" rx="2" fill="#E3000F" stroke="#900" stroke-width="1.5"/>
                        <!-- Líneas de corte de la fresa -->
                        <line x1="65" y1="70" x2="65" y2="110" stroke="#fff" opacity="0.3" stroke-width="2"/>
                        <line x1="75" y1="70" x2="75" y2="110" stroke="#fff" opacity="0.3" stroke-width="2"/>
                        <line x1="85" y1="70" x2="85" y2="110" stroke="#fff" opacity="0.3" stroke-width="2"/>
                    </g>

                    <!-- Cota Z Fondo (A la cara inferior de la ranura) -->
                    <line x1="100" y1="160" x2="260" y2="160" stroke="#E3000F" stroke-width="1.5" stroke-dasharray="5,3"/>
                    <text x="210" y="178" text-anchor="middle" class="svg-cota" font-size="16" font-weight="bold">Z Fondo</text>
                    
                    <!-- Cota Ancho -->
                    <line x1="140" y1="60" x2="140" y2="160" stroke="#222" stroke-width="1.5"/>
                    <line x1="130" y1="60" x2="150" y2="60" stroke="#222" stroke-width="1.5"/>
                    <line x1="130" y1="160" x2="150" y2="160" stroke="#222" stroke-width="1.5"/>
                    <rect x="115" y="95" width="50" height="30" fill="#fff" />
                    <text x="140" y="115" text-anchor="middle" class="svg-cota" font-size="16" fill="#222">Ancho</text>
                </svg>`
};

function cambiarFormaTrigo(nuevaForma, elementoBoton) {
    let forma = nuevaForma || document.getElementById("t_forma").value;
    document.getElementById("t_forma").value = forma;

    if (elementoBoton) {
        let botones = document.querySelectorAll(".trigo-btn");
        botones.forEach(btn => btn.classList.remove("active"));
        elementoBoton.classList.add("active");
    } else {
        let primerBoton = document.querySelector(".trigo-btn");
        if(primerBoton) primerBoton.classList.add("active");
    }

    document.getElementById("trigo_preview").innerHTML = svgTrigo[forma];

    let groupTrigo = document.getElementById("inputs_trigo");
    let groupPcd = document.getElementById("inputs_pcd");
    let groupAve = document.getElementById("inputs_ave");
    let groupArco = document.getElementById("inputs_arco");
    let groupRt = document.getElementById("inputs_ranura_t");

    let instTrigo = document.getElementById("instrucciones_trigo");
    let instAve = document.getElementById("instrucciones_ave");
    let instArco = document.getElementById("instrucciones_arco");
    let instRt = document.getElementById("instrucciones_ranura_t");

    groupTrigo.style.display = "none";
    groupPcd.style.display = "none";
    groupAve.style.display = "none";
    groupArco.style.display = "none";
    groupRt.style.display = "none";
    
    instTrigo.style.display = "none";
    instAve.style.display = "none";
    instArco.style.display = "none";
    instRt.style.display = "none";
    
    document.getElementById("res_pcd").style.display = "none";
    document.getElementById("res_ave").style.display = "none";
    document.getElementById("res_arco").style.display = "none";
    document.getElementById("res_ranura_t").style.display = "none";

    if (forma === 'pcd') {
        groupPcd.style.display = "block";
    } else if (forma === 'avellanado') {
        groupAve.style.display = "block";
        instAve.style.display = "block";
    } else if (forma === 'arco') {
        groupArco.style.display = "block";
        instArco.style.display = "block";
    } else if (forma === 'ranura_t') {
        groupRt.style.display = "block";
        instRt.style.display = "block";
    } else {
        groupTrigo.style.display = "block";
        instTrigo.style.display = "block";

        let lblA = document.getElementById("lbl_trigo_a");
        let lblB = document.getElementById("lbl_trigo_b");
        let lblC = document.getElementById("lbl_trigo_c");

        if (forma === 'triangulo') {
            lblA.innerText = "Cateto Base [ A ]:";
            lblB.innerText = "Cateto Alto [ B ]:";
            lblC.innerText = "Hipotenusa [ C ]:";
        } else {
            lblA.innerText = "Longitud (Z) [ A ]:";
            lblB.innerText = "Profundidad (X) [ B ]:";
            lblC.innerText = "Chaflán [ C ]:";
        }
        limpiarTrigo(); 
    }
}

function calcularRanuraT() {
    let z_fondo = parseFloat(document.getElementById("rt_z_fondo").value);
    let w_ranura = parseFloat(document.getElementById("rt_w_ranura").value);
    let w_fresa = parseFloat(document.getElementById("rt_w_fresa").value);

    if (isNaN(z_fondo) || isNaN(w_ranura) || isNaN(w_fresa) || w_ranura <= 0 || w_fresa <= 0) {
        alert("Introduce valores válidos. El ancho debe ser mayor que 0.");
        return;
    }

    if (w_fresa > w_ranura) {
        alert("¡Error! La fresa (" + w_fresa + "mm) no cabe en la ranura (" + w_ranura + "mm).");
        return;
    }

    // La herramienta se calibra por debajo, así que la pasada 1 es directamente el Z de fondo
    let z_pasada_1 = z_fondo;
    
    // Para hacer el techo, subimos (en Z positivo) el ancho de la ranura, 
    // pero bajamos el espesor de la fresa porque nuestro cero de herramienta está abajo.
    let z_pasada_final = (z_fondo + w_ranura) - w_fresa;
    
    let html_pasadas = "";
    
    if (w_ranura === w_fresa) {
        // Entra justa de una pasada
        html_pasadas += `<p>Pasada Única: <span class="highlight">Z ${z_pasada_1.toFixed(3).replace(".", ",")}</span></p>`;
        document.getElementById("rt_nota").innerHTML = "<span class='title'>Ranura de una pasada</span>La fresa tiene exactamente el mismo espesor que la ranura.";
        document.getElementById("rt_nota").style.display = "block";
    } else {
        // Necesita varias pasadas
        let distancia_total = Math.abs(z_pasada_final - z_pasada_1);
        
        // Calculamos cuántos tramos necesitamos para que la fresa solape al menos un 20%
        let max_pasada = w_fresa * 0.8; 
        let num_tramos = Math.ceil(distancia_total / max_pasada);
        let incremento = distancia_total / num_tramos; // Dividimos el hueco en partes iguales
        
        for(let i = 0; i <= num_tramos; i++) {
            let z_actual = z_pasada_1 + (incremento * i);
            
            let nombre_pasada = "";
            if (i === 0) nombre_pasada = "Fondo";
            else if (i === num_tramos) nombre_pasada = "Techo";
            else nombre_pasada = "Intermedia";

            html_pasadas += `<p>Pasada ${i+1} (${nombre_pasada}): <span class="highlight">Z ${z_actual.toFixed(3).replace(".", ",")}</span></p>`;
        }
        
        document.getElementById("rt_nota").innerHTML = "<span class='title'>Mecanizado Seguro</span>Se han calculado <b>" + (num_tramos + 1) + " pasadas</b> distribuidas equitativamente para asegurar un buen solape de corte.";
        document.getElementById("rt_nota").style.display = "block";
    }

    document.getElementById("res_ranura_t_list").innerHTML = html_pasadas;
    document.getElementById("res_ranura_t").style.display = "block";
}

function calcularAvellanado() {
    let d_obj = parseFloat(document.getElementById("ave_d_obj").value);
    let ang = parseFloat(document.getElementById("ave_ang").value);
    let d_previo = parseFloat(document.getElementById("ave_d_previo").value) || 0;

    if (isNaN(d_obj) || isNaN(ang) || d_obj <= 0 || ang <= 0 || ang >= 90) {
        alert("Por favor, introduce un diámetro y un ángulo de chaflán válidos (entre 1 y 89 grados).");
        return;
    }

    if (d_previo >= d_obj) {
        alert("El diámetro previo no puede ser mayor o igual que el diámetro del chaflán.");
        return;
    }

    let rad = ang * (Math.PI / 180);
    let z = (d_obj - d_previo) / (2 * Math.tan(rad));

    document.getElementById("ave_z_res").innerText = z.toFixed(3).replace(".", ",") + " mm";
    document.getElementById("res_ave").style.display = "block";
}

function calcularArco() {
    let c = parseFloat(document.getElementById("arco_c").value);
    let f = parseFloat(document.getElementById("arco_f").value);

    if (isNaN(c) || isNaN(f) || c <= 0 || f <= 0) {
        alert("Introduce valores válidos y mayores que cero para la Cuerda y la Flecha.");
        return;
    }

    let r = (Math.pow(c, 2) / (8 * f)) + (f / 2);

    document.getElementById("arco_r_res").innerText = r.toFixed(3).replace(".", ",") + " mm";
    document.getElementById("res_arco").style.display = "block";
}

function limpiarTrigo() {
    document.getElementById('t_a').value = '';
    document.getElementById('t_b').value = '';
    document.getElementById('t_c').value = '';
    document.getElementById('t_ang').value = '';
}

function calcularTrigo() {
    let forma = document.getElementById("t_forma").value;
    let isChaflan = (forma === 'chaflan');

    let a = parseFloat(document.getElementById('t_a').value);
    let b = parseFloat(document.getElementById('t_b').value);
    let c = parseFloat(document.getElementById('t_c').value);
    let ang = parseFloat(document.getElementById('t_ang').value);

    let count = 0;
    if(!isNaN(a)) count++;
    if(!isNaN(b)) count++;
    if(!isNaN(c)) count++;
    if(!isNaN(ang)) count++;

    if(count !== 2) {
        alert("Vagometría rules: Introduce EXACTAMENTE 2 datos. Ni más, ni menos.");
        return;
    }

    let rad = Math.PI / 180;
    let deg = 180 / Math.PI;

    if(!isNaN(a) && !isNaN(b)) {
        c = Math.sqrt(a*a + b*b);
        ang = isChaflan ? Math.atan(a/b) * deg : Math.atan(b/a) * deg;
    } else if(!isNaN(a) && !isNaN(c)) {
        if(a >= c) return alert("¡Error! La hipotenusa/chaflán [ C ] tiene que ser mayor que el cateto [ A ].");
        b = Math.sqrt(c*c - a*a);
        ang = isChaflan ? Math.asin(a/c) * deg : Math.acos(a/c) * deg;
    } else if(!isNaN(b) && !isNaN(c)) {
        if(b >= c) return alert("¡Error! La hipotenusa/chaflán [ C ] tiene que ser mayor que el cateto [ B ].");
        a = Math.sqrt(c*c - b*b);
        ang = isChaflan ? Math.acos(b/c) * deg : Math.asin(b/c) * deg;
    } else if(!isNaN(a) && !isNaN(ang)) {
        if(ang >= 90 || ang <= 0) return alert("El ángulo debe estar entre 0.1 y 89.9 grados.");
        b = isChaflan ? a / Math.tan(ang * rad) : a * Math.tan(ang * rad);
        c = isChaflan ? a / Math.sin(ang * rad) : a / Math.cos(ang * rad);
    } else if(!isNaN(b) && !isNaN(ang)) {
        if(ang >= 90 || ang <= 0) return alert("El ángulo debe estar entre 0.1 y 89.9 grados.");
        a = isChaflan ? b * Math.tan(ang * rad) : b / Math.tan(ang * rad);
        c = isChaflan ? b / Math.cos(ang * rad) : b / Math.sin(ang * rad);
    } else if(!isNaN(c) && !isNaN(ang)) {
        if(ang >= 90 || ang <= 0) return alert("El ángulo debe estar entre 0.1 y 89.9 grados.");
        a = isChaflan ? c * Math.sin(ang * rad) : c * Math.cos(ang * rad);
        b = isChaflan ? c * Math.cos(ang * rad) : c * Math.sin(ang * rad);
    }

    document.getElementById('t_a').value = parseFloat(a.toFixed(3));
    document.getElementById('t_b').value = parseFloat(b.toFixed(3));
    document.getElementById('t_c').value = parseFloat(c.toFixed(3));
    document.getElementById('t_ang').value = parseFloat(ang.toFixed(3));
}

// --- LOGICA DE PESOS ---
const svgShapes = {
    'redondo': `<svg viewBox="0 0 160 140" style="height:110px; max-width:100%;"><circle cx="80" cy="60" r="40" fill="#E3000F" /><line x1="40" y1="115" x2="120" y2="115" class="svg-linea"/><line x1="40" y1="110" x2="40" y2="120" class="svg-linea"/><line x1="120" y1="110" x2="120" y2="120" class="svg-linea"/><text x="80" y="132" text-anchor="middle" class="svg-cota">A</text></svg>`,
    'cuadrado': `<svg viewBox="0 0 160 140" style="height:110px; max-width:100%;"><rect x="40" y="20" width="80" height="80" fill="#E3000F" /><line x1="40" y1="115" x2="120" y2="115" class="svg-linea"/><line x1="40" y1="110" x2="40" y2="120" class="svg-linea"/><line x1="120" y1="110" x2="120" y2="120" class="svg-linea"/><text x="80" y="132" text-anchor="middle" class="svg-cota">A</text></svg>`,
    'hexagonal': `<svg viewBox="0 0 160 140" style="height:110px; max-width:100%;"><polygon points="80,15 118.97,37.5 118.97,82.5 80,105 41.03,82.5 41.03,37.5" fill="#E3000F" /><line x1="41.03" y1="120" x2="118.97" y2="120" class="svg-linea"/><line x1="41.03" y1="115" x2="41.03" y2="125" class="svg-linea"/><line x1="118.97" y1="115" x2="118.97" y2="125" class="svg-linea"/><text x="80" y="137" text-anchor="middle" class="svg-cota">A</text></svg>`,
    'placa': `<svg viewBox="0 0 160 140" style="height:110px; max-width:100%;"><rect x="30" y="40" width="100" height="40" fill="#E3000F" /><line x1="30" y1="95" x2="130" y2="95" class="svg-linea"/><line x1="30" y1="90" x2="30" y2="100" class="svg-linea"/><line x1="130" y1="90" x2="130" y2="100" class="svg-linea"/><text x="80" y="112" text-anchor="middle" class="svg-cota">A</text><line x1="145" y1="40" x2="145" y2="80" class="svg-linea"/><line x1="140" y1="40" x2="150" y2="40" class="svg-linea"/><line x1="140" y1="80" x2="150" y2="80" class="svg-linea"/><text x="156" y="64" text-anchor="middle" alignment-baseline="middle" class="svg-cota">e</text></svg>`,
    'tubo_red_espesor': `<svg viewBox="0 0 160 140" style="height:110px; max-width:100%;"><circle cx="80" cy="60" r="34" fill="none" stroke="#E3000F" stroke-width="12"/><line x1="40" y1="115" x2="120" y2="115" class="svg-linea"/><line x1="40" y1="110" x2="40" y2="120" class="svg-linea"/><line x1="120" y1="110" x2="120" y2="120" class="svg-linea"/><text x="80" y="132" text-anchor="middle" class="svg-cota">A</text><line x1="80" y1="20" x2="135" y2="20" class="svg-linea"/><line x1="80" y1="32" x2="135" y2="32" class="svg-linea"/><line x1="130" y1="20" x2="130" y2="32" class="svg-linea"/><text x="144" y="30" alignment-baseline="middle" text-anchor="middle" class="svg-cota">e</text></svg>`,
    'tubo_red_interior': `<svg viewBox="0 0 160 140" style="height:110px; max-width:100%;"><circle cx="80" cy="60" r="34" fill="none" stroke="#E3000F" stroke-width="12"/><line x1="40" y1="115" x2="120" y2="115" class="svg-linea"/><line x1="40" y1="110" x2="40" y2="120" class="svg-linea"/><line x1="120" y1="110" x2="120" y2="120" class="svg-linea"/><text x="80" y="132" text-anchor="middle" class="svg-cota">A</text><line x1="52" y1="60" x2="108" y2="60" class="svg-linea"/><line x1="52" y1="55" x2="52" y2="65" class="svg-linea"/><line x1="108" y1="55" x2="108" y2="65" class="svg-linea"/><text x="80" y="55" text-anchor="middle" class="svg-cota">d</text></svg>`,
    'tubo_cua': `<svg viewBox="0 0 160 140" style="height:110px; max-width:100%;"><rect x="46" y="26" width="68" height="68" fill="none" stroke="#E3000F" stroke-width="12"/><line x1="40" y1="115" x2="120" y2="115" class="svg-linea"/><line x1="40" y1="110" x2="40" y2="120" class="svg-linea"/><line x1="120" y1="110" x2="120" y2="120" class="svg-linea"/><text x="80" y="132" text-anchor="middle" class="svg-cota">A</text><line x1="105" y1="20" x2="135" y2="20" class="svg-linea"/><line x1="105" y1="32" x2="135" y2="32" class="svg-linea"/><line x1="130" y1="20" x2="130" y2="32" class="svg-linea"/><text x="144" y="30" alignment-baseline="middle" text-anchor="middle" class="svg-cota">e</text></svg>`,
    'tubo_rect': `<svg viewBox="-20 0 190 140" style="height:110px; max-width:100%;"><rect x="31" y="36" width="88" height="48" fill="none" stroke="#E3000F" stroke-width="12"/><line x1="25" y1="105" x2="125" y2="105" class="svg-linea"/><line x1="25" y1="100" x2="25" y2="110" class="svg-linea"/><line x1="125" y1="100" x2="125" y2="110" class="svg-linea"/><text x="75" y="122" text-anchor="middle" class="svg-cota">A</text><line x1="140" y1="30" x2="140" y2="90" class="svg-linea"/><line x1="135" y1="30" x2="145" y2="30" class="svg-linea"/><line x1="135" y1="90" x2="145" y2="90" class="svg-linea"/><text x="153" y="64" alignment-baseline="middle" text-anchor="middle" class="svg-cota">B</text><line x1="25" y1="30" x2="10" y2="30" class="svg-linea"/><line x1="25" y1="42" x2="10" y2="42" class="svg-linea"/><line x1="15" y1="30" x2="15" y2="42" class="svg-linea"/><text x="6" y="39" text-anchor="end" class="svg-cota">e</text></svg>`,
    'perfil_u': `<svg viewBox="-20 0 190 140" style="height:110px; max-width:100%;"><path d="M 31 30 L 31 84 L 119 84 L 119 30" fill="none" stroke="#E3000F" stroke-width="12" stroke-linejoin="miter"/><line x1="25" y1="105" x2="125" y2="105" class="svg-linea"/><line x1="25" y1="100" x2="25" y2="110" class="svg-linea"/><line x1="125" y1="100" x2="125" y2="110" class="svg-linea"/><text x="75" y="122" text-anchor="middle" class="svg-cota">A</text><line x1="140" y1="30" x2="140" y2="90" class="svg-linea"/><line x1="135" y1="30" x2="145" y2="30" class="svg-linea"/><line x1="135" y1="90" x2="145" y2="90" class="svg-linea"/><text x="153" y="64" alignment-baseline="middle" text-anchor="middle" class="svg-cota">B</text><line x1="25" y1="30" x2="25" y2="15" class="svg-linea"/><line x1="37" y1="30" x2="37" y2="15" class="svg-linea"/><line x1="25" y1="20" x2="37" y2="20" class="svg-linea"/><text x="31" y="9" text-anchor="middle" class="svg-cota">e</text></svg>`
};

function cambiarMaterial() {
    let mat = document.getElementById("p_material").value;
    if (mat === "custom") {
        document.getElementById("g_mat_custom").style.display = "block";
        document.getElementById("p_densidad_custom").focus();
    } else {
        document.getElementById("g_mat_custom").style.display = "none";
    }
}

function calcularHexagonoD() {
    let forma = document.getElementById("p_forma").value;
    if(forma !== "hexagonal") return;
    let a = parseFloat(document.getElementById("p_dim_a").value);
    if(a > 0) {
        let d_calc = a / (Math.sqrt(3) / 2);
        document.getElementById("p_dim_hex_calc").value = d_calc.toFixed(2);
    } else {
        document.getElementById("p_dim_hex_calc").value = "";
    }
}

function cambiarFormaPeso() {
    let forma = document.getElementById("p_forma").value;
    
    let gA = document.getElementById("g_dim_a");
    let gB = document.getElementById("g_dim_b");
    let gT = document.getElementById("g_dim_t");
    let gDInt = document.getElementById("g_dim_d_int");
    let gModoRed = document.getElementById("g_modo_tubo_red");
    let gHex = document.getElementById("g_dim_hex");
    
    let lblA = document.getElementById("lbl_dim_a");
    let lblB = document.getElementById("lbl_dim_b");
    let lblT = document.getElementById("lbl_dim_t");

    gB.style.display = "none";
    gT.style.display = "none";
    gDInt.style.display = "none";
    gModoRed.style.display = "none";
    gHex.style.display = "none";
    document.getElementById("res_pesos").style.display = "none";

    let svgKey = forma;

    if (forma === "redondo") {
        lblA.innerText = "Diámetro [ A ] (mm):";
    } else if (forma === "cuadrado") {
        lblA.innerText = "Lado [ A ] (mm):";
    } else if (forma === "hexagonal") {
        lblA.innerText = "Entrecaras [ A ] (mm):";
        gHex.style.display = "block";
        calcularHexagonoD(); 
    } else if (forma === "placa") {
        lblA.innerText = "Ancho [ A ] (mm):";
        lblT.innerText = "Espesor [ e ] (mm):";
        gT.style.display = "block";
    } else if (forma === "tubo_red") {
        gModoRed.style.display = "block";
        let modo = document.getElementById("p_modo_tubo_red").value;
        lblA.innerText = "Diám. Ext. [ A ] (mm):";
        if (modo === "espesor") {
            lblT.innerText = "Pared [ e ] (mm):";
            gT.style.display = "block";
            svgKey = "tubo_red_espesor";
        } else {
            gDInt.style.display = "block";
            svgKey = "tubo_red_interior";
        }
    } else if (forma === "tubo_cua") {
        lblA.innerText = "Lado Ext. [ A ] (mm):";
        lblT.innerText = "Pared [ e ] (mm):";
        gT.style.display = "block";
    } else if (forma === "tubo_rect" || forma === "perfil_u") {
        lblA.innerText = "Base Ext. [ A ] (mm):";
        lblB.innerText = "Alto Ext. [ B ] (mm):";
        lblT.innerText = "Pared [ e ] (mm):";
        gB.style.display = "block";
        gT.style.display = "block";
    }

    document.getElementById("shape_preview").innerHTML = svgShapes[svgKey];
}

function calcularPeso() {
    let val_material = document.getElementById("p_material").value;
    let mat_densidad = 0;
    
    if (val_material === "custom") {
        mat_densidad = parseFloat(document.getElementById("p_densidad_custom").value);
        if (!mat_densidad || mat_densidad <= 0) return alert("Introduce una densidad válida para el material manual.");
    } else {
        mat_densidad = parseFloat(val_material);
    }
    
    let forma = document.getElementById("p_forma").value;
    let a = parseFloat(document.getElementById("p_dim_a").value) || 0;
    let b = parseFloat(document.getElementById("p_dim_b").value) || 0;
    let t = parseFloat(document.getElementById("p_dim_t").value) || 0;
    let d_int = parseFloat(document.getElementById("p_dim_d_int").value) || 0;
    let l = parseFloat(document.getElementById("p_largo").value) || 0;
    let cantidad = parseInt(document.getElementById("p_cantidad").value) || 1; 
    let precio_kg = parseFloat(document.getElementById("p_precio").value) || 0; 

    if (a <= 0 || l <= 0 || cantidad <= 0) return alert("Introduce dimensiones y cantidad válidas.");

    let area_mm2 = 0;

    if (forma === "redondo") {
        area_mm2 = Math.PI * Math.pow(a/2, 2);
    } else if (forma === "cuadrado") {
        area_mm2 = a * a;
    } else if (forma === "hexagonal") {
        area_mm2 = (Math.sqrt(3) / 2) * (a * a);
    } else if (forma === "placa") {
        if (t <= 0) return alert("Falta el espesor.");
        area_mm2 = a * t;
    } else if (forma === "tubo_red") {
        let modo = document.getElementById("p_modo_tubo_red").value;
        if (modo === "espesor") {
            if (t <= 0 || t >= a/2) return alert("Espesor de pared inválido.");
            let diam_interior_calc = a - (2 * t);
            area_mm2 = (Math.PI * Math.pow(a/2, 2)) - (Math.PI * Math.pow(diam_interior_calc/2, 2));
        } else {
            if (d_int <= 0 || d_int >= a) return alert("Diámetro interior inválido.");
            area_mm2 = (Math.PI * Math.pow(a/2, 2)) - (Math.PI * Math.pow(d_int/2, 2));
        }
    } else if (forma === "tubo_cua") {
        if (t <= 0 || t >= a/2) return alert("Espesor de pared inválido.");
        let l_int = a - (2 * t);
        area_mm2 = (a * a) - (l_int * l_int);
    } else if (forma === "tubo_rect") {
        if (t <= 0 || b <= 0 || t >= a/2 || t >= b/2) return alert("Dimensiones o espesor inválidos.");
        let base_int = a - (2 * t);
        let alt_int = b - (2 * t);
        area_mm2 = (a * b) - (base_int * alt_int);
    } else if (forma === "perfil_u") {
        if (t <= 0 || b <= 0 || t >= a || t >= b) return alert("Dimensiones o espesor inválidos.");
        area_mm2 = (a * t) + 2 * ((b - t) * t);
    }

    let volumen_cm3 = (area_mm2 / 100) * (l / 10);
    let peso_unidad_kg = (volumen_cm3 * mat_densidad) / 1000;
    let peso_total_kg = peso_unidad_kg * cantidad;

    let peso_uni_txt = peso_unidad_kg.toFixed(3).replace(".", ",");
    let peso_tot_txt = peso_total_kg.toFixed(3).replace(".", ",");

    let filaUnidad = document.getElementById("p_res_unidad_fila");
    if (cantidad > 1) {
        document.getElementById("p_resultado_unidad_kg").innerText = peso_uni_txt + " kg";
        filaUnidad.style.display = "flex";
    } else {
        filaUnidad.style.display = "none";
    }

    document.getElementById("p_resultado_total_kg").innerText = peso_tot_txt + " kg";

    let filaCoste = document.getElementById("p_res_coste_fila");
    if (precio_kg > 0) {
        let coste_total = peso_total_kg * precio_kg;
        document.getElementById("p_resultado_coste").innerText = coste_total.toFixed(2).replace(".", ",") + " €";
        filaCoste.style.display = "flex";
    } else {
        filaCoste.style.display = "none";
    }

    document.getElementById("res_pesos").style.display = "block";
}

// --- LOGICA CNC ---
const roscas_data = {
    "M3": { paso: 0.5, d_calc: 3, broca_corte: 2.5, broca_lam: 2.8 },
    "M4": { paso: 0.7, d_calc: 4, broca_corte: 3.3, broca_lam: 3.7 },
    "M5": { paso: 0.8, d_calc: 5, broca_corte: 4.2, broca_lam: 4.65 },
    "M6": { paso: 1.0, d_calc: 6, broca_corte: 5.0, broca_lam: 5.55 },
    "M8": { paso: 1.25, d_calc: 8, broca_corte: 6.8, broca_lam: 7.45 },
    "M10": { paso: 1.5, d_calc: 10, broca_corte: 8.5, broca_lam: 9.4 },
    "M12": { paso: 1.75, d_calc: 12, broca_corte: 10.2, broca_lam: 11.2 },
    "M16": { paso: 2.0, d_calc: 16, broca_corte: 14.0 },
    "M20": { paso: 2.5, d_calc: 20, broca_corte: 17.5 },
    "M24": { paso: 3.0, d_calc: 24, broca_corte: 21.0 },

    "M6x0.75": { paso: 0.75, d_calc: 6, broca_corte: 5.2 },
    "M8x1": { paso: 1.0, d_calc: 8, broca_corte: 7.0 },
    "M10x1": { paso: 1.0, d_calc: 10, broca_corte: 9.0 },
    "M10x1.25": { paso: 1.25, d_calc: 10, broca_corte: 8.8 },
    "M12x1": { paso: 1.0, d_calc: 12, broca_corte: 11.0 },
    "M12x1.25": { paso: 1.25, d_calc: 12, broca_corte: 10.8 },
    "M12x1.5": { paso: 1.5, d_calc: 12, broca_corte: 10.5 },
    "M16x1.5": { paso: 1.5, d_calc: 16, broca_corte: 14.5 },

    "G1/8": { paso: 0.907, hilos: "28 Gg/1\"", d_calc: 9.73, broca_corte: 8.8 },
    "G1/4": { paso: 1.337, hilos: "19 Gg/1\"", d_calc: 13.16, broca_corte: 11.8 },
    "G3/8": { paso: 1.337, hilos: "19 Gg/1\"", d_calc: 16.66, broca_corte: 15.25 },
    "G1/2": { paso: 1.814, hilos: "14 Gg/1\"", d_calc: 20.96, broca_corte: 19.0 },
    "G5/8": { paso: 1.814, hilos: "14 Gg/1\"", d_calc: 22.91, broca_corte: 21.0 },
    "G3/4": { paso: 1.814, hilos: "14 Gg/1\"", d_calc: 26.44, broca_corte: 24.5 },
    "G1": { paso: 2.309, hilos: "11 Gg/1\"", d_calc: 33.25, broca_corte: 30.25 }
};

const tungaloy_data = {
    "50": { "acero_blando": { vc: 180, fn: 6.0, ap: "0,5" }, "acero_duro": { vc: 140, fn: 6.0, ap: "0,5" }, "inox": { vc: 120, fn: 6.0, ap: "0,5" }, "inox_duro": { vc: 100, fn: 6.0, ap: "0,5" } },
    "25": { "acero_blando": { vc: 180, fn: 2.7, ap: "0,5" }, "acero_duro": { vc: 140, fn: 2.7, ap: "0,5" }, "inox": { vc: 120, fn: 2.7, ap: "0,5" }, "inox_duro": { vc: 100, fn: 2.7, ap: "0,5" } },
    "20": { "acero_blando": { vc: 180, fn: 1.8, ap: "0,5" }, "acero_duro": { vc: 140, fn: 1.8, ap: "0,5" }, "inox": { vc: 120, fn: 1.8, ap: "0,5" }, "inox_duro": { vc: 100, fn: 1.8, ap: "0,5" } },
    "16": { "acero_blando": { vc: 180, fn: 1.0, ap: "0,5" }, "acero_duro": { vc: 140, fn: 1.0, ap: "0,5" }, "inox": { vc: 120, fn: 1.0, ap: "0,5" }, "inox_duro": { vc: 100, fn: 1.0, ap: "0,5" } },
    "12": { "acero_blando": { vc: 200, fn: 0.5, ap: "0,3" }, "acero_duro": { vc: 150, fn: 0.4, ap: "0,2" }, "inox": { vc: 120, fn: 0.4, ap: "0,2" }, "inox_duro": { vc: 100, fn: 0.3, ap: "0,2" } }
};

function redondear(valor, multiplo) {
    return Math.round(valor / multiplo) * multiplo;
}

function abrirHerramienta(evento, idHerramienta) {
    let contenidos = document.getElementById("modulo_cnc").getElementsByClassName("tab-content");
    for (let i = 0; i < contenidos.length; i++) contenidos[i].style.display = "none";
    let pestanas = document.getElementById("modulo_cnc").getElementsByClassName("pestana");
    for (let i = 0; i < pestanas.length; i++) pestanas[i].classList.remove("active");
    document.getElementById(idHerramienta).style.display = "block";
    evento.currentTarget.classList.add("active");
}

function actualizarInfoBroca() {
    let tipo = document.getElementById("tipo_broca").value;
    let sub = document.getElementById("brocas_subtitulo");
    if (tipo === "int") sub.innerText = "MD - Refrig. Interna";
    else if (tipo === "ext") sub.innerText = "MD - Refrig. Externa";
    else if (tipo === "hss") sub.innerText = "HSS - Acero Rápido";
    else if (tipo === "placas") sub.innerText = "Herramienta de Placas Intercambiables";
    document.getElementById("res_brocas_uni").style.display = "none";
}

function calcularBrocas() {
    let tipo = document.getElementById("tipo_broca").value;
    let d = parseFloat(document.getElementById("diam_broca_uni").value);
    let mat = document.getElementById("mat_broca_uni").value;
    if (!d || d <= 0) return alert("Introduce un diámetro válido.");
    let vc, fn, q_val = null, rpm_max = 9000, ciclo = "", nota = "";

    if (tipo === "int") {
        vc = (mat === "acero") ? 50 : (mat === "alu" ? 150 : 35);
        fn = 0.085 + (d * 0.005);
        if (mat === "alu") fn += 0.01;
        rpm_max = 9000; ciclo = "G81 o G82"; 
    } else if (tipo === "ext") {
        vc = (mat === "acero") ? 35 : (mat === "alu" ? 80 : 30);
        fn = 0.060 + (d * 0.005);
        if (mat === "alu") fn += 0.02;
        if (mat === "inox" || mat === "acero_duro") fn -= 0.01;
        rpm_max = 8000;
        let mult_q = (mat === "acero" || mat === "alu") ? 0.6 : 0.5;
        q_val = Math.round(d * mult_q);
        if (q_val < 1) q_val = 1;
        ciclo = "G82";
    } else if (tipo === "hss") {
        vc = (mat === "acero") ? 22 : (mat === "alu" ? 40 : (mat === "acero_duro" ? 14 : 12));
        if (d <= 3) fn = 0.04; else if (d <= 5) fn = 0.06; else if (d <= 7) fn = 0.08; else if (d <= 10) fn = 0.11; else if (d <= 14) fn = 0.14; else fn = 0.18;
        if (mat === "alu") fn *= 1.3;
        if (mat === "inox" || mat === "acero_duro") fn *= 0.85; 
        rpm_max = 5000;
        let q_calc = d * 0.4;
        if (mat === "alu") q_calc *= 1.4; else if (mat === "acero_duro" || mat === "inox") q_calc *= 0.8;
        let q_max = (mat === "alu") ? 8.0 : ((mat === "acero") ? 4.5 : 3.5);
        if (q_calc > q_max) q_calc = q_max;
        q_val = Math.round(q_calc * 2) / 2;
        if (q_val < 0.5) q_val = 0.5;
        ciclo = "G82";
        nota = "Pasada (Q) ajustada y redondeada según material y diámetro para brocas HSS.";
    } else if (tipo === "placas") {
        if (mat === "acero") { vc = 120; fn = 0.08; } else if (mat === "acero_duro") { vc = 90; fn = 0.07; } else if (mat === "inox") { vc = 100; fn = 0.08; } else if (mat === "alu") { vc = 135; fn = 0.10; }
        rpm_max = 9000; ciclo = "G81";
    }

    let rpm_teo = (vc * 1000) / (Math.PI * d);
    let rpm = (tipo === "hss") ? redondear(Math.min(rpm_teo, rpm_max), 10) : redondear(Math.min(rpm_teo, rpm_max), 50);
    let f_total = Math.round(rpm * fn);

    document.getElementById("b_ciclo").innerText = ciclo;
    document.getElementById("b_s").innerHTML = rpm_teo > rpm_max ? "<span class='limit-warning'>" + rpm + " (Tope)</span>" : rpm + " RPM";
    document.getElementById("b_f").innerText = "F " + f_total + " mm/min";
    document.getElementById("b_fn").innerText = fn.toFixed(3) + " mm/rev";
    
    if (q_val !== null) {
        document.getElementById("b_q").innerText = "Q " + (tipo === "hss" ? q_val.toFixed(1).replace(".",",") : q_val) + " mm";
        document.getElementById("row_q").style.display = "flex";
    } else {
        document.getElementById("row_q").style.display = "none";
    }

    if (nota) {
        document.getElementById("b_nota").innerHTML = "<span class='title'>Nota de Ajuste</span>" + nota;
        document.getElementById("b_nota").style.display = "block";
    } else {
        document.getElementById("b_nota").style.display = "none";
    }
    document.getElementById("res_brocas_uni").style.display = "block";
}

function mostrarDesplegableRosca() {
    let tipo = document.getElementById("tipo_rosca").value;
    document.getElementById("select_rosca_m").style.display = (tipo === 'M') ? "block" : "none";
    document.getElementById("select_rosca_mf").style.display = (tipo === 'MF') ? "block" : "none";
    document.getElementById("select_rosca_g").style.display = (tipo === 'G') ? "block" : "none";
    document.getElementById("select_rosca_m").value = "";
    document.getElementById("select_rosca_mf").value = "";
    document.getElementById("select_rosca_g").value = "";
    document.getElementById("res_rosca").style.display = "none";
}

function actualizarRosca() {
    let tipo = document.getElementById("tipo_rosca").value;
    let val = "";
    if (tipo === 'M') val = document.getElementById("select_rosca_m").value;
    else if (tipo === 'MF') val = document.getElementById("select_rosca_mf").value;
    else if (tipo === 'G') val = document.getElementById("select_rosca_g").value;

    if (!val) { document.getElementById("res_rosca").style.display = "none"; return; }

    let mat = document.getElementById("mat_rosca").value;
    let d = roscas_data[val];
    let usa_lam = (tipo === 'M' && d.d_calc <= 12);
    let vc;
    
    if (usa_lam) {
        if (mat === "acero") vc = 6.6; else if (mat === "acero_duro") vc = 4; else if (mat === "inox") vc = 4; else if (mat === "alu") vc = 10; 
    } else if (tipo === 'MF') {
        if (mat === "acero") vc = 12; else if (mat === "acero_duro") vc = 6; else if (mat === "inox") vc = 5; else if (mat === "alu") vc = 12; 
    } else if (tipo === 'G') {
        if (mat === "acero") vc = 10; else if (mat === "acero_duro") vc = 5; else if (mat === "inox") vc = 5; else if (mat === "alu") vc = 9; 
    } else {
        if (mat === "acero") vc = 5.6; else if (mat === "acero_duro") vc = 3; else if (mat === "inox") vc = 3; else if (mat === "alu") vc = 8;
    }

    let rpm_teo = (vc * 1000) / (Math.PI * d.d_calc);
    let base_rpm = Math.round(rpm_teo / 10) * 10; 
    let rpm = base_rpm;

    for (let offset = 0; offset <= 50; offset += 10) {
        let t_up = base_rpm + offset; let test_up = t_up * d.paso;
        if (Math.abs(test_up - Math.round(test_up)) < 0.001 && Math.round(test_up) % 10 === 0) { rpm = t_up; break; }
        let t_down = base_rpm - offset; let test_down = t_down * d.paso;
        if (t_down > 0 && Math.abs(test_down - Math.round(test_down)) < 0.001 && Math.round(test_down) % 10 === 0) { rpm = t_down; break; }
    }

    let f_total = Math.round(rpm * d.paso); 
    let paso_str = d.hilos ? `${d.paso} mm (${d.hilos})` : `${d.paso} mm`;
    document.getElementById("r_paso").innerText = paso_str;

    let tipo_macho = usa_lam ? "Laminación" : "Corte";
    let recomendacion = "";
    if (usa_lam) { recomendacion = "Utilizar un macho de laminación (conformado en frío) para esta medida.";
    } else {
        if (mat === "alu") recomendacion = "Utilizar un macho brillante (sin revestimiento) diseñado para aluminio.";
        else if (mat === "inox" || mat === "acero_duro") recomendacion = "Utilizar un macho vaporizado (anillo azul/rojo) o con recubrimiento duro (ej. TiN).";
        else recomendacion = "Utilizar un macho vaporizado o uno estándar de corte.";
    }

    document.getElementById("r_tipo_macho").innerHTML = `Ciclo: <span class='badge'>G84 Rígido</span> | Macho: <b>${tipo_macho}</b>`;
    document.getElementById("r_marca_nota").innerHTML = "<span class='title'>Recomendación</span>" + recomendacion;
    document.getElementById("r_marca_nota").style.display = "block";

    if (usa_lam) document.getElementById("r_broca").innerText = "Ø " + d.broca_lam.toString().replace(".",",") + " mm";
    else document.getElementById("r_broca").innerText = "Ø " + d.broca_corte.toString().replace(".",",") + " mm";

    document.getElementById("r_rpm_rosca").innerText = rpm + " RPM";
    document.getElementById("r_f_rosca").innerText = "F " + f_total + " mm/min";
    document.getElementById("res_rosca").style.display = "block";
}

function cambiarTipoFresa() {
    let tipo = document.getElementById("tipo_fresa_sel").value;
    document.getElementById("ui_fresa_general").style.display = (tipo === 'general') ? "block" : "none";
    document.getElementById("ui_fresa_cocodrilo").style.display = (tipo === 'cocodrilo') ? "block" : "none";
    document.getElementById("ui_fresa_ranuras").style.display = (tipo === 'ranuras') ? "block" : "none";
    document.getElementById("res_fresa").style.display = "none";
}

function calcularFresado() {
    let tipo = document.getElementById("tipo_fresa_sel").value;
    document.getElementById("res_fresa_general").style.display = "none";
    document.getElementById("res_fresa_avanzada").style.display = "none";

    if (tipo === "general") {
        let rpm = parseFloat(document.getElementById("rpm_fresa").value);
        let z = parseFloat(document.getElementById("z_fresa").value);
        let fz = parseFloat(document.getElementById("fz_fresa").value);
        if (!rpm || !z || !fz) return;
        let f_total = Math.round(rpm * z * fz);
        document.getElementById("f_total_fresa").innerText = "F " + f_total + " mm/min";
        document.getElementById("res_fresa_general").style.display = "block";
    }
    else if (tipo === "cocodrilo") {
        let d = parseFloat(document.getElementById("d_coco").value);
        let mat = document.getElementById("mat_coco").value;
        if(!d) return alert("Introduce un diámetro.");
        let vc, fz_base;
        if(mat === "acero") { vc = 35; fz_base = 0.014; } 
        else if(mat === "acero_duro") { vc = 18; fz_base = 0.011; }
        else if(mat === "inox") { vc = 12; fz_base = 0.009; }
        else if(mat === "alu") { vc = 80; fz_base = 0.022; }

        let fz = fz_base * (d / 15);
        if(fz < 0.005) fz = 0.005;
        let z = (mat === "alu") ? 3 : 4; 

        let rpm = Math.round((vc * 1000) / (Math.PI * d) / 10) * 10;
        let f = Math.round(rpm * fz * z);

        document.getElementById("s_fresa_avz").innerText = rpm + " RPM";
        document.getElementById("f_fresa_avz").innerText = "F " + f + " mm/min";
        document.getElementById("nota_fresa_avz").innerHTML = "<span class='title'>Herramienta</span>Cálculos ajustados para Fresa Desbaste <b>HSS-Co8</b>.";
        document.getElementById("res_fresa_avanzada").style.display = "block";
    }
    else if (tipo === "ranuras") {
        let d = parseFloat(document.getElementById("d_ran").value);
        let w = parseFloat(document.getElementById("w_ran").value);
        let mat = document.getElementById("mat_ran").value;
        let corte = document.getElementById("tipo_corte_ran").value;
        if(!d || !w) return alert("Faltan datos de la fresa.");

        let z = Math.max(4, Math.round(d * 0.6)); 
        let vc, fz_base;
        if(mat === "acero") { vc = 20; fz_base = 0.040; } 
        else if(mat === "acero_duro") { vc = 12; fz_base = 0.025; }
        else if(mat === "inox") { vc = 10; fz_base = 0.020; }
        else if(mat === "alu") { vc = 55; fz_base = 0.060; } 

        let fz = fz_base * (d / 16.5);
        let factor_ancho = 1; let info_ancho = "";
        if (w <= 2) { factor_ancho = 0.85; info_ancho = "<br><i>(Avance -15% por disco estrecho ≤ 2mm)</i>"; } 
        else if (w >= 4) { factor_ancho = 1.15; info_ancho = "<br><i>(Avance +15% por disco robusto ≥ 4mm)</i>"; }
        
        fz = fz * factor_ancho;
        if(fz < 0.005) fz = 0.005;

        if (corte === "completa") { vc *= 0.8; fz *= 0.7; }
        let rpm = Math.round((vc * 1000) / (Math.PI * d) / 10) * 10;
        let f = Math.round(rpm * fz * z);

        let nota_extra = corte === "completa" ? "<br><i>(Reducción de seguridad aplicada por ranura ciega)</i>" : "";
        document.getElementById("s_fresa_avz").innerText = rpm + " RPM";
        document.getElementById("f_fresa_avz").innerText = "F " + f + " mm/min";
        document.getElementById("nota_fresa_avz").innerHTML = "<span class='title'>Herramienta</span>Cálculos para Fresa Ranuras T <b>HSS Co5</b>. <br>Labios calculados (Z): <b>" + z + "</b>" + nota_extra + info_ancho;
        document.getElementById("res_fresa_avanzada").style.display = "block";
    }
    document.getElementById("res_fresa").style.display = "block";
}

function calcularEscariador() {
    let d = parseFloat(document.getElementById("diam_esc").value);
    let mat = document.getElementById("mat_esc").value;
    let tipo = document.getElementById("tipo_esc").value;
    if (!d || d <= 0) return alert("Introduce un diámetro válido.");
    let vc, fn_base;
    if (tipo === "hss") {
        if (mat === "acero") vc = 10; else if (mat === "acero_duro") vc = 5; else if (mat === "inox") vc = 4; else if (mat === "alu") vc = 15;
        if (d <= 3) fn_base = 0.08; else if (d <= 5) fn_base = 0.12; else if (d <= 10) fn_base = 0.18; else fn_base = 0.20;
    } else { 
        if (mat === "acero") vc = 15; else if (mat === "acero_duro") vc = 8; else if (mat === "inox") vc = 6; else if (mat === "alu") vc = 25;
        if (d <= 4) fn_base = 0.08; else if (d <= 6) fn_base = 0.10; else if (d <= 10) fn_base = 0.14; else fn_base = 0.14;
    }
    if (d <= 4) vc = vc * 0.7;
    let fn = fn_base;
    if (mat === "alu") fn = fn_base * 1.2;
    if (mat === "acero_duro" || mat === "inox") fn = fn_base * 0.8;

    let rpm_teo = (vc * 1000) / (Math.PI * d);
    let rpm_max = (mat === "alu") ? 1800 : 1200; 
    let rpm = redondear(Math.min(rpm_teo, rpm_max), 10); 
    let f_total = Math.round(rpm * fn);
    if (f_total < 5) f_total = 5; 

    let broca_previa = d <= 10 ? d - 0.2 : d - 0.3;
    document.getElementById("esc_broca").innerHTML = "<span class='badge-info'>Ø " + broca_previa.toFixed(1).replace(".",",") + " mm</span>";
    document.getElementById("esc_rpm").innerHTML = rpm_teo > rpm_max ? "<span class='limit-warning'>" + rpm + " (Tope)</span>" : rpm + " RPM";
    document.getElementById("esc_f").innerText = "F " + f_total + " mm/min";
    document.getElementById("esc_fn").innerText = fn.toFixed(2) + " mm/rev";
    document.getElementById("res_escariador").style.display = "block";
}

function calcularNine9() {
    let t = parseFloat(document.getElementById("depth").value);
    let mat = document.getElementById("material_nine9").value;
    const RPM_MAX = 9000; 
    if (!t || t <= 0) return;
    let d = t * 2;
    let vc, f_spot_max, f_spot_min, f_chamf_max, f_chamf_min;
    if (mat === "acero") { vc=180; f_spot_max=0.10; f_spot_min=0.05; f_chamf_max=0.24; f_chamf_min=0.10; }
    else if (mat === "acero_duro") { vc=140; f_spot_max=0.08; f_spot_min=0.04; f_chamf_max=0.20; f_chamf_min=0.08; }
    else if (mat === "inox") { vc=90; f_spot_max=0.07; f_spot_min=0.03; f_chamf_max=0.15; f_chamf_min=0.06; }
    else if (mat === "alu") { vc=250; f_spot_max=0.10; f_spot_min=0.05; f_chamf_max=0.25; f_chamf_min=0.10; }

    let ratio = Math.max(0, Math.min(1, (d - 2) / 16)); 
    let f_spot = f_spot_max - ratio * (f_spot_max - f_spot_min);
    let f_chamf = f_chamf_max - ratio * (f_chamf_max - f_chamf_min);

    let s_teo = (vc * 1000) / (Math.PI * d);
    let s_real = redondear(Math.min(s_teo, RPM_MAX), 50);
    let f_spot_val = Math.round(s_real * f_spot);
    let f_chamf_val = Math.round(s_real * f_chamf);

    document.getElementById("d_nine9").innerText = d.toFixed(1) + " mm";
    document.getElementById("s_nine9").innerHTML = s_teo > RPM_MAX ? "<span class='limit-warning'>" + s_real + " (Tope)</span>" : s_real + " RPM";
    document.getElementById("f_spot_nine9").innerText = "F " + f_spot_val;
    document.getElementById("f_chamf_nine9").innerText = "F " + f_chamf_val;
    document.getElementById("res_nine9").style.display = "block";
}

function calcularTungaloy() {
    let diam = document.getElementById("diam_tungaloy").value;
    let mat = document.getElementById("mat_tungaloy").value;
    let d = tungaloy_data[diam][mat];
    let rpm_teo = (d.vc * 1000) / (Math.PI * parseInt(diam));
    let rpm = redondear(rpm_teo, 50);
    let f_val = Math.round(rpm * d.fn);
    
    document.getElementById("s_tungaloy").innerText = rpm + " RPM";
    document.getElementById("f_tungaloy").innerText = "F " + f_val + " mm/min";
    document.getElementById("ap_tungaloy").innerText = d.ap + " mm";
    document.getElementById("fn_tungaloy").innerText = d.fn.toFixed(2).replace(/\./g, ",") + " mm/rev";
    document.getElementById("res_tungaloy").style.display = "block";
}
