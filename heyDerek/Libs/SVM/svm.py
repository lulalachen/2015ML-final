from ..Def import path_def
from ..Utils import data_io as io
from sklearn import svm
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
    print test_data_id.shape
    print test_x.shape
    print results.shape



