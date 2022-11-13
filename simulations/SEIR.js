const ETAT_SEIR = {
    SUSCEPTIBLE: 0,
    INFECTEE: 1,
    RETABLIE: 2,
    EXPOSE: 3,
}

/**
 * SEIR simulation model
 * src: 
 */
class SEIR extends Simulation {
    constructor(params={}) {
        super({ etat: ETAT_SEIR.SUSCEPTIBLE, exposition: 0 }, 50);
        
        this.params = {
            // % entre 1 et 100
            initInfectes: 1,
            // % entre 1 et 100
            tauxInfect: 38,
            // % entre 1 et 100
            tauxGuerison: 12,
            // nombre entre 1 et 20
            dureeExposition: 5,
            // nombre en 1 et 5
            rayonInfectieux: 3
        };

        this._setParams(params);

        this.retablieCount = 0;
    }

    init() {
        var totalToFind = Math.round(this.gridSize * this.gridSize * (this.params.initInfectes * .01));
        var count = 0;
        while(count < totalToFind) {
            var rx = Math.floor(Math.random() * (this.gridSize - 1));
            var ry = Math.floor(Math.random() * (this.gridSize - 1));

            if(this.grid[rx][ry].etat == ETAT_SEIR.SUSCEPTIBLE) {
                this.grid[rx][ry].etat = ETAT_SEIR.INFECTEE;
                count += 1;
            }
        }
        // init graph
        Graph.active.addCourbe("susceptible", "rgb(255, 255, 255)");
        Graph.active.addCourbe("retablie",    "rgb(20, 200, 20)");
        Graph.active.addCourbe("infectee",    "rgb(200, 20, 20)");
        Graph.active.addCourbe("exposee",    "rgba(240, 65, 35)");
    }

    isFinished() {
        return this.retablieCount >= this.gridSize * this.gridSize;
    }

    _drawCell(context, x, y, cell) {
        var cellSize = context.canvas.width / this.gridSize;
        // position en pixel du milieu de la cellule
        var cx = (x + 0.5) * cellSize;
        var cy = (y + 0.5) * cellSize;
        
        // dessiner les cellules
        
        switch(cell.etat) {
            case ETAT_SEIR.SUSCEPTIBLE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(255, 255, 255, 0.2));
                break;
            case ETAT_SEIR.INFECTEE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(200, 20, 20, 0.8));
                break;
            case ETAT_SEIR.RETABLIE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(20, 200, 20, 0.8));
                break;
            case ETAT_SEIR.EXPOSE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(240, 65, 35, 0.8));
                break;   
        }
    }

    _selectNeighbours(x, y) {
        // <--x-->
        // carré depuis haut à gauche du centre
        // .----.
        // |    |
        // °----°
        var n = [];
        for(var cx = -this.params.rayonInfectieux; cx < this.params.rayonInfectieux; ++cx) {
            for(var cy = -this.params.rayonInfectieux; cy < this.params.rayonInfectieux; ++cy) {
                // distance depuis centre
                var d = cx*cx + cy*cy;
                // si cellule comprise dans le cercle
                if(d <= this.params.rayonInfectieux * this.params.rayonInfectieux) {
                    // en dehors de la grille -> on ignore
                    if(x + cx < 0 || x + cx >= this.gridSize
                    || y + cy < 0 || y + cy >= this.gridSize) continue;
                    // on ajoute à la liste
                    n.push(this.grid[x + cx][y + cy]);
                }
            }
        }

        return n;
    }

    _updateCell(x, y, cell) {
        // si cellule est deja guerie on simule rien
        switch(cell.etat) {
            case ETAT_SEIR.RETABLIE:
                break;

            case ETAT_SEIR.SUSCEPTIBLE:
                var n = this._selectNeighbours(x, y);
                // nombre voisins infectés
                var count = 0;
                for(const voisin of n) {
                    if(voisin.etat == ETAT_SEIR.INFECTEE) {
                        count += 1;
                    }
                }
                // infection
                if(Math.random() < this.params.tauxInfect * .01 * count) {
                    cell.etat = ETAT_SEIR.EXPOSE;
                }
                break;

            case ETAT_SEIR.INFECTEE:
                if(Math.random() < this.params.tauxGuerison * .01) {
                    cell.etat = ETAT_SEIR.RETABLIE;
                    this.retablieCount += 1;
                    }
                break;

            case ETAT_SEIR.EXPOSE:
                cell.exposition++;
                if(cell.exposition > this.params.dureeExposition)
                    cell.etat = ETAT_SEIR.INFECTEE
                
                break;
        }

        return cell;
    }

    getStatesCount() {
        var counters = [0, 0, 0, 0];
        for(var x = 0; x < this.gridSize; ++x) {
            for(var y = 0; y < this.gridSize; ++y) {
                var cell = this.grid[x][y];
                counters[cell.etat]++;
            }
        }
        return {
            "susceptible": counters[0],
            "infectee": counters[1],
            "retablie": counters[2],
            "exposee": counters[3]
        };
    }
}

SimulationManager.AddSim(SEIR);