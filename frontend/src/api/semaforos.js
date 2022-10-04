const alarma = (txt) => {
    //alert('qsofa' + txt)
    return txt;
};

//área de toma de signos (funcion nueva que no venía en el sistema anterior)
const datosAlarma = (frs, fca, oxs, hip) => {
    let alarma = ""
    if (frs > 24) {
        alarma = "evaluar gravedad"
    }
    else if (fca > 120) {
        alarma = "evaluar gravedad"
    }
    else if (oxs < 90) {
        alarma = "evaluar gravedad"
    }
    else if (hip = "true") {
        alarma = "evaluar gravedad"
    }
    return alarma;
};

/* 
 * @param {*} frs Frecuencia respiratoria
 * Menor a 8 -3pts
 * 9-11 +1 pt
 * 12-20 0 pts
 * 21-24 2 pts
 * Mayor a 25 3 pts
 * @param {*} oxs Oxígeno suplementario
 * Con 2 pts
 * Sin 0 pts
 * @param {*} tmp Temperatura
 * Menor a 35°C 3 pts
 * 35.1-36°C 2 pts
 * 36.1-38°C 0 pts
 * 38.1-39°C 1 pt
 * Mayor a 39°C 2 pts
 * @param {*} sis Presión sistólica
 * Menor a 90mmHg 3 pts
 * 91-100mmHg 2 pts
 * 101-110mmHg 1 pt
 * 111-219 0 pts
 * Mayor a 220 3 pts
 * @param {*} fca Frecuencia cardiaca
 * Menor a 40lpm 3 pts
 * 41-50 lpm 1 pt
 * 51-90 0 pts
 * 91-100 1 pt
 * 101-130 2 pts
 * Mayor a 131 3 pts
 * @param {*} eda Estado de alerta
 * Alerta 0 pts
 * Desorientado 3 pts
 */

const news2 = (frss, oxss, tmps, siss, fcas, edas) => {
    //console.log("news2 frs="+frss+"oxs="+oxss+"tmp"+tmps+"sis"+siss+"fca"+fcas+"eda"+edas)

    let puntaje = 0;
    let frs = parseInt(frss);
    let oxs = parseInt(oxss);
    let tmp = parseInt(tmps);
    let sis = parseInt(siss);
    let fca = parseInt(fcas);
    let eda = parseInt(edas);

    //Frecuencia respiratoria
    switch (true) {
        case (frs < 8):
            puntaje -= 3
            break;
        case (9 <= frs && frs <= 11):
            puntaje += 1
            break;
        case (12 <= frs && frs <= 20):
            //puntaje=puntaje
            break;
        case (21 <= frs && frs <= 24):
            puntaje += 2
            break;
        case (frs > 25):
            puntaje += 3
            break;
        default:
            break;
    }

    //Oxigeno suplementario
    oxs === 1 ? puntaje += 2 : puntaje = puntaje

    //temperatura
    switch (true) {
        case (tmp <= 35):
            puntaje += 3
            break;
        case (35 < tmp && tmp <= 36):
            puntaje += 2
            break;
        case (36 < tmp && tmp <= 38):
            puntaje = puntaje
            break;
        case (38 < tmp && tmp <= 39):
            puntaje += 1
            break;
        case (tmp > 39):
            puntaje += 2
            break;
        default:
            break;
    }

    //Presion sistolica
    switch (true) {
        case (sis <= 90):
            puntaje += 3
            break;
        case (91 <= sis && sis <= 100):
            puntaje += 2
            break;
        case (100 < sis && sis <= 110):
            puntaje += 1
            break;
        case (110 < sis && sis <= 219):
            puntaje = puntaje
            break;
        case (sis > 219):
            puntaje += 3
            break;
        default:
            break;
    }

    //Frecuencia cardiaca
    switch (true) {
        case (fca <= 40):
            puntaje += 3
            break;
        case (41 <= fca && fca <= 50):
            puntaje += 1
            break;
        case (51 <= fca && fca <= 90):
            puntaje = puntaje
            break;
        case (91 <= fca && fca <= 100):
            puntaje += 1
            break;
        case (101 <= fca && fca <= 130):
            puntaje += 2
            break;
        case (sis > 130):
            puntaje += 3
            break;
        default:
            break;
    }


    //Estado de alerta
    eda === 1 ? puntaje = puntaje : puntaje += 3;

    //console.log("puntaje news2= "+puntaje)
    return puntaje;
};

