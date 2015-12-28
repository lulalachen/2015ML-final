from Libs.SVM import svm
from Libs.LogisticRegression import logistic_regression

# svm.run_svm(1, 'linear')
LR = logistic_regression.LogisticRegression([50, 60, 70, 80, 90, 100], 10)
LR.run("track2")
