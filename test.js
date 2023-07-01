class MyVariables {
  constructor() {
    // ежемесячные расходы
    this.monthly_expenses = 32000;
    // сумма роста ежемесячных расходов
    this.monthly_expenses_rise = 5000;
    // размер зарплаты
    this.salary = 150000;
    // стаж работы
    this.salary_month = 0;
    // период роста зарплаты
    this.rise_period = 6;
    // сумма роста зарплаты
    this.rise_amount = 15000;
    // сумма НДФЛ
    this.salary_tax = 0;
    // накопления
    this.accumulation = 200000;
    // налоговый вычет за кредит
    this.credit_tax_deduction = 260000;
    // налоговый вычет за проценты
    this.percents_tax_deduction = 390000;
    // цена квартиры
    this.apartment_price = 9000000;
    // первоначальный взнос за ипотеку (по умолчанию равен моей доле от продажи квартиры)
    this.mortgage_down_payment = 500000;
    // сумма ипотеки
    let mortgage = 0;
    // сумма выплаченного тела кредита за год
    this.credit_from_year = 0;
    // сумма выплаченных процентов за год
    this.percents_from_year = 0;
  }
}

const my_vars = new MyVariables();


function mortgage_payments(months, loan_amount, annual_interest_rate, prepayment_period):
    // проценты за весь срок
    percents = 0

    // Рассчитываем месячную процентную ставку
    monthly_interest_rate = annual_interest_rate / 12.0 / 100.0

    // Рассчитываем ежемесячный платеж
    annuity_factor = (monthly_interest_rate * (1 + monthly_interest_rate) ** months) / ((1 + monthly_interest_rate) ** months - 1)
    monthly_payment = loan_amount * annuity_factor

    // Начальный остаток тела кредита равен сумме кредита
    remaining_loan_balance = loan_amount

    // Выводим заголовки для таблички
    console.log('-' * 65)
    console.log("{:<8} {:<13} {:<15} {:<13} {:<30}".format("Месяц", "Сумма", "Тело кредита", "Проценты", "Остаток"))

    for month in range(1, months + 1):
        // перерасчитываем зарплату, расходы и накопления
        calc_accumulation(1, monthly_payment)

        // Рассчитываем сумму выплаты по процентам
        interest_payment = remaining_loan_balance * monthly_interest_rate

        // Рассчитываем сумму выплаты по телу кредита
        loan_payment = monthly_payment - interest_payment

        // в конце года прибавляем налоговый вычет к накоплениям (вычитаем 6, потому что ипотеку планирую брать в июле)
        if (month - 6) % 12 == 0:
            console.log(f'credit_tax за год: {my_vars.credit_from_year:.2f}')
            console.log(f'percents_tax за год: {my_vars.percents_from_year:.2f}')
            calc_tax_deduction()
            my_vars.credit_from_year = 0
            my_vars.percents_from_year = 0

        // Если прошел год, уменьшаем тело кредита на сумму накоплений
        if month % prepayment_period == 0:
            console.log('-' * 65)
            console.log(f'Досрочное погашение: {my_vars.accumulation:.2f}')
            console.log(f'Остаток credit_tax:  {my_vars.credit_tax_deduction:.2f}')
            console.log(f'Остаток percents_tax: {my_vars.percents_tax_deduction:.2f}')
            remaining_loan_balance -= my_vars.accumulation
            if remaining_loan_balance >= 0:
                my_vars.accumulation = 0
            else:
                my_vars.accumulation = -remaining_loan_balance

        // Вычитаем сумму выплаты по телу кредита из остатка тела кредита
        remaining_loan_balance -= loan_payment

        // Перерассчитываем количество месяцев платежей
        months = -log(1 - monthly_interest_rate * remaining_loan_balance / monthly_payment) / log(1 + monthly_interest_rate)

        // Изменяем количество месяцев
        if remaining_loan_balance <= 0:
            // Изменяем количество месяцев
            months = month
            break

        percents += interest_payment
        my_vars.credit_from_year += loan_payment
        my_vars.percents_from_year += interest_payment

        // Раз в полгода выводим текущую зарплату, расходы и прочее
        if month % 6 == 0:
            console.log('-' * 65)
            console.log(f'Зарплата:   {my_vars.salary}')
            console.log(f'Расходы:    {my_vars.monthly_expenses}')
            console.log(f'Накопления: {my_vars.accumulation:.2f}')
            console.log('-' * 65)
        // Выводим результаты для текущего месяца
        console.log("{:<8} {:<13,.2f} {:<15,.2f} {:<13,.2f} {:<15,.2f}".format(month, monthly_payment, loan_payment,
                                                                         interest_payment, remaining_loan_balance))
    console.log('-' * 65)
    console.log(f'Тело кредита: {loan_amount:.2f}')
    console.log(f'Проценты:     {percents:.2f}')
    console.log(f'Сумма:        {loan_amount + percents:.2f}')
    console.log(f'Зарплата:     {my_vars.salary:.2f}')
    console.log(f'Накопления:   {my_vars.accumulation:.2f}')