/*
 * 
 * @param {*} aoc Apertura ocular
 * Espontánea 3=4
 * Voz 4=3
 * Dolor 5=2
 * Ninguna 6=1
 * @param {*} rsv Respuesta verbal
 * Orientada 7=5
 * Confusa 8=4
 * Inapropiada 9=3
 * Sonidos 10=2
 * Ninguna 11=1
 * @param {*} rsm Respuesta motriz
 * Obedece 12=6
 * Localiza 13=5
 * Retirada 14=4
 * Flexión 15=3
 * Extensión 16=2 
 * Ninguna 17=1
 */

const glassgow = (aoc, rsv, rsm) => {
    //console.log("glass aoc="+aoc+"rsv="+rsv+"rsm"+rsm)
    let puntaje = 0;

    //Apertura ocular - aoc
    switch (parseInt(aoc)) {
        case (3):
            puntaje += 4
            //console.log("case3 puntaje="+puntaje)
            break;
        case (4):
            puntaje += 3
            break;
        case (5):
            puntaje += 2
            break;
        case (6):
            puntaje += 1
            break;
        default:
            break;
    }

    //Resuesta verbal - rsv
    switch (parseInt(rsv)) {
        case (7):
            puntaje += 5
            break;
        case (8):
            puntaje += 4
            break;
        case (9):
            puntaje += 3
            break;
        case (10):
            puntaje += 2
            break;
        case (11):
            puntaje += 1
            break;
        default:
            break;
    }

    //Respuesta Motriz
    switch (parseInt(rsm)) {
        case (12):
            puntaje += 6
            break;
        case (13):
            puntaje += 5
            break;
        case (14):
            puntaje += 4
            break;
        case (15):
            puntaje += 3
            break;
        case (16):
            puntaje += 2
            break;
        case (17):
            puntaje += 1
            break;
        default:
            break;
    }

    //console.log("puntaje glassgow= "+puntaje)
    return puntaje
};

/*qSOFA Quick Sequential Organ Failure Assessment score
FR mayor a 22 Sí(1 punto) No(0 puntos)
Glasgow menor a 15 Sí(1 punto) No(0 puntos)
TA sistólica menor a 100 Sí(1 punto) No(0 puntos)
*/
const qsofa = (frs, aoc, rsv, sis, rsm) => {

    let puntaje = 0;

    //frecuencia respiratoria
    parseInt(frs) > 22 ? puntaje += 1 : puntaje = puntaje;

    glassgow(aoc, rsv, rsm) < 15 ? puntaje += 1 : puntaje = puntaje
    //tensión arterial sistólica

    parseInt(sis) < 100 ? puntaje += 1 : puntaje = puntaje

    //console.log("puntaje qSOFA= "+puntaje)
    return puntaje
};

const hospitalizacionNEWS2 = (frs, oxs, tmp, sis, fca, eda) => {
    //console.log(news2(frs, oxs, tmp, sis, fca, eda) > 5 ? "Hospitalizacion" : "Normal")
    return news2(frs, oxs, tmp, sis, fca, eda) > 5 ? "Hospitalizacion" : "Normal"
}

const hospitalizacionqSOFA = (frs, aoc, rsv, rsm, sis) => {
    //console.log(qsofa(frs, aoc, rsv, rsm, sis) > 2 ? "Hospitalizacion" : "Normal")
    return qsofa(frs, aoc, rsv, rsm, sis) > 2 ? "Hospitalizacion" : "Normal"
}

const hospitalizacionGlassgow = (aoc, rsv, rsm) => {
    let resultado = 15;

    resultado = glassgow(aoc, rsv, rsm)
    if (resultado < 3)
        resultado = 15;


    let hospitalizacion = ""
    switch (true) {
        case (resultado == 15):
            hospitalizacion = "Normal"
            break;
        case (9 <= resultado && resultado <= 14):
            hospitalizacion = "Hospitalizacion"
            break;
        case (3 < resultado && resultado <= 8):
            hospitalizacion = "Grave"
            break;
        case (3 == resultado):
            hospitalizacion = "Coma"
            break;
        default:
            break;
    }
    //console.log("hospitalizacionGlassgow=" + hospitalizacion)
    return hospitalizacion
}

export {
    alarma,
    news2,
    glassgow,
    qsofa,
    datosAlarma,
    hospitalizacionNEWS2,
    hospitalizacionqSOFA,
    hospitalizacionGlassgow
};