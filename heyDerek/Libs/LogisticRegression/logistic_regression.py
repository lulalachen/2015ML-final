from ..Def import path_def
from ..Utils import data_io as io
from ..Utils import evaluate as ev
from ..Utils import data_util as du
from sklearn import linear_model
import numpy as np
import time


def run_logistic_regression(c, track):
    # Training
    train_file = path_def.SAMPLE_TRAIN_X_CSV
    print "Reading training file:", train_file
    t1 = time.time()
    train_data_id, train_x, train_y = io.read_train_data(train_file)
    train_x = du.standardize_data_var(train_x)
    train_y[train_y == 0] = -1.0
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"

    print "Start training with Logistic Regression ( C =", c, ")"
    t1 = time.time()
    clf = linear_model.LogisticRegression(C=c)
    clf.fit(train_x, train_y.flatten())
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"

    # Testing
    test_file = path_def.SAMPLE_TEST_X_CSV
    print "Reading testing file:", test_file
    t1 = time.time()
    test_data_id, test_x = io.read_test_data(test_file)
    std_test_x = du.standardize_data_var(test_x)
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"

    print "Predicting results"
    t1 = time.time()
    if track == "track1":
        results = clf.predict_proba(std_test_x)[:, 1]
    else:
        results = clf.predict(std_test_x)
        results[results == -1] = 0
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"
    # Output results
    track_name = "track1" if track == "track1" else "track2"
    result_filename = "logistic_regression_c" + str(c) + "_" + track_name + ".csv"
    result_file = path_def.DEREK_ROOT + path_def.LIB_ROOT + path_def.LOGISTIC_REGRESSION_ROOT + path_def.RESULT_FOLDER + result_filename
    result_data = np.hstack((test_data_id.reshape((test_data_id.shape[0], 1)), results.reshape((results.shape[0], 1))))
    print "Writing results"
    t1 = time.time()
    out_data_type = float if track == "track1" else int
    io.write_output_data(result_file, result_data, out_data_type)
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"

    dropout_rate = ev.calc_dropout_rate(results)
    print "Test data dropout rate:", dropout_rate




