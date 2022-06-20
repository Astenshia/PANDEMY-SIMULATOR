/**
 * Point d'entrée
 */
function main() {
    // html canvas
    const canvas = document.querySelector("#canvas0");
    // contexte de rendu 2D
    const ctx = canvas.getContext("2d");

    // initialisation de l'interface
    Interface.Init();
    SimulationManager.Init(ctx);
    Interface.SetSimulationChangeEventListener(SimulationManager.StartSim);
    
    // boucle de simulation
    SimulationManager.StartSim("SIR");
}

// Quand la page est chargée, lancer la simulation
window.onload = main;