// функция для рассчёта накоплений
def calc_accumulation(period, credit=0):
    for month in range(1, period + 1):
        // раз в rise_period месяцев увеличиваем зарплату на фиксированную величину rise_amount
        if my_vars.salary_month % my_vars.rise_period == 0:
            my_vars.salary += my_vars.rise_amount
        // раз в году увеличиваем ежемесячные расходы на фиксированную величину monthly_expenses_rise
        if my_vars.salary_month % 12 == 0:
            my_vars.monthly_expenses += my_vars.monthly_expenses_rise
        // прибавляем проценты по копилке
        my_vars.accumulation += my_vars.accumulation * 0.08 / 12
        // прибавляем остаток от зарплаты после вычета ежемесячных расходов и ипотеки
        my_vars.accumulation += my_vars.salary - my_vars.monthly_expenses - credit
        my_vars.salary_month += 1
        my_vars.salary_tax += my_vars.salary * 0.13


// функция для рассчёта суммарного налогового вычета за год (тело ипотеки + проценты)
def calc_tax_deduction():
    // если у нас остался вычет по кредиту
    if my_vars.credit_tax_deduction:
        if my_vars.credit_from_year >= my_vars.credit_tax_deduction:
            my_vars.accumulation += my_vars.credit_tax_deduction
            my_vars.credit_tax_deduction = 0
        else:
            my_vars.accumulation += my_vars.credit_from_year
            my_vars.credit_tax_deduction -= my_vars.credit_from_year
    // если у нас остался вычет по процентам
    if my_vars.percents_tax_deduction:
        if my_vars.percents_from_year >= my_vars.percents_tax_deduction:
            my_vars.accumulation += my_vars.percents_tax_deduction
            my_vars.percents_tax_deduction = 0
        else:
            my_vars.accumulation += my_vars.percents_from_year
            my_vars.percents_tax_deduction -= my_vars.percents_from_year


// считаем накопления на первоначальный взнос
console.log(f'Стартовая зарплата:   {my_vars.salary}')
calc_accumulation(12)
my_vars.mortgage_down_payment += my_vars.accumulation
my_vars.mortgage_down_payment = my_vars.mortgage_down_payment if my_vars.apartment_price * 0.15 <= my_vars.mortgage_down_payment else my_vars.apartment_price * 0.15
my_vars.accumulation = 0
// уменьшаем ежемесячные расходы на сумму аренды квартиры (теперь вместо
// аренды будем платить ипотеку, которая считается отдельно)
my_vars.monthly_expenses = 25000
my_vars.mortgage = my_vars.apartment_price - my_vars.mortgage_down_payment
console.log(f'Цена квартиры:        {my_vars.apartment_price:.2f}')
console.log(f'Первоначальный взнос: {my_vars.mortgage_down_payment:.2f}')
console.log(f'Сума ипотеки:         {my_vars.mortgage:.2f}')
// строим график платежей по ипотеке
mortgage_payments(120, my_vars.mortgage, 9, 12)

