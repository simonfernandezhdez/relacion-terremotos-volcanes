const modes = {
    plates: {
        number: "MODO 01",
        status: "PLACAS TECTÓNICAS",
        title: "Las placas se mueven",
        text: "La superficie terrestre está dividida en placas tectónicas que se desplazan lentamente. Cuando interactúan, pueden producir terremotos y, en determinadas condiciones, favorecer la formación de volcanes.",
        key: "IDEA CLAVE: la actividad interna de la Tierra conecta muchos procesos geológicos."
    },
    quake: {
        number: "MODO 02",
        status: "ACTIVIDAD SÍSMICA",
        title: "La energía se libera",
        text: "Cuando las rocas acumulan tensión y se desplazan bruscamente a lo largo de una falla, liberan energía en forma de ondas sísmicas. El hipocentro es el lugar donde comienza el terremoto y el epicentro está justo encima, en la superficie.",
        key: "IDEA CLAVE: los terremotos liberan energía acumulada en las rocas."
    },
    volcano: {
        number: "MODO 03",
        status: "ACTIVIDAD VOLCÁNICA",
        title: "El magma asciende",
        text: "En determinadas zonas, el magma puede ascender desde el interior de la Tierra. Cuando llega a la superficie se llama lava. La interacción entre placas puede favorecer la formación de magma y de volcanes.",
        key: "IDEA CLAVE: el magma está bajo la superficie; la lava sale al exterior."
    }
};

const buttons = document.querySelectorAll(".mode-btn");
const statusLabel = document.getElementById("scene-status");
const numberLabel = document.getElementById("explanation-number");
const titleLabel = document.getElementById("explanation-title");
const textLabel = document.getElementById("explanation-text");
const keyLabel = document.getElementById("key-text");

const plates = document.getElementById("plates");
const arrows = document.getElementById("plate-arrows");
const volcano = document.getElementById("volcano");
const quakeWaves = document.getElementById("quake-waves");

let currentMode = "plates";
let quakeTimer;

function showMode(mode) {
    if (!modes[mode]) return;

    currentMode = mode;
    const data = modes[mode];

    buttons.forEach(button => {
        const active = button.dataset.mode === mode;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    statusLabel.textContent = data.status;
    numberLabel.textContent = data.number;
    titleLabel.textContent = data.title;
    textLabel.textContent = data.text;
    keyLabel.textContent = data.key;

    plates.style.opacity = mode === "volcano" ? "0.55" : "1";
    arrows.style.opacity = mode === "plates" ? "1" : "0";
    volcano.style.opacity = mode === "volcano" ? "1" : "0";
    quakeWaves.style.opacity = mode === "quake" ? "1" : "0";

    if (mode === "quake") {
        quakeWaves.classList.remove("restarting");
        void quakeWaves.getBoundingClientRect();
        quakeWaves.classList.add("restarting");
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        showMode(button.dataset.mode);
    });
});

showMode(currentMode);


const regions = {
    japan: {
        label: "REGIÓN 01",
        title: "Japón",
        text: "Japón está situado cerca de varias placas tectónicas. Su interacción provoca terremotos frecuentes y ha favorecido la formación de numerosos volcanes.",
        fact: "IDEA CLAVE: la interacción entre placas puede generar terremotos y actividad volcánica."
    },
    andes: {
        label: "REGIÓN 02",
        title: "Los Andes",
        text: "A lo largo de la costa occidental de Sudamérica, la placa de Nazca se introduce bajo la placa Sudamericana. Este proceso contribuye a los terremotos y al volcanismo de los Andes.",
        fact: "IDEA CLAVE: la subducción puede producir terremotos y generar magma."
    },
    indonesia: {
        label: "REGIÓN 03",
        title: "Indonesia",
        text: "Indonesia se encuentra en una zona donde interactúan varias placas tectónicas. La subducción explica gran parte de su actividad sísmica y la presencia de numerosos volcanes.",
        fact: "IDEA CLAVE: muchas zonas volcánicas se encuentran cerca de límites de placas."
    },
    newzealand: {
        label: "REGIÓN 04",
        title: "Nueva Zelanda",
        text: "Nueva Zelanda se sitúa junto al límite entre las placas del Pacífico y Australiana. Allí se producen terremotos y existe actividad volcánica en algunas zonas.",
        fact: "IDEA CLAVE: los límites de placas pueden presentar distintos tipos de actividad geológica."
    }
};

