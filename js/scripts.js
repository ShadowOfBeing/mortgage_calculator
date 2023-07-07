function getAnswer(category, answerID) {
    var question = document.getElementsByClassName('question')[0]
    var answer = document.getElementsByClassName('answer')[0]

    question.innerHTML = answersAndQuestions[category][answerID]['question']
    answer.innerHTML = answersAndQuestions[category][answerID]['answer']
}

function getQuestionsList(category) {
    var questionsContainer = document.getElementsByClassName('questions-container')[0]
    var questionsHTML = ''
    for (var i = 1; i <= Object.keys(answersAndQuestions[category]).length; i++) {
        questionsHTML += `<div id="question ${i}" class="question-in-menu" onclick="getAnswer('${category}', ${i})">${answersAndQuestions[category][i]['question']}</div>`
    }
    questionsContainer.innerHTML = questionsHTML
}

function getLayout(category) {
    // сохраняем категорию в объекте sessionStorage браузера
    sessionStorage.setItem("category", category)
    // открываем страницу шаблона
    window.location.href = window.location.href.replace("index.html", "layout.html").replace("index", "layout")
}

class MyVariables {
  constructor() {
    // ежемесячные расходы
    this.monthlyExpenses = 0;
    // сумма роста ежемесячных расходов
    this.monthlyExpensesRise = 0;
    // период роста ежемесячных расходов
    this.monthlyExpensesRisePeriod = 0;
    // размер зарплаты
    this.salary = 0;
    // стаж работы
    this.salaryMonth = 0;
    // период роста зарплаты
    this.risePeriod = 0;
    // сумма роста зарплаты
    this.riseAmount = 0;
    // сумма НДФЛ
    this.salaryTax = 0;
    // процент накопительного вклада
    this.accumulativeInterest = 0
    // накопления
    this.accumulation = 0;
    // налоговый вычет за кредит
    this.creditTaxDeduction = 0;
    // налоговый вычет за проценты
    this.percentsTaxDeduction = 0;
    // цена квартиры
    this.apartmentPrice = 0;
    // первоначальный взнос за ипотеку (по умолчанию равен моей доле от продажи квартиры)
    this.mortgageDownPayment = 0;
    // сумма ипотеки
    this.mortgage = 0;
    // период досрочного погашения ипотеки
    this.prepaymentPeriod = 12;
    // процент ипотеки
    this.mortgagePercent = 0;
    // сумма выплаченного тела кредита за год
    this.creditFromYear = 0;
    // сумма выплаченных процентов за год
    this.percentsFromYear = 0;
  }

    reset() {
        for (const item in this) {
            if (this.hasOwnProperty(item)) {
                this[item] = 0
            }
        }
        this.prepaymentPeriod = 12
    }
}

const myVars = new MyVariables()

function roundMyVars() {
    // сумма НДФЛ
    myVars.salaryTax = round(myVars.salaryTax, 2);
    // накопления
    myVars.accumulation = round(myVars.accumulation, 2);
    // налоговый вычет за кредит
    myVars.creditTaxDeduction = round(myVars.creditTaxDeduction, 2);
    // налоговый вычет за проценты
    myVars.percentsTaxDeduction = round(myVars.percentsTaxDeduction, 2);
    // сумма выплаченного тела кредита за год
    myVars.creditFromYear = round(myVars.creditFromYear, 2);
    // сумма выплаченных процентов за год
    myVars.percentsFromYear = round(myVars.percentsFromYear, 2);
}

// функция для рассчёта накоплений
function calcAccumulation(period, credit=0) {
    for (var month = 1; month < period + 1; month++) {
        // раз в rise_period месяцев увеличиваем зарплату на фиксированную величину rise_amount
        if (myVars.salaryMonth % myVars.risePeriod == 0)
            myVars.salary += myVars.riseAmount
        // раз в указанный период (monthly_expenses_rise_period) увеличиваем ежемесячные расходы на фиксированную величину monthly_expenses_rise
        if (myVars.salaryMonth % myVars.monthlyExpensesRisePeriod == 0)
            myVars.monthlyExpenses += myVars.monthlyExpensesRise
        // прибавляем проценты по копилке
        myVars.accumulation += myVars.accumulation * myVars.accumulativeInterest / 12
        // прибавляем остаток от зарплаты после вычета ежемесячных расходов и ипотеки
        myVars.accumulation += myVars.salary - myVars.monthlyExpenses - credit
        myVars.salaryMonth += 1
        myVars.salaryTax += myVars.salary * 0.13
    }
}

