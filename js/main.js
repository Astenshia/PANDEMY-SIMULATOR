// nombre d'etapes maximum
const MAX_STEPS = 1000;
// delai entre chaque étape
const STEP_DELAY = 200;

// variable pour la simulation
var sim;

/**
 * Point d'entrée
 */
function main() {

    // objet html pour afficher l'etape actuelle
    const stepIndicator = document.querySelector("#stepIndicator");
    // html canvas
    const canvas = document.querySelector("#canvas0");
    // contexte de rendu 2D
    const ctx = canvas.getContext("2d");

    // nouvelle simulation
    sim = new SEIQR();
    // initialisation
    sim.init();
    sim.draw(ctx);

    // boucle de simulation
    var step = 0;
    const update = function () {
        // efface l'ecran
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // met à jour la simulation
        sim.update();
        // affiche la grille
        sim.draw(ctx);

        // limite d'etapes
        ++step;
        if(step < MAX_STEPS && !sim.isFinished())
            setTimeout(update, STEP_DELAY); // lance etape suivante

        // met à jour l'affichage des étapes
        stepIndicator.textContent = step.toString();
    }
    // lance la simulation
    update();
}

// Quand la page est chargée, lancer la simulation
window.onload = main;