const regionButtons = document.querySelectorAll(".region-btn");

regionButtons.forEach(button => {
    button.addEventListener("click", () => {
        const region = regions[button.dataset.region];
        if (!region) return;

        regionButtons.forEach(item => {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        });

        document.getElementById("region-label").textContent = region.label;
        document.getElementById("region-title").textContent = region.title;
        document.getElementById("region-text").textContent = region.text;
        document.getElementById("region-fact").textContent = region.fact;
    });
});

/* SIMULACIÓN INTERACTIVA DE TERREMOTOS */
(() => {
    const visual = document.getElementById("quake-visual");
    const startButton = document.getElementById("quake-start");
    const resetButton = document.getElementById("quake-reset");
    const title = document.getElementById("quake-stage-title");
    const description = document.getElementById("quake-stage-text");
    const steps = document.querySelectorAll(".quake-step");

    // Si la sección no existe, no hacemos nada.
    if (!visual || !startButton || !resetButton || !title || !description) {
        return;
    }

    let timerIds = [];

    const stages = [
        {
            title: "1. Se acumula la tensión",
            text: "Las placas ejercen fuerzas sobre las rocas. La tensión aumenta poco a poco hasta que las rocas pueden superar su resistencia."
        },
        {
            title: "2. Se produce la ruptura",
            text: "Las rocas se rompen o se deslizan bruscamente a lo largo de una falla. La energía acumulada se libera."
        },
        {
            title: "3. Se propagan las ondas sísmicas",
            text: "La energía viaja en forma de ondas sísmicas a través de la Tierra. Estas ondas provocan las vibraciones que registran los sismógrafos."
        }
    ];

    function clearTimers() {
        timerIds.forEach(id => clearTimeout(id));
        timerIds = [];
    }

    function showStage(index) {
        title.textContent = stages[index].title;
        description.textContent = stages[index].text;

        steps.forEach((step, i) => {
            step.classList.toggle("active", i <= index);
        });

        visual.classList.remove("quake-loading", "quake-shaking");

        if (index === 0) {
            visual.classList.add("quake-loading");
        } else if (index === 1) {
            visual.classList.add("quake-shaking");
        } else if (index === 2) {
            visual.classList.add("quake-shaking");
        }
    }

    function resetSimulation() {
        clearTimers();
        visual.classList.remove("quake-loading", "quake-shaking");
        title.textContent = stages[0].title;
        description.textContent = "Las rocas soportan fuerzas debido al movimiento de las placas. La tensión aumenta hasta que se supera su resistencia.";

        steps.forEach((step, i) => {
            step.classList.toggle("active", i === 0);
        });

        startButton.disabled = false;
        startButton.textContent = "Iniciar terremoto";
    }

    startButton.addEventListener("click", () => {
        clearTimers();
        startButton.disabled = true;
        startButton.textContent = "Simulación en marcha…";

        showStage(0);

        timerIds.push(setTimeout(() => {
            showStage(1);
        }, 2200));

        timerIds.push(setTimeout(() => {
            showStage(2);
        }, 4200));

        timerIds.push(setTimeout(() => {
            visual.classList.remove("quake-loading", "quake-shaking");
            startButton.disabled = false;
            startButton.textContent = "Repetir terremoto";
        }, 7000));
    });

    resetButton.addEventListener("click", resetSimulation);
    resetSimulation();
})();

