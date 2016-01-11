from Libs.FeatureSelection import feature_selection
# from Libs.Preprocess import preprocess
# from Libs.SVM import svm
# from Libs.LogisticRegression import logistic_regression
# from Libs.RandomForest import random_forest
from Libs.GradientBoosting import gradient_boost
# from Libs.DNN import dnn


# preprocess.filter_unuseful_features()
# preprocess.extract_features([6, 4, 15, 14, 10, 9, 5, 0, 11, 16, 7, 8, 24, 3, 12])
# svm.run_svm(1, 'linear')
# LR = logistic_regression.LogisticRegression([50, 60, 70, 80, 90, 100], 10)
# LR.run("track1")
# GB = gradient_boost.GradientBoost(100, 6)
# GB.run()
# RF = random_forest.RandomForest(2500, 100)
# RF.run()
# DNN = dnn.DNN("18:1024:1024:2", "C:0.1:500", 0, 0.5, "sigmoid")
# DNN.run("track2")
# feature_selection.gen_log_frequency_feature()
# feature_selection.gen_log_histogram_feature()
# feature_selection.gen_log_unique_object_count()
feature_selection.gen_log_fft()
