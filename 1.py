"""
калькулятор ипотеки
при досрочном погашении производится перерасчёт графика платежей с сохранением ежемесячной суммы платежа и сокращением
срока платежей
добавить:
- создать функцию, которая принимает стартовую зарплату, период повышения, сумму повышения, ежемесячные затраты, сумму
роста ежемесячных затрат, период роста ежемесячных затрат, сумму платежа по ипотеке, сумму налогового вычета за год и
выдаёт сумму накоплений за год, которые можно пустить на досрочное погашение ипотеки
- в функцию по ипотеке добавить динамически меняющуюся сумму досрочного погашения. Например, при наступлении месяца
досрочного погашения функция должна брать сумму накоплений, сформированную другой функцией
- вынести процент по накопительному вкладу в отдельную переменную
- добавить обнуление старых результатов при повторном запуске рассчётов
- сделать корректировку в какой месяц будет взята ипотека
- посмотреть нужен ли реальный перерасчёт ипотеки при досрочном погашении

факторы, которые нужно учесть:
- возможный льготный процент ипотеки (Сбер, Яндекс)
- налоговый вычет жены
- помощь мамы
- вложения в квартиру жены
- досрочное погашение не в конце года, а в любой месяц, если суммы хватает закрыть всю ипотеку
"""
from math import log


class MyVariables:
    def __init__(self):
        # ежемесячные расходы
        self.monthly_expenses = 32000
        # сумма роста ежемесячных расходов
        self.monthly_expenses_rise = 5000
        # период роста ежемесячных расходов
        self.monthly_expenses_rise_period = 12
        # размер зарплаты
        self.salary = 150000
        # стаж работы
        self.salary_month = 0
        # период роста зарплаты
        self.rise_period = 6
        # сумма роста зарплаты
        self.rise_amount = 15000
        # сумма НДФЛ
        self.salary_tax = 0
        # процент накопительного вклада
        self.accumulative_interest = 8
        # накопления
        self.accumulation = 200000
        # налоговый вычет за кредит
        self.credit_tax_deduction = 260000
        # налоговый вычет за проценты
        self.percents_tax_deduction = 390000
        # цена квартиры
        self.apartment_price = 9000000
        # первоначальный взнос за ипотеку (по умолчанию равен моей доле от продажи квартиры)
        self.mortgage_down_payment = 500000
        # сумма ипотеки
        mortgage = 0
        # период досрочного погашения ипотеки
        self.prepayment_period = 12
        # сумма выплаченного тела кредита за год
        self.credit_from_year = 0
        # сумма выплаченных процентов за год
        self.percents_from_year = 0


my_vars = MyVariables()


def mortgage_payments(months, loan_amount, annual_interest_rate):
    # проценты за весь срок
    percents = 0

    # Рассчитываем месячную процентную ставку
    monthly_interest_rate = annual_interest_rate / 12.0 / 100.0

    # Рассчитываем ежемесячный платеж
    annuity_factor = (monthly_interest_rate * (1 + monthly_interest_rate) ** months) / ((1 + monthly_interest_rate) ** months - 1)
    monthly_payment = loan_amount * annuity_factor
    print(monthly_payment)

    # Начальный остаток тела кредита равен сумме кредита
    remaining_loan_balance = loan_amount

    # Выводим заголовки для таблички
    print('-' * 65)
    print("{:<8} {:<13} {:<15} {:<13} {:<30}".format("Месяц", "Сумма", "Тело кредита", "Проценты", "Остаток"))

    for month in range(1, months + 1):
        # перерасчитываем зарплату, расходы и накопления
        calc_accumulation(1, monthly_payment)

        # Рассчитываем сумму выплаты по процентам
        interest_payment = remaining_loan_balance * monthly_interest_rate

        # Рассчитываем сумму выплаты по телу кредита
        loan_payment = monthly_payment - interest_payment

        # в конце года прибавляем налоговый вычет к накоплениям (вычитаем 6, потому что ипотеку планирую брать в июле)
        if (month - 6) % 12 == 0:
            print(f'credit_tax за год: {my_vars.credit_from_year:.2f}')
            print(f'percents_tax за год: {my_vars.percents_from_year:.2f}')
            calc_tax_deduction()
            my_vars.credit_from_year = 0
            my_vars.percents_from_year = 0

        # Если прошел год, уменьшаем тело кредита на сумму накоплений
        if month % my_vars.prepayment_period == 0:
            print('-' * 65)
            print(f'Досрочное погашение: {my_vars.accumulation:.2f}')
            print(f'Остаток credit_tax:  {my_vars.credit_tax_deduction:.2f}')
            print(f'Остаток percents_tax: {my_vars.percents_tax_deduction:.2f}')
            remaining_loan_balance -= my_vars.accumulation
            if remaining_loan_balance >= 0:
                my_vars.accumulation = 0
            else:
                my_vars.accumulation = -remaining_loan_balance

        # Вычитаем сумму выплаты по телу кредита из остатка тела кредита
        remaining_loan_balance -= loan_payment

        # Перерассчитываем количество месяцев платежей
        months = -log(1 - monthly_interest_rate * remaining_loan_balance / monthly_payment) / log(1 + monthly_interest_rate)

        # Изменяем количество месяцев
        if remaining_loan_balance <= 0:
            # Изменяем количество месяцев
            months = month
            break

        percents += interest_payment
        my_vars.credit_from_year += loan_payment
        my_vars.percents_from_year += interest_payment

        # Раз в полгода выводим текущую зарплату, расходы и прочее
        if month % 6 == 0:
            print('-' * 65)
            print(f'Зарплата:   {my_vars.salary}')
            print(f'Расходы:    {my_vars.monthly_expenses}')
            print(f'Накопления: {my_vars.accumulation:.2f}')
            print('-' * 65)
        # Выводим результаты для текущего месяца
        print("{:<8} {:<13,.2f} {:<15,.2f} {:<13,.2f} {:<15,.2f}".format(month, monthly_payment, loan_payment,
                                                                         interest_payment, remaining_loan_balance))
    print('-' * 65)
    print(f'Тело кредита: {loan_amount:.2f}')
    print(f'Проценты:     {percents:.2f}')
    print(f'Сумма:        {loan_amount + percents:.2f}')
    print(f'Зарплата:     {my_vars.salary:.2f}')
    print(f'Накопления:   {my_vars.accumulation:.2f}')