/* SIMULACIÓN INTERACTIVA DEL VOLCÁN */
(() => {
    const visual = document.getElementById("volcano-visual");
    const startButton = document.getElementById("volcano-start");
    const resetButton = document.getElementById("volcano-reset");
    const title = document.getElementById("volcano-stage-title");
    const description = document.getElementById("volcano-stage-text");
    const steps = document.querySelectorAll(".volcano-step");

    if (!visual || !startButton || !resetButton || !title || !description) {
        return;
    }

    let timerIds = [];

    const stages = [
        {
            title: "1. Se acumula el magma",
            text: "El magma puede acumularse en el interior de la Tierra. La presión y otros factores pueden favorecer su ascenso."
        },
        {
            title: "2. El magma asciende",
            text: "El magma puede subir por fracturas y conductos. Si las condiciones son adecuadas, alcanza la superficie."
        },
        {
            title: "3. Se produce la erupción",
            text: "El material volcánico sale al exterior. El magma que llega a la superficie se denomina lava."
        }
    ];

    function clearTimers() {
        timerIds.forEach(id => clearTimeout(id));
        timerIds = [];
    }

    function showStage(index) {
        title.textContent = stages[index].title;
        description.textContent = stages[index].text;

        steps.forEach((step, i) => {
            step.classList.toggle("active", i <= index);
        });

        visual.classList.remove("eruption-starting", "eruption-active");

        if (index === 1) {
            visual.classList.add("eruption-starting");
        }

        if (index === 2) {
            visual.classList.add("eruption-active");
        }
    }

    function resetSimulation() {
        clearTimers();
        visual.classList.remove("eruption-starting", "eruption-active");

        title.textContent = stages[0].title;
        description.textContent =
            "El magma puede acumularse en el interior de la Tierra. La presión y otros factores pueden favorecer su ascenso.";

        steps.forEach((step, i) => {
            step.classList.toggle("active", i === 0);
        });

        startButton.disabled = false;
        startButton.textContent = "Iniciar erupción";
    }

    startButton.addEventListener("click", () => {
        clearTimers();
        startButton.disabled = true;
        startButton.textContent = "Erupción en marcha…";

        showStage(0);

        timerIds.push(setTimeout(() => {
            showStage(1);
        }, 2200));

        timerIds.push(setTimeout(() => {
            showStage(2);
        }, 4200));

        timerIds.push(setTimeout(() => {
            visual.classList.remove("eruption-starting", "eruption-active");
            startButton.disabled = false;
            startButton.textContent = "Repetir erupción";
        }, 7000));
    });

    resetButton.addEventListener("click", resetSimulation);
    resetSimulation();
})();

/* ===== CUESTIONARIO INTERACTIVO ===== */

(() => {
    const form = document.getElementById("earth-quiz");
    const resetButton = document.getElementById("quiz-reset");
    const result = document.getElementById("quiz-result");

    // Evita errores si el cuestionario no está en la página.
    if (!form || !resetButton || !result) {
        return;
    }

    const questions = Array.from(
        form.querySelectorAll(".quiz-question")
    );

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let score = 0;
        let unanswered = 0;

        questions.forEach((question) => {
            const correctAnswer = question.dataset.correct;

            const selected = question.querySelector(
                'input[type="radio"]:checked'
            );

            question.classList.remove("correct", "incorrect");

            question.querySelectorAll("label").forEach((label) => {
                label.classList.remove(
                    "answer-correct",
                    "answer-wrong"
                );
            });

            // Marca la respuesta correcta.
            const correctInput = question.querySelector(
                `input[value="${correctAnswer}"]`
            );

            if (correctInput) {
                correctInput.closest("label")
                    ?.classList.add("answer-correct");
            }

            if (!selected) {
                unanswered++;
                question.classList.add("incorrect");
                return;
            }

            if (selected.value === correctAnswer) {
                score++;
                question.classList.add("correct");
            } else {
                question.classList.add("incorrect");

                selected.closest("label")
                    ?.classList.add("answer-wrong");
            }
        });

        if (unanswered > 0) {
            result.textContent =
                `Has acertado ${score} de ${questions.length}. ` +
                `Te falta${unanswered === 1 ? "" : "n"} ` +
                `${unanswered} pregunta${unanswered === 1 ? "" : "s"} ` +
                `por responder. Las respuestas correctas están marcadas.`;
        } else if (score === questions.length) {
            result.textContent =
                `¡Perfecto! Has acertado las ${score} preguntas.`;
        } else if (score >= 3) {
            result.textContent =
                `Has acertado ${score} de ${questions.length}. ` +
                "¡Buen trabajo! Revisa las respuestas marcadas.";
        } else {
            result.textContent =
                `Has acertado ${score} de ${questions.length}. ` +
                "Repasa los contenidos y vuelve a intentarlo.";
        }

        result.classList.add("visible");
    });

    resetButton.addEventListener("click", () => {
        form.reset();

        questions.forEach((question) => {
            question.classList.remove("correct", "incorrect");

            question.querySelectorAll("label").forEach((label) => {
                label.classList.remove(
                    "answer-correct",
                    "answer-wrong"
                );
            });
        });

        result.textContent =
            "Elige una respuesta en cada pregunta y pulsa «Corregir respuestas».";

        result.classList.remove("visible");
    });
})();
