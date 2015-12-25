from ..Def import path_def
from ..Utils import data_io as io
from ..Utils import evaluate as ev
from sklearn import svm
import numpy as np
import time


def run_svm(c, kernel):
    # Training
    train_file = path_def.SAMPLE_TRAIN_X_CSV
    print "Reading training file:", train_file
    t1 = time.time()
    train_data_id, train_x, train_y = io.read_train_data(train_file)
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"

    print "Start training with SVM ( C =", c, ", Kernel =", kernel, ")"
    t1 = time.time()
    clf = svm.SVC(C=c, kernel=kernel)
    clf.fit(train_x, train_y.flatten())
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"

    # Testing
    test_file = path_def.SAMPLE_TEST_X_CSV
    print "Reading testing file:", test_file
    t1 = time.time()
    test_data_id, test_x = io.read_test_data(test_file)
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"

    print "Predicting results"
    t1 = time.time()
    results = clf.predict(test_x)
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"
    # Output results
    result_filename = "svm_c" + str(c) + "_" + kernel + ".csv"
    result_file = path_def.DEREK_ROOT + path_def.LIB_ROOT + path_def.SVM_ROOT + path_def.RESULT_FOLDER + result_filename
    result_data = np.hstack((test_data_id.reshape((test_data_id.shape[0], 1)), results.reshape((results.shape[0], 1))))
    print "Writing results"
    t1 = time.time()
    io.write_output_data(result_file, result_data, int)
    t2 = time.time()
    print "... cost", t2 - t1, "seconds"

    dropout_rate = ev.calc_dropout_rate(results)
    print "Test data dropout rate:", dropout_rate



