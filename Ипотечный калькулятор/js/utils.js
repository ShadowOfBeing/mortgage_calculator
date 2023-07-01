function round(number, n) {
    return Math.floor(number * 10 ** n) / 10 ** n
}

function createTable() {
    var table = document.getElementById('table-for-data')
    table.innerHTML = "<tbody></tbody>"
    var theme = document.getElementById('column1').children[0].children[0].classList[1]
    var length = Object.keys(dictForTitle[theme]).length
    window.row_count = length
    for (i = 0; i < length; i++) {
        var tr = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        var td3 = document.createElement("td")
        td1.setAttribute('id', `r${i + 1}c1`)
        td2.setAttribute('id', `r${i + 1}c2`)
        td3.setAttribute('id', `r${i + 1}c3`)
        td1.setAttribute('class', 'can_be_closed')
        td2.setAttribute('class', 'can_be_closed')
        td3.setAttribute('class', 'can_be_closed')
        td1.innerHTML = dictForTitle[theme][i]
        td2.innerHTML = ''
        td3.innerHTML = ''
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        table.appendChild(tr)
    }
    fillFunctionTableLang(document.getElementById('column2').children[0].children[0].classList[1], length, 2)
    fillFunctionTableLang(document.getElementById('column3').children[0].children[0].classList[1], length, 3)
}

function fillMortgageTable(month, monthlyPayment, loanPayment, interestPayment, remainingLoanBalance) {
    var table = document.getElementById('mortgage-table')
    var tr = document.createElement("tr")
    var td1 = document.createElement("td")
    var td2 = document.createElement("td")
    var td3 = document.createElement("td")
    var td4 = document.createElement("td")
    var td5 = document.createElement("td")
    td1.innerHTML = round(month, 2)
    td2.innerHTML = round(monthlyPayment, 2)
    td3.innerHTML = round(loanPayment, 2)
    td4.innerHTML = round(interestPayment, 2)
    td5.innerHTML = round(remainingLoanBalance, 2)
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