# функция для рассчёта накоплений
def calc_accumulation(period, credit=0):
    for month in range(1, period + 1):
        # раз в rise_period месяцев увеличиваем зарплату на фиксированную величину rise_amount
        if my_vars.salary_month % my_vars.rise_period == 0:
            my_vars.salary += my_vars.rise_amount
        # раз в указанный период (monthly_expenses_rise_period) увеличиваем ежемесячные расходы на фиксированную величину monthly_expenses_rise
        if my_vars.salary_month % my_vars.monthly_expenses_rise_period == 0:
            my_vars.monthly_expenses += my_vars.monthly_expenses_rise
        # прибавляем проценты по копилке
        my_vars.accumulation += my_vars.accumulation * my_vars.accumulative_interest / 12
        # прибавляем остаток от зарплаты после вычета ежемесячных расходов и ипотеки
        my_vars.accumulation += my_vars.salary - my_vars.monthly_expenses - credit
        my_vars.salary_month += 1
        my_vars.salary_tax += my_vars.salary * 0.13


# функция для рассчёта суммарного налогового вычета за год (тело ипотеки + проценты)
def calc_tax_deduction():
    # если у нас остался вычет по кредиту
    if my_vars.credit_tax_deduction and my_vars.salary_tax:
        # считаем максимально возможный налоговый вычет за тело кредита за год
        if my_vars.salary_tax - my_vars.credit_tax_deduction > 0:
            deduction = my_vars.credit_tax_deduction
            my_vars.salary_tax -= my_vars.credit_tax_deduction
            my_vars.credit_tax_deduction = 0
        else:
            deduction = my_vars.salary_tax
            my_vars.credit_tax_deduction -= my_vars.salary_tax
            my_vars.salary_tax = 0
        if my_vars.credit_from_year >= deduction:
            my_vars.accumulation += deduction
        else:
            overage = deduction - my_vars.credit_from_year
            my_vars.accumulation += my_vars.credit_from_year
            my_vars.salary_tax += overage
            # возвращаем излишек в кубышку с вычетом по телу кредита
            my_vars.credit_tax_deduction += overage
    # если у нас остался вычет по процентам
    if my_vars.percents_tax_deduction and my_vars.salary_tax:
        # считаем максимально возможный налоговый вычет за проценты по кредиту за год
        if my_vars.salary_tax - my_vars.percents_tax_deduction > 0:
            deduction = my_vars.percents_tax_deduction
            my_vars.salary_tax -= my_vars.percents_tax_deduction
            my_vars.percents_tax_deduction = 0
        else:
            deduction = my_vars.salary_tax
            my_vars.percents_tax_deduction -= my_vars.salary_tax
            my_vars.salary_tax = 0
        if my_vars.percents_from_year >= deduction:
            my_vars.accumulation += deduction
        else:
            overage = deduction - my_vars.percents_from_year
            my_vars.accumulation += my_vars.percents_from_year
            my_vars.salary_tax += overage
            # возвращаем излишек в кубышку с вычетом по процентам кредита
            my_vars.percents_tax_deduction += overage


# считаем накопления на первоначальный взнос
print(f'Стартовая зарплата:   {my_vars.salary}')
# calc_accumulation(12)
# my_vars.mortgage_down_payment += my_vars.accumulation
# my_vars.mortgage_down_payment = my_vars.mortgage_down_payment if my_vars.apartment_price * 0.15 <= my_vars.mortgage_down_payment else my_vars.apartment_price * 0.15
my_vars.mortgage_down_payment += 700000
my_vars.accumulation = 0
# уменьшаем ежемесячные расходы на сумму аренды квартиры (теперь вместо
# аренды будем платить ипотеку, которая считается отдельно)
# my_vars.monthly_expenses = 25000
my_vars.monthly_expenses = 30000
my_vars.mortgage = my_vars.apartment_price - my_vars.mortgage_down_payment
print(f'Цена квартиры:        {my_vars.apartment_price:.2f}')
print(f'Первоначальный взнос: {my_vars.mortgage_down_payment:.2f}')
print(f'Сума ипотеки:         {my_vars.mortgage:.2f}')
# строим график платежей по ипотеке
mortgage_payments(180, my_vars.mortgage, 9)
