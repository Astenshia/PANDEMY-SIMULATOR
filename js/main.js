let PARAMS = {
    GRID_SIZE: 21,
    CELL_SIZE: 10, // in pixels
    DEFAULT_CELL_VALUE: 0,
    INFECTED: 1,
    UPDATE_COUNT: 21,
    DELAY: 100
};

/**
 * @brief Entrée du programme
 */
function main() {
    console.log("Blup");

    // HTML canvas
    const canvas = document.getElementById("canvas0");
    // Render canvas
    const context = canvas.getContext("2d");
    
    
    // intialisation grille
    PARAMS.CELL_SIZE = canvas.width / PARAMS.GRID_SIZE;
    var grid = createGrid();
    initializeGrid(grid);

    var step = 0;
    const update = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // affichage de la grille
        drawGrid(context, grid);
        // une étape
        grid = updateGrid(grid);

        // met à jour le compteur
        ++step;
        console.log("ETAPE:", step);

        if(step < PARAMS.UPDATE_COUNT)
            setTimeout(update, PARAMS.DELAY);
    }
    update();
    
}

function createGrid() {
    // col per row grid
    var grid = [];
    for (var i = 0; i < PARAMS.GRID_SIZE; ++i) {
        // creer une liste de taille GRID_SIZE
        var col = new Array(PARAMS.GRID_SIZE);
        // rempli la colonne par la valeur par default
        col.fill(PARAMS.DEFAULT_CELL_VALUE);
        // Rajoute la colonne dans notre grille
        grid.push(col);
    }
    return grid;
}

/**
 * @brief Dessine une cellule
 * @param context - CanvasRenderingContext2D contexte de rendu
 * @param x - Position x dans notre grille
 * @param y - Position y dans notre grille
 * @param value - Valeur de la cellule
 */
function drawCell(context, x, y, value)
{
    //stroke=les contours
    context.strokeStyle = "rgba(0, 0, 0, 0.1)";

    let xx = x * PARAMS.CELL_SIZE;
    let yy = y * PARAMS.CELL_SIZE;

    // dessine les contours d'un carre 
    // x, y, taillex, tailleY
    context.strokeRect(xx, yy, PARAMS.CELL_SIZE, PARAMS.CELL_SIZE);

    if(value == 1) { // infectée
        let half_size = .5 * PARAMS.CELL_SIZE;
        drawCircle(context, xx + half_size, yy + half_size, .8 * half_size, "darkred");
    }
    else {
        let half_size = .5 * PARAMS.CELL_SIZE;
        drawCircle(context, xx + half_size, yy + half_size, .8 * half_size, rgba(255, 255, 255, 0.2));
    }

}

/** 
 * @brief Dessine la grille
 * @param context - CanvasRenderingContext2D contexte de rendu
 * @param grid - Grille de simulation
 */
function drawGrid(context, grid){
    // faut aller jusqu'a la taille de la grille (ou le nombre de lignes, 
    // tu peux noter x à la place de i si tu veux t'y retrouver)
    for (var x = 0; x < grid.length; ++x){
        // pour le y faut une secondle boucle dans grid[x] vu qu'on a ma grid[x][0]
        // attention avec grid.length ! la on veut boucler dans notre colonne qui est grid[x]
        // après en soit on a une grille carrée / x ou grid[x]? grid[x] > c'est une liste
        // mais sinon depuis le début on pouvait utiliser PARAMS.GRID_SIZE au final/ Mais au moins la c'est plus propre fin plus sérieux
        for(var y = 0; y < grid[x].length; ++y){
            drawCell(context, x, y, grid[x][y]);
        }
    }
}

/**
 * @brief Initialize la grille
 * @param grid - Grille de simulation
 */
function initializeGrid(grid) {
    grid[Math.floor(PARAMS.GRID_SIZE * 0.5)][Math.floor(PARAMS.GRID_SIZE * 0.5)] = 1;
}

/**
 * @brief Effectue une mise à jour de la grille (une étape)
 * @param grid - Grille de simulation
 */
function updateGrid(grid) {
    let new_grid = createGrid();
    for (var x = 0; x < grid.length; ++x) {
        for(var y = 0; y < grid[x].length; ++y) {
            // code pour chaque cellule
            new_grid[x][y] = grid[x][y];
            if(count4Neighbours(grid, x, y) >= 1)
                new_grid[x][y] = 1; // propagation si voisin infecté
        }
    }
    return new_grid;
}


function count4Neighbours(grid, x, y) {
    var count = 0;
    if(x > 0) // pour eviter d'accèder à -1 si x = 0
        count += grid[x - 1][y]; // goche
    if(x < PARAMS.GRID_SIZE - 1) // pour eviter d'accèder en dehors de la grille si x = fin de la list
        count += grid[x + 1][y]; // berk droite
    if(y > 0) // meme chose
        count += grid[x][y - 1];
    if(y < PARAMS.GRID_SIZE - 1) // meme chose
        count += grid[x][y + 1];
    return count;
}

// point d'entree
window.onload = main;