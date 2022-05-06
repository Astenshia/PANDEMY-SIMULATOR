/**
 * @brief Dessine un cercle (rempli)
 * @param {CanvasRenderingContext2D} ctx - contexte de rendu
 * @param {Number} x - Position x du cercle 
 * @param {Number} y - Position y du cercle
 * @param {Number} radius - Rayon du cercle
 * @param {String} color - Couleur du cercle (ex: 'rgb(20, 2, 129)', '#00A1FF')
 */
function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * @brief Dessine un carré
 * @param {CanvasRenderingContext2D} ctx - contexte de rendu
 * @param {Number} x - Position x 
 * @param {Number} y - Position y
 * @param {Number} size - Taille du coté du carré
 * @param {String} color - Couleur (ex: 'rgb(20, 2, 129)', '#00A1FF')
 * @param {Boolean} fill - Remplir ou pas [default=true] 
 */
function drawSquare(ctx, x, y, size, color, fill=true) {
    if(fill) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, size, size);
    }
}



/**
 * @brief Retourne la représentation en String de la couleur
 * @param {Number} r - Rouge (entre 0 et 255)
 * @param {Number} g - Vert (entre 0 et 255)
 * @param {Number} b - Bleu (entre 0 et 255)
 * @param {Number} a - Opacité (Entre 0 et 1)
 * @returns {String}
 */
function rgba(r, g, b, a)
{
    return "rgba(" + r + ',' + g + ',' + b + ',' + a + ")";
}
