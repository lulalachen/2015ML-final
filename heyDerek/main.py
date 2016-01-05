from Libs.SVM import svm
from Libs.LogisticRegression import logistic_regression
from Libs.RandomForest import random_forest
from Libs.DNN import dnn

# svm.run_svm(1, 'linear')
# LR = logistic_regression.LogisticRegression([50, 60, 70, 80, 90, 100], 10)
# LR.run("track1")
RF = random_forest.RandomForest(2000, 100)
RF.run()
# DNN = dnn.DNN("18:1024:1024:2", "C:0.1:500", 0, 0.5, "sigmoid")
# DNN.run("track2")
