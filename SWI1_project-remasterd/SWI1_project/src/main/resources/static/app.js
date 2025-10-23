document.addEventListener('DOMContentLoaded', function() {
    // Základní struktura aplikace
    const root = document.getElementById('root');
    root.innerHTML = `
        <div class="calculator-container">
            <h1 class="text-center mb-4">Kalkulátor průniku střel</h1>
            
            <ul class="nav nav-tabs" id="calculationTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="full-caliber-tab" data-bs-toggle="tab" data-bs-target="#full-caliber" type="button" role="tab">Plnokaliberní střela</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="sub-caliber-tab" data-bs-toggle="tab" data-bs-target="#sub-caliber" type="button" role="tab">Podkaliberní střela</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="heat-tab" data-bs-toggle="tab" data-bs-target="#heat" type="button" role="tab">HEAT střela</button>
                </li>
            </ul>

            <div class="tab-content" id="calculationTabsContent">
                <!-- Plnokaliberní střela -->
                <div class="tab-pane fade show active" id="full-caliber" role="tabpanel">
                    <div class="form-section">
                        <h3>Parametry plnokaliberní střely</h3>
                        <form id="fullCaliberForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Hmotnost (kg)</label>
                                    <input type="number" class="form-control" name="mass" step="0.1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Rychlost (m/s)</label>
                                    <input type="number" class="form-control" name="velocity" step="0.1" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Úhel dopadu (rad)</label>
                                    <input type="number" class="form-control" name="theta" step="0.1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Průměr (mm)</label>
                                    <input type="number" class="form-control" name="diameter" step="0.1" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">K</label>
                                    <input type="number" class="form-control" name="k" step="0.1" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">n</label>
                                    <input type="number" class="form-control" name="n" step="0.1" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">s</label>
                                    <input type="number" class="form-control" name="s" step="0.1" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-calculate">Vypočítat</button>
                        </form>
                    </div>
                </div>

                <!-- Podkaliberní střela -->
                <div class="tab-pane fade" id="sub-caliber" role="tabpanel">
                    <div class="form-section">
                        <h3>Parametry podkaliberní střely</h3>
                        <form id="subCaliberForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Celková délka (mm)</label>
                                    <input type="number" class="form-control" name="totalLength" step="0.1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Průměr (mm)</label>
                                    <input type="number" class="form-control" name="diameter" step="0.1" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Rychlost (m/s)</label>
                                    <input type="number" class="form-control" name="velocity" step="0.1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Materiál</label>
                                    <select class="form-select" name="material" required>
                                        <option value="Tungsten">Wolfram</option>
                                        <option value="DU">Depleted Uranium</option>
                                        <option value="Steel">Ocel</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Hustota penetrátoru (kg/m³)</label>
                                    <input type="number" class="form-control" name="densityPenetrator" step="0.1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tvrdost penetrátoru (HV)</label>
                                    <input type="number" class="form-control" name="hardnessPenetrator" step="0.1" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Hustota cíle (kg/m³)</label>
                                    <input type="number" class="form-control" name="densityTarget" step="0.1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tvrdost cíle (HV)</label>
                                    <input type="number" class="form-control" name="hardnessTarget" step="0.1" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Úhel dopadu (rad)</label>
                                    <input type="number" class="form-control" name="angle" step="0.1" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-calculate">Vypočítat</button>
                        </form>
                    </div>
                </div>

                <!-- HEAT střela -->
                <div class="tab-pane fade" id="heat" role="tabpanel">
                    <div class="form-section">
                        <h3>Parametry HEAT střely</h3>
                        <form id="heatForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Průměr (mm)</label>
                                    <input type="number" class="form-control" name="diameter" step="0.1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Koeficient</label>
                                    <input type="number" class="form-control" name="coefficient" step="0.1" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Účinnost (%)</label>
                                    <input type="number" class="form-control" name="efficiency" step="0.1" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Úhel dopadu (rad)</label>
                                    <input type="number" class="form-control" name="angleOfImpact" step="0.1" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-calculate">Vypočítat</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Sekce s výsledky -->
            <div class="result-section" id="resultSection" style="display: none;">
                <h3>Výsledek výpočtu</h3>
                <div class="alert alert-success">
                    Průnik: <span id="penetrationResult">0</span> mm
                </div>
            </div>

            <!-- Historie výpočtů -->
            <div class="history-section">
                <h3>Historie výpočtů</h3>
                <div class="table-responsive">
                    <table class="table table-striped history-table">
                        <thead>
                            <tr>
                                <th>Typ výpočtu</th>
                                <th>Parametry</th>
                                <th>Výsledek (mm)</th>
                                <th>Datum</th>
                            </tr>
                        </thead>
                        <tbody id="historyTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Inicializace formulářů
    initializeForms();
});

function initializeForms() {
    // Plnokaliberní střela
    document.getElementById('fullCaliberForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            mass: parseFloat(formData.get('mass')),
            velocity: parseFloat(formData.get('velocity')),
            theta: parseFloat(formData.get('theta')),
            diameter: parseFloat(formData.get('diameter')),
            k: parseFloat(formData.get('k')),
            n: parseFloat(formData.get('n')),
            s: parseFloat(formData.get('s'))
        };

        try {
            const response = await fetch('http://localhost:8080/api/calculator/full-caliber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                credentials: 'same-origin',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            showResult(result, 'Plnokaliberní střela', data);
        } catch (error) {
            console.error('Chyba:', error);
            alert('Došlo k chybě při výpočtu');
        }
    });

    // Podkaliberní střela
    document.getElementById('subCaliberForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            totalLength: parseFloat(formData.get('totalLength')),
            diameter: parseFloat(formData.get('diameter')),
            velocity: parseFloat(formData.get('velocity')),
            densityPenetrator: parseFloat(formData.get('densityPenetrator')),
            hardnessPenetrator: parseFloat(formData.get('hardnessPenetrator')),
            densityTarget: parseFloat(formData.get('densityTarget')),
            hardnessTarget: parseFloat(formData.get('hardnessTarget')),
            angle: parseFloat(formData.get('angle')),
            material: formData.get('material')
        };

        try {
            const response = await fetch('http://localhost:8080/api/calculator/sub-caliber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            showResult(result, 'Podkaliberní střela', data);
        } catch (error) {
            console.error('Chyba:', error);
            alert('Došlo k chybě při výpočtu');
        }
    });

    // HEAT střela
    document.getElementById('heatForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            diameter: parseFloat(formData.get('diameter')),
            coefficient: parseFloat(formData.get('coefficient')),
            efficiency: parseFloat(formData.get('efficiency')),
            angleOfImpact: parseFloat(formData.get('angleOfImpact'))
        };

        try {
            const response = await fetch('http://localhost:8080/api/calculator/heat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            showResult(result, 'HEAT střela', data);
        } catch (error) {
            console.error('Chyba:', error);
            alert('Došlo k chybě při výpočtu');
        }
    });
}

function showResult(result, type, parameters) {
    // Zobrazení výsledku
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('penetrationResult').textContent = result.toFixed(2);

    // Přidání do historie
    const historyTableBody = document.getElementById('historyTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${type}</td>
        <td>${JSON.stringify(parameters)}</td>
        <td>${result.toFixed(2)}</td>
        <td>${new Date().toLocaleString()}</td>
    `;
    historyTableBody.insertBefore(row, historyTableBody.firstChild);
} 