// функция для рассчёта суммарного налогового вычета за год (тело ипотеки + проценты)
function calcTaxDeduction() {
    // если у нас остался вычет по кредиту
    if (myVars.creditTaxDeduction && myVars.salaryTax) {
        // считаем максимально возможный налоговый вычет за тело кредита за год
        if (myVars.salaryTax - myVars.creditTaxDeduction > 0) {
            deduction = myVars.creditTaxDeduction
            myVars.salaryTax -= myVars.creditTaxDeduction
            myVars.creditTaxDeduction = 0
        } else {
            deduction = myVars.salaryTax
            myVars.creditTaxDeduction -= myVars.salaryTax
            myVars.salaryTax = 0
        }
        if (myVars.creditFromYear >= deduction) {
            myVars.accumulation += deduction
        } else {
            overage = deduction - myVars.creditFromYear
            myVars.accumulation += myVars.creditFromYear
            myVars.salaryTax += overage
            // возвращаем излишек в кубышку с вычетом по телу кредита
            myVars.creditTaxDeduction += overage
        }
    }
    // если у нас остался вычет по процентам
    if (myVars.percentsTaxDeduction && myVars.salaryTax) {
        // считаем максимально возможный налоговый вычет за проценты по кредиту за год
        if (myVars.salaryTax - myVars.percentsTaxDeduction > 0) {
            deduction = myVars.percentsTaxDeduction
            myVars.salaryTax -= myVars.percentsTaxDeduction
            myVars.percentsTaxDeduction = 0
        } else {
            deduction = myVars.salaryTax
            myVars.percentsTaxDeduction -= myVars.salaryTax
            myVars.salaryTax = 0
        }
        if (myVars.percentsFromYear >= deduction) {
            myVars.accumulation += deduction
        } else {
            overage = deduction - myVars.percentsFromYear
            myVars.accumulation += myVars.percentsFromYear
            myVars.salaryTax += overage
            // возвращаем излишек в кубышку с вычетом по процентам кредита
            myVars.percentsTaxDeduction += overage
        }
    }
}

