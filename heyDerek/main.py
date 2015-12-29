from Libs.SVM import svm
from Libs.LogisticRegression import logistic_regression
from Libs.DNN import dnn

# svm.run_svm(1, 'linear')
# LR = logistic_regression.LogisticRegression([50, 60, 70, 80, 90, 100], 10)
# LR.run("track1")
DNN = dnn.DNN("17:1024:1024:1024:2", "C:0.08:5000", 0.0001, 0.5, "sigmoid")
DNN.run("track1")
