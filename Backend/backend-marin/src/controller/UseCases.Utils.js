// apriori.utils.js
export default function generarReglasApriori(transacciones, minSupport = 0.05, minConfidence = 0.3, minLift = 1.0) {
    const total = transacciones.length;
    const itemCounts = {};

    // 1. Contar frecuencias de items individuales
    transacciones.forEach(t => {
        t.forEach(item => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        });
    });

    const items = Object.keys(itemCounts);
    const reglas = [];

    // 2. Generar pares (Antecedente -> Consecuente)
    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < items.length; j++) {
            if (i === j) continue;
            const A = items[i];
            const B = items[j];

            const supA = itemCounts[A] / total;
            const supB = itemCounts[B] / total;

            // Contar cuántas transacciones tienen ambos items
            let countAB = 0;
            transacciones.forEach(t => {
                if (t.includes(A) && t.includes(B)) countAB++;
            });

            const supAB = countAB / total;

            // 3. Aplicar los filtros del algoritmo
            if (supAB >= minSupport) {
                const confidence = supAB / supA;
                if (confidence >= minConfidence) {
                    const lift = confidence / supB;
                    if (lift >= minLift) {
                        reglas.push({
                            antecedents: [A],
                            consequents: [B],
                            support: parseFloat(supAB.toFixed(4)),
                            confidence: parseFloat(confidence.toFixed(4)),
                            lift: parseFloat(lift.toFixed(4))
                        });
                    }
                }
            }
        }
    }

    return reglas
        .sort((a, b) => b.lift - a.lift || b.confidence - a.confidence)
        .slice(0, 10); // Limitar a las mejores 10 reglas
    }