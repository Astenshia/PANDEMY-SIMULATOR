const nickNames = {
    "initInfectes": "Nombre d'infectés au départ (%)",
    "tauxInfect" : "Taux d'infection (%)",
    "tauxGuerison" : "Taux de Guérison (%)",
    "rayonInfectieux" : "Rayon Infectieux",
    "dureeExposition" : "Durée d'exposition (jours)",
    "dureeQuarantaine" : "Durée de quarantaine (jours)",
    "tauxMortalite" : "Taux de mortalité (%)",
    "tauxDetection" : "Taux de détection (%)",
    "dureeImmunite" : "Durée d'immunité (jours)",
};

class Interface {
    /**
     * @brief initialise l'etat de l'interface et les interfaces des simulations
     */
    static Init() {
        // récupère tout les objets html
        /* Simulations tabs */
        this.tabs      = document.querySelector('div.simulations .tabs');
        this.tabView   = document.querySelector('div.simulations .views');
        /* Inspector */
        this.inspector = document.querySelector('div.inspector');
        this.stepIndicator = document.querySelector("#stepIndicator");

        /* Dictionnaire des interfaces */
        this.tabGroup = {};

        // construire l'interface
        this.AddTab(SIR);
        this.AddTab(SEIR);
        this.AddTab(SEIQR);

        // met l'onglet actuel au premier onglet
        this.currentTab = Object.keys(this.tabGroup)[0];
        this.tabGroup[this.currentTab].bt.classList.add("active");
        this.tabGroup[this.currentTab].view.classList.add("active");

        // interface SIR
        this.CreateSimulationParamsSliders(SIR);
        this.CreateSimulationParamsSliders(SEIR);
        this.CreateSimulationParamsSliders(SEIQR);

        // event listener
        this.changeEventListener = function () {};
    }

    static SetSimulationChangeEventListener(listener) {
        this.changeEventListener = listener;
    }

    static _SimulationChangeEvent() {
        // recupère les paramètres
        const params = {};
        const inputs = this.tabGroup[this.currentTab].inputs;
        for(var i = 0; i < inputs.length; ++i) {
            const input = inputs[i];
            params[input.id] = parseInt(input.value);
        }
        // on appelle notre listener
        this.changeEventListener(this.currentTab, params);
    }

    /**
     * @brief Crée un onglet et une interface pour la simulation
     * @param {Object} simulationClass - classe de la simulation
     */
    static AddTab(simulationClass) {
        // cree button
        const tabButton = document.createElement("button");
        tabButton.className = "tab-button";
        const tabButtonText = document.createElement("span");
        tabButtonText.textContent = simulationClass.name;
        tabButton.appendChild(tabButtonText);
        tabButton.setAttribute("simulation", simulationClass.name)
        // cree une div -> la ou y a l'interface 
        const tabView = document.createElement("div");
        tabView.className = "tab-view";
        tabView.setAttribute("simulation", simulationClass.name)
        // enregister le nouvel onglet
        this.tabGroup[simulationClass.name] = {
            bt: tabButton,
            view: tabView,
            inputs: []
        };

        // pour changer quel onglet est actif ou pas
        // si l'onglet est actif il a la classe 'active'
        tabButton.addEventListener("click", function () {
            // cache l'onglet actuel
            Interface.tabGroup[Interface.currentTab].bt.classList.remove("active");
            Interface.tabGroup[Interface.currentTab].view.classList.remove("active");
            // change l'onglet actuel
            Interface.currentTab = simulationClass.name;
            // et on l'affiche
            Interface.tabGroup[Interface.currentTab].bt.classList.add("active");
            Interface.tabGroup[Interface.currentTab].view.classList.add("active");

            // changer la simulation
            Interface._SimulationChangeEvent();
        });

        // add to corresponding group
        this.tabs.appendChild(tabButton);
        this.tabView.appendChild(tabView);
    }

    static AddPropSlider(tabName, {name, id, min, max, increment}={min: 0, max: 100, increment: 1}) {
        // div
        const div = document.createElement("div");
        div.className = "input-group";
        
        // slider
        const slider = document.createElement("input");
        slider.type  = "range";
        slider.min   = min; // si min est null alors 0 est utilisé à la place
        slider.max   = max;
        slider.increment = increment;
        slider.name = name ?? "slider";
        slider.id   = id ?? "";

        // label
        const label = document.createElement('label');
        label.for = name ?? "slider";
        label.textContent = name;

        // on recrée la simulation quand ca change
        slider.addEventListener("change", () => {
            Interface._SimulationChangeEvent();
        });

        div.appendChild(label);
        div.appendChild(slider);
        // ajouter à l'interface
        this.tabGroup[tabName].view.appendChild(div);
        this.tabGroup[tabName].inputs.push(slider);
    }


    static CreateSimulationParamsSliders(simulationClass) {
        const c = new simulationClass();
        const params = Object.keys(c.params);
        for(var i = 0; i < params.length; ++i) {
            const param = params[i];

            var min = 0;
            var max = 100;
            if(param.includes("rayon")) {
                min = 1;
                max = 5;
            }

            const sliderName = nickNames[param] ?? param;
            this.AddPropSlider(simulationClass.name, {name: sliderName, id: param, min, max});
        }
    }

    static SetStep(stepCount) {
        this.stepIndicator.textContent = "Step: " + stepCount.toString();
    }
}