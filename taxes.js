const incomeElement = document.getElementById('grossinput');
const retirementElement = document.getElementById('401k');

rates = {
    "2020": {
        "fedDeduction": 12400,
        "fedTaxRates": [
            [0.0, 0.10],
            [9875.0, 0.12],
            [40125.0, 0.22],
            [85525.0, 0.24],
            [163300.0, 0.32],
            [207350.0, 0.35],
            [518400.0, 0.37]
        ],
        "mdDeduction": [15333.0, 10333.0, 2300.0, 1550.0]
    },
    "2021": {
        "fedDeduction": 12550,
        "fedTaxRates": [
            [0.0, 0.10],
            [9950.0, 0.12],
            [40525.0, 0.22],
            [86375.0, 0.24],
            [164925.0, 0.32],
            [209425.0, 0.35],
            [523600.0, 0.37]
        ],
        "mdDeduction": [15667.0, 10333.0, 2350.0, 1550.0]
    },
    "2022": {
        "fedDeduction": 12950,
        "fedTaxRates": [
            [0.0, 0.10],
            [10275.0, 0.12],
            [41775.0, 0.22],
            [89075.0, 0.24],
            [170050.0, 0.32],
            [215950.0, 0.35],
            [539900.0, 0.37]
        ],
        "mdDeduction": [16000.0, 10667.0, 2400.0, 1600.0]
    },
    "2023": {
        "fedDeduction": 13850,
        "fedTaxRates": [
            [0.0, 0.10],
            [1100.0, 0.12],
            [44725.0, 0.22],
            [95375.0, 0.24],
            [182100.0, 0.32],
            [231250.0, 0.35],
            [578125.0, 0.37]
        ],
        "mdDeduction": [16000.0, 10667.0, 2550.0, 1700.0]
    },
    "2024": {
        "fedDeduction": 14600,
        "fedTaxRates": [
            [0.0, 0.10],
            [1160.0, 0.12],
            [47150.0, 0.22],
            [100525.0, 0.24],
            [191950.0, 0.32],
            [243725.0, 0.35],
            [609350.0, 0.37]
        ],
        "mdDeduction": [16000.0, 10667.0, 2550.0, 1700.0]
    },
    "2025": {
        "fedDeduction": 1500,
        "fedTaxRates": [
            [0.0, 0.10],
            [11925.0, 0.12],
            [48475.0, 0.22],
            [103350.0, 0.24],
            [197300.0, 0.32],
            [250525.0, 0.35],
            [626350.0, 0.37]
        ],
        "mdDeduction": [16000.0, 10667.0, 2550.0, 1700.0]
    },
    "mdExemptions": [
        [100000, 3200],
        [125000, 1600],
        [150000, 800]
    ],
    "mdTaxRates": [
        [0.0, 0.02],
        [1000.0, 0.03],
        [2000.0, 0.04],
        [3000.0, 0.0475],
        [100000.0, 0.05],
        [125000.0, 0.0525],
        [150000.0, 0.055],
        [250000.0, 0.0575]
    ],
    "bcTaxRate": 0.0320,
    "fica": 0.0765
}

function handleIncome(e) {
    const taxYear = "2024";
    const income = incomeElement.value;
    if (income === '' || income == null) {
        return;
    }

    const retirement = retirementElement.value;
    let agi = income;
    if (retirement !== '' && retirement !== null) {
        agi = income - retirement;
    }

    const fedInc = calcFederalDeduction(agi, taxYear);
    const mdInc = calcStateDeductions(agi, taxYear, 1);
    const fedTax = calcTaxes(fedInc, rates[taxYear]["fedTaxRates"]);
    const mdTax = calcTaxes(mdInc, rates["mdTaxRates"]);
    const localTax = mdInc * rates["bcTaxRate"];

    let fica = income * rates["fica"];
    if (income > 168600) {
        fica = 168600 * rates["fica"];
    }

    const takeHome = income - fica - fedTax - mdTax - localTax;
    document.getElementById("fed").innerHTML = numberWithCommas(fedTax);
    document.getElementById("state").innerHTML = numberWithCommas(mdTax);
    document.getElementById("local").innerHTML = numberWithCommas(localTax);
    document.getElementById("fica").innerHTML = numberWithCommas(fica);
    document.getElementById("takehome").innerHTML = numberWithCommas(takeHome);
}

function calcStateExemptions(gross, num) {
    rates["mdExemptions"].forEach(ex => {
        if (gross <= ex[0]) {
            return ex[1] * num;
        }
    });
    return 0;
}

function calcStateDeductions(gross, year, num) {
    const top = rates[year]["mdDeduction"][0]
    const bottom = rates[year]["mdDeduction"][1]
    const maxd = rates[year]["mdDeduction"][2]
    const mind = rates[year]["mdDeduction"][3]

    let deduction;
    if (gross > top) {
        deduction = maxd;
    } else if (gross < bottom) {
        deduction = mind;
    } else {
        deduction = mind + ((gross - bottom) * 0.15);
    }
    return gross - deduction - calcStateExemptions(gross, num);
}

function calcFederalDeduction(gross, year) {
    return Math.max(gross - rates[year]["fedDeduction"], 0);
}

function calcTaxes(gross, rates) {
    i = gross;
    tax = 0.0;
    rates.slice().reverse().forEach(rate => {
        if (i >= rate[0]) {
            residual = i - rate[0];
            tax += residual * rate[1];
            i -= residual;
        }
    });
    return tax;
}

function numberWithCommas(x) {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

incomeElement.addEventListener('input', handleIncome);
retirementElement.addEventListener('input', handleIncome);
