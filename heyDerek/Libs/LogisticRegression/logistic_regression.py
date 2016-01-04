from ..Def import path_def
from ..Utils import data_io as io
from ..Utils import evaluate as ev
from ..Utils import data_util as du
from sklearn import linear_model
import numpy as np


class LogisticRegression:
    def __init__(self, c_list, fold_num):
        # Result / Model path
        self._result_path = path_def.DEREK_ROOT + path_def.LIB_ROOT + path_def.LOGISTIC_REGRESSION_ROOT + path_def.RESULT_FOLDER
        self._model_path = path_def.DEREK_ROOT + path_def.LIB_ROOT + path_def.LOGISTIC_REGRESSION_ROOT + path_def.MODEL_FOLDER

        # Model Parameters
        self._c_list = c_list
        self._best_c = None
        self._best_clf = None

        # Validation Parameters
        self._fold_num = fold_num

    def run(self, track="track1"):
        # Read input data
        input_data_id, input_x, input_y = self.read_input_data(path_def.SAMPLE_TRAIN_X_CSV, io.read_train_data)
        # Preprocess input data
        input_x = self.preprocess_input_data(input_x)
        input_y = self.preprocess_reference_data(input_y)

        # Shuffle and split train / validation data
        input_data = np.hstack((input_x, input_y))
        input_data = du.shuffle_data(input_data) # shuffle input data

        # Cross validation
        min_error_cv = np.inf
        for c in self._c_list:
            print "Cross validation with Logistic Regression ( C =", c, ")"
            error_cv = self.cross_validation(c, input_data)
            if error_cv < min_error_cv:
                min_error_cv = error_cv
                self._best_c = c
        print "Min cross validation error =", min_error_cv

        # Train with best c
        print "Training with best C =", self._best_c
        self._best_clf = ev.timer(self.train, self._best_c, input_x, input_y)

        # Read test data
        test_data_id, test_x = self.read_input_data(path_def.SAMPLE_TEST_X_CSV, io.read_test_data)
        test_x = self.preprocess_input_data(test_x)

        # Test
        print "Predicting results"
        results = ev.timer(self.test, self._best_clf, test_x, track)

        # Output results
        self.save_output_data(test_data_id, results, track)

        # Evaluate output dropout rate
        dropout_rate = ev.calc_dropout_rate(results)
        print "Test data dropout rate:", dropout_rate

    # Data Input / Output
    def read_input_data(self, filename, read_method, *read_args):
        print "Reading file:", filename
        return ev.timer(read_method, filename, *read_args)

    def save_output_data(self, data_id, results, track="track1"):
        track_name = "track1" if track == "track1" else "track2"
        result_filename = "logistic_regression_c" + str(self._best_c) + "_" + track_name + ".csv"
        result_file = self._result_path + result_filename
        result_data = np.hstack((data_id.reshape((data_id.shape[0], 1)), results.reshape((results.shape[0], 1))))
        print "Writing results"
        out_data_type = float if track == "track1" else int
        ev.timer(io.write_output_data, result_file, result_data, out_data_type)

    def save_model(self):
        pass

    # Data preprocessing
    def preprocess_input_data(self, input_data):
        return du.standardize_data_var(input_data)

    def preprocess_reference_data(self, ref_data):
        processed_ref_data = np.array(ref_data)
        processed_ref_data[processed_ref_data == 0] = -1.0
        return processed_ref_data

    # Train / Validata / Test
    def cross_validation(self, c, input_data):
        # Cross validation
        error_val_list = []
        for fold_idx in range(self._fold_num):
            print "fold:", fold_idx + 1
            train_data, val_data = du.get_folded_data(input_data, self._fold_num, fold_idx)
            # Training
            train_x = train_data[:, 0:-1]
            train_y = train_data[:, -1]
            print "training..."
            trained_clf = ev.timer(self.train, c, train_x, train_y)
            # Validating
            val_x = val_data[:, 0: -1]
            val_y = val_data[:, -1]
            print "validating..."
            error_val = ev.timer(self.validate, trained_clf, val_x, val_y)
            error_val_list.append(error_val)
        average_error_val = np.average(error_val_list)
        print "average validation error =", average_error_val
        return average_error_val

    def train(self, c, train_x, train_y):
        clf = linear_model.LogisticRegression(C=c)
        clf.fit(train_x, train_y.flatten())
        return clf

    def validate(self, clf, val_x, val_y):
        predicted_y = clf.predict(val_x)
        return ev.error01(val_y, predicted_y)

    def test(self, clf, test_x, track="track1"):
        if track == "track1":
            results = clf.predict_proba(test_x)[:, 1]
        else:
            results = clf.predict(test_x)
            results[results == -1] = 0
        return results





