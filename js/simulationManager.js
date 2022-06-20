// nombre d'etapes maximum
const MAX_STEPS = 1000;
// delai entre chaque étape
const STEP_DELAY = 200;

class SimulationManager {
    static Init(ctx) {
        SimulationManager.current = {};

        SimulationManager.step = 0;
        SimulationManager.ctx = ctx;
        SimulationManager.isInitiated = false;

        SimulationManager.isPlaying = false;
        SimulationManager.controlButton = document.querySelector("#control");
        SimulationManager.controlButton.addEventListener("click", () => {
            const icon = SimulationManager.controlButton.querySelector("i");
            // change l'etat à l'inverse
            SimulationManager.isPlaying = !SimulationManager.isPlaying;
            // joue
            if (SimulationManager.isPlaying) {
                icon.className = "fa-solid fa-pause";
                SimulationManager.Update();
            } else {
                // arrete
                icon.className = "fa-solid fa-play";
            }
        });
    }

    static AddSim(simulationClass) {
        if(!SimulationManager.simulations)
            SimulationManager.simulations = {};
        // ajoute la classe dans le tableau
        SimulationManager.simulations[simulationClass.name] = simulationClass;
    }

    static StartSim(simulationName, params={}) {
        // stop
        SimulationManager.isPlaying = false;
        const icon = SimulationManager.controlButton.querySelector("i");
        icon.className = "fa-solid fa-play";
        Interface.SetStep(0);

        // re cree
        const simclass = SimulationManager.simulations[simulationName];
        SimulationManager.current = new simclass(params);
        SimulationManager.step = 0;

        // clear
        SimulationManager.ctx.clearRect(0, 0, SimulationManager.ctx.canvas.width, SimulationManager.ctx.canvas.height);
        // initialise
        SimulationManager.isInitiated = false;
    }

    static Update() {
        // eviter de le jouer si on le veut pas
        if(!SimulationManager.isPlaying) return;

        // initialisation au premier update
        if(!SimulationManager.isInitiated) {
            SimulationManager.current.init();
            SimulationManager.current.draw(SimulationManager.ctx);
            SimulationManager.isInitiated = true;
        }

        // clear
        SimulationManager.ctx.clearRect(0, 0, SimulationManager.ctx.canvas.width, SimulationManager.ctx.canvas.height);

        // faire une étape
        SimulationManager.current.update();

        // afficher
        SimulationManager.current.draw(SimulationManager.ctx);

        // augmente compteur
        SimulationManager.step++;
        Interface.SetStep(SimulationManager.step);
        // relance si pas fini
        if(SimulationManager.step < MAX_STEPS && !SimulationManager.current.isFinished())
            setTimeout(function () { SimulationManager.Update(); }, STEP_DELAY); // lance etape suivante
    }
}