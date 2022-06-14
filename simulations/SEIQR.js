const ETAT = {
    SUSCEPTIBLE: 0,
    INFECTEE: 1,
    RETABLIE: 2,
    EXPOSE: 3,
    QUARANTAINE: 4,
    MORT: 5,
}

/**
 * SEIQR simulation model
 * src: 
 */
class SEIQR extends Simulation {
    constructor() {
        super({ etat: ETAT.SUSCEPTIBLE, exposition: 0, quarantaine: 0, immunite: 0}, 50);
        
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
            rayonInfectueux: 3,
            // nombre entre 1 et 40,
            dureeQuarantaine: 5,
            // nombre entre 0 et 100
            tauxMortalite: 10,
            // purcetnage de chance qu'n se rende compte qu'on va être malade (entre 0 et 100)
            tauxDetection: 10,

            dureeImmunite: 20,

        };

        this.retablieCount = 0;
        this.deathCount = 0;
    }

    init() {
        var totalToFind = Math.round(this.gridSize * this.gridSize * (this.params.initInfectes * .01));
        var count = 0;
        while(count < totalToFind) {
            var rx = Math.floor(Math.random() * (this.gridSize - 1));
            var ry = Math.floor(Math.random() * (this.gridSize - 1));

            if(this.grid[rx][ry].etat == ETAT.SUSCEPTIBLE) {
                this.grid[rx][ry].etat = ETAT.INFECTEE;
                count += 1;
            }
        }
    }

    isFinished() {
        return (this.retablieCount + this.deathCount) >= this.gridSize * this.gridSize;
    }

    _drawCell(context, x, y, cell) {
        var cellSize = context.canvas.width / this.gridSize;
        // position en pixel du milieu de la cellule
        var cx = (x + 0.5) * cellSize;
        var cy = (y + 0.5) * cellSize;
        
        // dessiner les cellules
        
        switch(cell.etat) {
            case ETAT.SUSCEPTIBLE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(255, 255, 255, 0.2));
                break;
            case ETAT.INFECTEE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(200, 20, 20, 0.8));
                break;
            case ETAT.RETABLIE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(20, 200, 20, 0.8));
                break;
            case ETAT.EXPOSE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(240, 65, 35, 0.8));
                break;   
            case ETAT.QUARANTAINE:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(243, 17, 205, 0.8));
                break;
            case ETAT.MORT:
                drawCircle(context, cx, cy, 0.4*cellSize, rgba(0, 50, 240, 0.8));
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
        for(var cx = -this.params.rayonInfectueux; cx < this.params.rayonInfectueux; ++cx) {
            for(var cy = -this.params.rayonInfectueux; cy < this.params.rayonInfectueux; ++cy) {
                // distance depuis centre
                var d = cx*cx + cy*cy;
                // si cellule comprise dans le cercle
                if(d <= this.params.rayonInfectueux * this.params.rayonInfectueux) {
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
            case ETAT.RETABLIE:
                cell.immunite++;
                if (cell.immunite > this.params.dureeImmunite){
                    cell.etat = ETAT.SUSCEPTIBLE
                    this.retablieCount--
                }
                break;

            case ETAT.SUSCEPTIBLE:
                var n = this._selectNeighbours(x, y);
                // nombre voisins infectés
                var count = 0;
                for(const voisin of n) {
                    if(voisin.etat == ETAT.INFECTEE) {
                        count += 1;
                    }
                }
                // infection
                if(Math.random() < this.params.tauxInfect * .01 * count) {
                    cell.etat = ETAT.EXPOSE;
                }
                break;

            case ETAT.INFECTEE:
                if(Math.random() < this.params.tauxGuerison * .01) {
                    cell.etat = ETAT.RETABLIE;
                    this.retablieCount += 1;
                    }
                else if (Math.random() < this.params.tauxMortalite* .01) {
                    cell.etat = ETAT.MORT;
                    this.deathCount += 1;
                    }
                break;

            case ETAT.EXPOSE:
                cell.exposition++;
                if (cell.exposition > this.params.dureeExposition)
                    cell.etat = ETAT.INFECTEE   //fin de periode d'exposition = infectee
                else 
                if(Math.random() < this.params.tauxDetection * .01 )
                    cell.etat = ETAT.QUARANTAINE
                break;

            case ETAT.QUARANTAINE:
                cell.quarantaine++;
                if (cell.quarantaine > this.params.dureeQuarantaine)
                    cell.etat = ETAT.RETABLIE
                    break;

            case ETAT.MORT:
                break;
                    
        }

        return cell;
    }
}