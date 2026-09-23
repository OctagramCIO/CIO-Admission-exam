// BANCO DE PREGUNTAS ÉTICAS Y TÉCNICAS
const ethicalQuestions = [
    {
        id: "e1",
        q: "PREGUNTA ÉTICA: Te encuentras con una base de datos filtrada de una entidad con credenciales activas. ¿Cuál es tu primera acción?",
        options: [
            "A) Probar las credenciales en otros servicios.",
            "B) Compartirla en grupos privados para ganar reputación.",
            "C) Reportar el hallazgo de manera responsable (Responsible Disclosure) a los canales oficiales.",
            "D) Publicarla en redes sociales."
        ],
        correct: 2
    },
    {
        id: "e2",
        q: "PREGUNTA ÉTICA: Si en la CIO te asignan un proyecto en el que no tienes experiencia previa, ¿qué haces?",
        options: [
            "A) Digo que sí sé para impresionar y busco que alguien más lo haga.",
            "B) Miento sobre el tiempo para ponerme a estudiar a última hora.",
            "C) Indico transparentemente mi nivel actual y muestro disposición para aprender.",
            "D) Rechazo la tarea de inmediato."
        ],
        correct: 2
    }
];

const technicalQuestions = {
    1: [ // NIVEL 1
        {
            id: "t1_1",
            q: "NIVEL 1: Un sistema responde lento. ¿Qué herramienta o comando usas en tu OS habitual (Windows/Linux/macOS) para ver qué proceso consume la CPU?",
            type: "open"
        },
        {
            id: "t1_2",
            q: "NIVEL 1: ¿Cuál es la diferencia fundamental entre una Inyección SQL (SQLi) y Cross-Site Scripting (XSS)?",
            type: "open"
        }
    ],
    2: [ // NIVEL 2
        {
            id: "t2_1",
            q: "NIVEL 2: En la captura '10.0.0.15:49152 -> 192.168.1.50:80 [SYN]', ¿qué proceso TCP se está iniciando?",
            type: "open"
        },
        {
            id: "t2_2",
            q: "NIVEL 2: ¿Por qué en un cifrado híbrido se usa cifrado asimétrico para la clave y simétrico para los datos pesados?",
            type: "open"
        }
    ],
    3: [ // NIVEL 3
        {
            id: "t3_1",
            q: "NIVEL 3: Explicar en qué consiste la amenaza SNDL (Store Now, Decrypt Later) frente a la llegada de la computación cuántica.",
            type: "open"
        }
    ]
};

let currentQuiz = [];
let userData = {};

function startExam() {
    const alias = document.getElementById('user-alias').value;
    const contact = document.getElementById('user-contact').value;
    const level = parseInt(document.getElementById('user-level').value);

    if (!alias || !contact) {
        alert("Por favor completa tu Alias y medio de contacto.");
        return;
    }

    userData = { alias, contact, level };

    // Mezclar preguntas éticas
    currentQuiz = [...ethicalQuestions.sort(() => 0.5 - Math.random())];

    // Cargar preguntas técnicas acumulativas según nivel seleccionado
    for (let l = 1; l <= level; l++) {
        if (technicalQuestions[l]) {
            currentQuiz = currentQuiz.concat(technicalQuestions[l]);
        }
    }

    renderQuiz();
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
}

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = "";

    currentQuiz.forEach((q, idx) => {
        const qDiv = document.createElement('div');
        qDiv.className = "border-l-2 border-green-500 pl-4 py-2";

        let html = `<p class="text-sm font-bold text-green-300 mb-2">${idx + 1}. ${q.q}</p>`;

        if (q.options) {
            q.options.forEach((opt, oIdx) => {
                html += `
                    <label class="block text-xs text-gray-300 my-1 cursor-pointer hover:text-green-400">
                        <input type="radio" name="q_${q.id}" value="${oIdx}" class="mr-2"> ${opt}
                    </label>
                `;
            });
        } else {
            html += `
                <textarea name="q_${q.id}" class="w-full bg-gray-900 border border-green-800 rounded p-2 text-xs text-green-300 h-20" placeholder="Escribe tu respuesta aquí..."></textarea>
            `;
        }

        qDiv.innerHTML = html;
        container.appendChild(qDiv);
    });
}

function submitExam() {
    let resultsText = `=== FICHA DE ADMISIÓN CIO ===\n`;
    resultsText += `ALIAS: ${userData.alias}\nCONTACTO: ${userData.contact}\nNIVEL DECLARADO: Nivel ${userData.level}\n=============================\n\nRESPUESTAS:\n`;

    currentQuiz.forEach((q, idx) => {
        resultsText += `[P${idx + 1} - ${q.id}]: `;
        if (q.options) {
            const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
            resultsText += selected ? q.options[selected.value] : "Sin responder";
        } else {
            const text = document.querySelector(`textarea[name="q_${q.id}"]`).value;
            resultsText += text ? text.replace(/\n/g, " ") : "Sin responder";
        }
        resultsText += `\n`;
    });

    document.getElementById('final-output').value = resultsText;
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
}

function copyResults() {
    const copyText = document.getElementById("final-output");
    copyText.select();
    document.execCommand("copy");
    alert("¡Ficha copiada! Ahora envíala al Telegram oficial de admisión de la CIO.");
}
