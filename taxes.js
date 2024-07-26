const gross = document.getElementById('grossinput');

function handleGross(e) {
    const gross = e.target.value;
    const fed = calcFederal(gross);
    if (fed === '' || fed == null) {
        return;
    }

    document.getElementById("feddisplay").innerHTML = numberWithCommas(fed);
    document.getElementById("takehome").innerHTML = numberWithCommas(Number(gross) - Number(fed));
}


function calcFederal(gross) {
    let ret = 0;
    let curr = gross;

    const fed23tax = [
        [0.10, 0, 1100],
        [0.12, 11001, 44725],
        [0.22, 44726, 95375],
        [0.32, 182101, 231250],
        [0.35, 231251, 578125],
        [0.37, 578126, -1]
    ]

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
