from fractions import Fraction

x = 0.3333333333333333
f = Fraction(x).limit_denominator()   # f = Fraction(1, 3)
print(f"{f.numerator}/{f.denominator}")   # “1/3”

y = 0.25
g = Fraction(y).limit_denominator()   # g = Fraction(1, 4)
print(f"{g.numerator}/{g.denominator}")   # “1/4”