function mortgagePayments(months, loanAmount, annualInterestRate) {
    // проценты за весь срок
    var percents = 0

    // Рассчитываем месячную процентную ставку
    var monthlyInterestRate = annualInterestRate / 12.0 / 100.0

    // Рассчитываем ежемесячный платеж
    var annuityFactor = (monthlyInterestRate * (1 + monthlyInterestRate) ** months) / ((1 + monthlyInterestRate) ** months - 1)
    var monthlyPayment = loanAmount * annuityFactor

    // Начальный остаток тела кредита равен сумме кредита
    var remainingLoanBalance = loanAmount

    // Выводим заголовки для таблички
    console.log('------------------------------------------------------------')
    console.log("Месяц     Сумма      Тело кредита      Проценты      Остаток")

    for (var month = 1; month < months + 1; month++) {
        // перерасчитываем зарплату, расходы и накопления
        calcAccumulation(1, monthlyPayment)

        if (myVars.accumulation >= remainingLoanBalance) {
            fillMortgageTable('Сумма досрочного погашения', 'Текущая зарплата', 'Текущие расходы',
                  'Остаток налогового вычета на тело ипотеки',
                  'Остаток налогового вычета на проценты по ипотеке', 'red', true)
            fillMortgageTable(myVars.accumulation, myVars.salary, myVars.monthlyExpenses, myVars.creditTaxDeduction,
                              myVars.percentsTaxDeduction, 'red', false)
            break
        }

        // Рассчитываем сумму выплаты по процентам
        var interestPayment = remainingLoanBalance * monthlyInterestRate

        // Рассчитываем сумму выплаты по телу кредита
        var loanPayment = monthlyPayment - interestPayment

        // в конце года прибавляем налоговый вычет к накоплениям (вычитаем 6, потому что ипотеку планирую брать в июле)
        if ((month - 6) % 12 == 0) {
            console.log(`credit_tax за год: ${myVars.creditFromYear}`)
            console.log(`percents_tax за год: ${myVars.percentsFromYear}`)
            calcTaxDeduction()
            myVars.creditFromYear = 0
            myVars.percentsFromYear = 0
        }

        // Если прошел год, уменьшаем тело кредита на сумму накоплений
        if (month % myVars.prepaymentPeriod == 0) {
            console.log('------------------------------------------------------------')
            console.log(`Досрочное погашение: ${myVars.accumulation}`)
            console.log(`Остаток credit_tax:  ${myVars.creditTaxDeduction}`)
            console.log(`Остаток percents_tax: ${myVars.percentsTaxDeduction}`)
            fillMortgageTable('Сумма досрочного погашения', 'Текущая зарплата', 'Текущие расходы',
                              'Остаток налогового вычета на тело ипотеки',
                              'Остаток налогового вычета на проценты по ипотеке', 'red', true)
            fillMortgageTable(myVars.accumulation, myVars.salary, myVars.monthlyExpenses, myVars.creditTaxDeduction,
                              myVars.percentsTaxDeduction, 'red', false)
            remainingLoanBalance -= myVars.accumulation
            if (remainingLoanBalance >= 0) {
                myVars.accumulation = 0
            } else {
                myVars.accumulation = -remainingLoanBalance
            }
        }

        // Вычитаем сумму выплаты по телу кредита из остатка тела кредита
        remainingLoanBalance -= loanPayment

        // Перерассчитываем количество месяцев платежей
        //months = -log(1 - monthlyInterestRate * remainingLoanBalance / monthlyPayment) / log(1 + monthlyInterestRate)

        // Изменяем количество месяцев
        if (remainingLoanBalance <= 0) {
            // Изменяем количество месяцев
            months = month
            break
        }

        percents += interestPayment
        myVars.creditFromYear += loanPayment
        myVars.percentsFromYear += interestPayment

        // Раз в полгода выводим текущую зарплату, расходы и прочее
        if (month % 6 == 0) {
            console.log('------------------------------------------------------------')
            console.log(`Зарплата:   ${myVars.salary}`)
            console.log(`Расходы:    ${myVars.monthlyExpenses}`)
            console.log(`Накопления: ${myVars.accumulation}`)
            console.log('------------------------------------------------------------')
        }
        roundMyVars()
        // Выводим результаты для текущего месяца
        fillMortgageTable(month, monthlyPayment, loanPayment, interestPayment, remainingLoanBalance, 'white', false)
        console.log(`${month}    ${monthlyPayment}    ${loanPayment}    ${interestPayment}    ${remainingLoanBalance}`)
    }
    console.log('------------------------------------------------------------')
    console.log(`Тело кредита: ${loanAmount}`)
    console.log(`Проценты:     ${percents}`)
    console.log(`Сумма:        ${loanAmount + percents}`)
    console.log(`Зарплата:     ${myVars.salary}`)
    console.log(`Накопления:   ${myVars.accumulation}`)
    // сбрасываем все переменные
    myVars.reset()
}

function viewResult() {
    document.getElementById('mortgage-table').innerHTML = ''
    myVars.apartmentPrice = parseInt(document.getElementById('apartment-price').value)
    myVars.mortgagePercent = parseInt(document.getElementById('mortgage-percent').value)
    myVars.monthlyExpenses = parseInt(document.getElementById('monthly-expenses').value)
    myVars.monthlyExpensesRise = parseInt(document.getElementById('monthly-expenses-rise').value)
    myVars.monthlyExpensesRisePeriod = parseInt(document.getElementById('monthly-expenses-rise-period').value)
    myVars.salary = parseInt(document.getElementById('salary').value)
    myVars.risePeriod = parseInt(document.getElementById('rise-period').value)
    myVars.riseAmount = parseInt(document.getElementById('rise-amount').value)
    myVars.accumulativeInterest = parseInt(document.getElementById('accumulative-interest').value) / 100
    // myVars.accumulation = parseInt(document.getElementById('accumulation').value)
    myVars.creditTaxDeduction = parseInt(document.getElementById('credit-tax-deduction').value)
    myVars.percentsTaxDeduction = parseInt(document.getElementById('percents-tax-deduction').value)
    myVars.mortgageDownPayment = parseInt(document.getElementById('mortgage-down-payment').value)
    var mortgagePeriod = parseInt(document.getElementById('mortgage-period').value)
    var annualInterestRate = parseInt(document.getElementById('mortgage-percent').value)
    var loanAmount = myVars.apartmentPrice - myVars.mortgageDownPayment

    mortgagePayments(mortgagePeriod, loanAmount, annualInterestRate)
}