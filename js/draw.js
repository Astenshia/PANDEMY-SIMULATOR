/**
 * @brief Dessine un cercle (rempli)
 * @param ctx - CanvasRenderingContext2D - contexte de rendu
 * @param x - Position x du cercle 
 * @param y - Position y du cercle
 * @param r - Rayon du cercle
 * @param coul - Couleur du cercle (ex: 'rgb(20, 2, 129)', '#00A1FF')
 */
function drawCircle(ctx, x, y, r, coul) {
    ctx.fillStyle = coul;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function rgba(r, g, b, a)
{
    return "rgba(" + r + ',' + g + ',' + b + ',' + a + ")";
}
