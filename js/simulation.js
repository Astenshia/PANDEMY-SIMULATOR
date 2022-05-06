/**
 * @brief Liste de directions pour des voisins
 */
const NEIGHBOURING_RULES = {
            // left    / right  / top   / bottom
    SIDED  : [[-1,  0], [ 1,  0], [ 0, -1], [0, 1]],
                                                   // topleft / topright /bottomleft / bottomright
    CORNERS: [[-1,  0], [ 1,  0], [ 0, -1], [0, 1], [-1, -1], [ 1, -1], [-1,  1], [1, 1]],
};

/**
 * @brief Class Abstraite pour chaque simulation
 * Pour en crée une à partir de cette class
 * faire :
 * `class Autre extends Simulation { 
 *      constructor() {
 *          super();
 *      } 
 * };`
 */
class Simulation {
    /**
     * @brief Crée une simulation par default
     */
    constructor(defaultCell = { value: 0 }, gridSize = 10) {
        this.defaultCell = defaultCell;
        this.gridSize = gridSize;
        this.grid = this._createGrid();
    }

    /**
     * @brief Initialize la simulation
     */
    init() { }

    /**
     * @brief Methode privée pour créer une grille de la taille
     * specifiée dans this.gridSize, chaque element sera égal à this.defaultCell
     * @returns {Array} - La grille créée
     */
    _createGrid() {
        var grid = Array.from(
            new Array(this.gridSize), 
            v => { 
                var arr = new Array(this.gridSize);
                for(var i = 0; i < arr.length; ++i)
                    arr[i] = Object.assign({}, this.defaultCell);
                return arr; 
            }
        );
        return grid;
    }

    /**
     * @brief Dessine chaque cellule de la grille
     * @param {CanvasRenderingContext2D} ctx - Context de rendu 2D
     */
    draw(ctx) {
        for(var x = 0; x < this.gridSize; ++x) {
            for(var y = 0; y < this.gridSize; ++y) {
                this._drawCell(ctx, x, y, this.grid[x][y]);
            }
        }
    }

    /**
     * @brief Methode privée pour dessiner chaque cellule
     * @param {CanvasRenderingContext2D} ctx - Contexte de rendu 2D
     * @param {Number} x - Position x dans la grille
     * @param {Number} y - Position y dans la grille
     * @param {Object} cell - Valeur de la cellule à cette position
     */
    _drawCell(ctx, x, y, cell) {
        let cellSize = ctx.canvas.width / this.gridSize;
        drawSquare(ctx, x * cellSize, y * cellSize, cellSize, "#000", cell.value != 0);
    }


    /**
     * @brief Met à jour la grille
     * (Simule une étape)
     */
    update() {
        var new_grid = this._createGrid();
        for(var x = 0; x < this.gridSize; ++x) {
            for(var y = 0; y < this.gridSize; ++y) {
                new_grid[x][y] = this._updateCell(x, y, Object.assign({}, this.grid[x][y]));
            }
        }
        this.grid = new_grid;
    }

    /**
     * @brief Methode privée pour mettre à jour une cellule
     * @param {Number} x - Position x dans la grille
     * @param {Number} y - Position y dans la grille
     * @param {Object} cell - Valeur de la cellule 
     */
    _updateCell(x, y, cell) { return cell; }

    
    /**
     * @brief Methode protegée Retourne la liste des voisins
     * @param {Number} x - Position x dans la grille
     * @param {Number} y - Positon y dans la grille
     * @param {Array} neighboursRule - Une des règles de NEIGHBOURING_RULES 
     * @returns {Array} - voisins
     */
    _getNeighboursList(x, y, neighboursRule)
    {
        var neighbours = [];
        // regarde dans les directions voulues
        for(const dir of neighboursRule) {
            // cellule dans la direction voulue
            var nx = x + dir[0];
            var ny = y + dir[1];

            // si elle est en dehors de la grille on ne la compte pas
            if(nx < 0 || nx >= this.gridSize
            || ny < 0 || ny >= this.gridSize) continue

            neighbours.push(this.grid[nx][ny]);
        }

        return neighbours;
    }
}