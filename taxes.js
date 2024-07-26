const gross = document.getElementById('grossinput');

function handleGross(e) {
    const ficaTaxRate = 0.0765;
    const gross = e.target.value;
    const fed = calcFederal(gross);

    let fica = gross * ficaTaxRate;
    if (gross > 168600) {
        fica = 168600 * ficaTaxRate;
    }

    if (gross === '' || gross == null) {
        return;
    }

    const takeHome = gross - fica - fed;

    document.getElementById("fed").innerHTML = numberWithCommas(fed);
    document.getElementById("fica").innerHTML = numberWithCommas(fica);
    document.getElementById("takehome").innerHTML = numberWithCommas(takeHome);
}


function calcFederal(gross) {
    let ret = 0;

    const fed23Deduction = 13850;
    const fed23tax = [
        [0.10, 0, 1100],
        [0.12, 11001, 44725],
        [0.22, 44726, 95375],
        [0.32, 182101, 231250],
        [0.35, 231251, 578125],
        [0.37, 578126, -1]
    ]

    if (gross < fed23Deduction) {
        return 0;
    }
    let curr = gross - fed23Deduction;

    fed23tax.forEach(rate => {
        if (curr > rate[2] && rate[2] != -1) {
            ret += rate[2] * rate[0];
            curr -= rate[2];
            return;
        }
        ret += curr * rate[0];
        curr = 0;
    })

    return ret;
}

function numberWithCommas(x) {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

gross.addEventListener('input', handleGross);
