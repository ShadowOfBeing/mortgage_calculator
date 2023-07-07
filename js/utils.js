function round(number, n) {
    return Math.floor(number * 10 ** n) / 10 ** n
}

function fillMortgageTable(column1, column2, column3, column4, column5, color, isString) {
    var table = document.getElementById('mortgage-table')
    var tr = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    var td4 = document.createElement("td")
    var td5 = document.createElement("td")
    td1.innerHTML = isString ? column1 : round(column1, 2)
    td2.innerHTML = isString ? column2 : round(column2, 2)
    td3.innerHTML = isString ? column3 : round(column3, 2)
    td4.innerHTML = isString ? column4 : round(column4, 2)
    td5.innerHTML = isString ? column5 : round(column5, 2)
    if (color == 'red') {
        td1.style.backgroundColor = 'red'
        td2.style.backgroundColor = 'red'
        td3.style.backgroundColor = 'red'
        td4.style.backgroundColor = 'red'
        td5.style.backgroundColor = 'red'
    }
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    table.appendChild(tr)
}

function startPage() {
    var hints = {
        'monthly-expenses': 'ваши ежемесячные расходы на жизнь без учёта оплаты ипотеки',
        'monthly-expenses-rise-period': 'период, через который вы предполагаете рост ваших ежемесячных расходов на ' +
                                        'жизнь без учёта ипотеки (например каждые 6 месяцев или каждые 12 месяцев)',
        'rise-period': 'период, через который вы предполагаете рост вашей зарплаты ' +
                       '(например каждые 6 месяцев или каждые 12 месяцев)',
        'accumulative-interest': 'годовой процент по накопительному вкладу, на котором вы храните излишки зарплаты',
        'credit-tax-deduction': 'оставшаяся у вас сумма налогового вычета на тело ипотеки (если вы ещё не тратили ' +
                                'его, то по умолчанию от государства вам полагается 260 тысяч)',
        'percents-tax-deduction': 'оставшаяся у вас сумма налогового вычета на проценты по ипотеке (если вы ещё не ' +
                                  'тратили его, то по умолчанию от государства вам полагается 390 тысяч)',
    }

    for (var key in hints) {
        document.getElementById(key).previousSibling.previousSibling.children[0].title = hints[key]
    }
}

function toggle(target) {
    var targetElement = document.getElementsByClassName(`${target}OptionsWrapper`)[0]
    var openElement = document.getElementsByClassName('open')[0]

    if (targetElement.classList.contains('open')) {
        var option = 'del'
    } else {
        var option = 'add'
    }

    if (openElement) {
        openElement.classList.remove('open')
        openElement.previousElementSibling.firstElementChild.classList.replace('arrow-up', 'arrow-down')
    }

    if (option == 'del') {
        targetElement.classList.remove('open')
        targetElement.previousElementSibling.firstElementChild.classList.replace('arrow-up', 'arrow-down')
    } else {
        targetElement.classList.add('open')
        targetElement.previousElementSibling.firstElementChild.classList.replace('arrow-down', 'arrow-up')
    }
}