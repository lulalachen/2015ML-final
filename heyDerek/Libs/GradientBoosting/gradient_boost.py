from ..Def import path_def
from ..Utils import data_io as io
from ..Utils import evaluate as ev
from ..Utils import data_util as du
from sklearn import cross_validation
from sklearn import ensemble
import numpy as np


class GradientBoost:
    def __init__(self, tree_num, depth, fold_num):
        # Result / Model path
        self._result_path = path_def.DEREK_ROOT + path_def.LIB_ROOT + path_def.GRADIENT_BOOST_ROOT + path_def.RESULT_FOLDER
        self._model_path = path_def.DEREK_ROOT + path_def.LIB_ROOT + path_def.GRADIENT_BOOST_ROOT + path_def.MODEL_FOLDER

        # Model Parameters
        self._tree_num = tree_num
        self._depth = depth
        self._fold_num = fold_num

    def run(self, track="track1", do_cv=False):
        # Read input data
        input_data_id, input_x, input_y = self.read_input_data(path_def.SAMPLE_TRAIN_X_CSV, io.read_train_data)
        # Preprocess input data
        input_x = self.preprocess_input_data(input_x)
        input_y = self.preprocess_reference_data(input_y)

        # Shuffle and split train / validation data
        # input_data = np.hstack((input_x, input_y))
        # input_data = du.shuffle_data(input_data) # shuffle input data

        # Cross validation
        # min_error_cv = np.inf
        # for c in self._c_list:
        #     print "Cross validation with Logistic Regression ( C =", c, ")"
        #     error_cv = self.cross_validation(c, input_data)
        #     if error_cv < min_error_cv:
        #         min_error_cv = error_cv
        #         self._best_c = c
        # print "Min cross validation error =", min_error_cv

        # Train with best c
        # print "Training with tree num =", self._tree_num
        # self._best_clf = None
        # best_min_sample_leaves = None
        # best_oob_score = 0
        # for l in self._min_sample_leaves_list:
        #     print "training min sample leave num =", l
        #     clf = ev.timer(self.train, self._tree_num, l, input_x, input_y)
        #     print "oob score:", clf.oob_score_
        #     if clf.oob_score_ > best_oob_score:
        #         best_oob_score = clf.oob_score_
        #         best_min_sample_leaves = l
        #         self._best_clf = clf
        # print "best min sample leaves =", best_min_sample_leaves
        if do_cv == True:
            ev.timer(self.cross_validation, input_x, input_y, self._depth)

        else:
            print "Training with tree num =", self._tree_num, ", depth =", self._depth
            self._best_clf = ev.timer(self.train, self._tree_num, self._depth, input_x, input_y)

        good_feature_indices = self.extract_good_features(self._best_clf, 100)
        print good_feature_indices

        # Read test data
        test_data_id, test_x = self.read_input_data(path_def.SAMPLE_TEST_X_CSV, io.read_test_data)
        test_x = self.preprocess_input_data(test_x)

        # Test
        print "Predicting results"
        results1 = ev.timer(self.test, self._best_clf, test_x, "track1")
        results2 = ev.timer(self.test, self._best_clf, test_x, "track2")

        # Output results
        feature_num = input_x.shape[1]
        self.save_output_data(feature_num, test_data_id, results1, "track1")
        self.save_output_data(feature_num, test_data_id, results2, "track2")

        # Evaluate output dropout rate
        dropout_rate1 = ev.calc_dropout_rate(results1)
        dropout_rate2 = ev.calc_dropout_rate(results2)
        print "Test data track1 dropout rate:", dropout_rate1
        print "Test data track2 dropout rate:", dropout_rate2

    # Data Input / Output
    def read_input_data(self, filename, read_method, *read_args):
        print "Reading file:", filename
        return ev.timer(read_method, filename, *read_args)

    def save_output_data(self, feature_num, data_id, results, track="track1"):
        track_name = "track1" if track == "track1" else "track2"
        result_filename = str(feature_num) + "_features_gradient_boosting_tree_num_" + str(self._tree_num) + "_depth_" + str(self._depth) + "_" + track_name + ".csv"
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

    # Data extraction
    def extract_good_features(self, clf, extract_num):
        important_features = np.array(clf.feature_importances_)
        print important_features
        important_features_order_indices = important_features.argsort()
        return important_features_order_indices[::-1][0:extract_num]

    # # Train / Validata / Test
    # def cross_validation(self, c, input_data):
    #     # Cross validation
    #     error_val_list = []
    #     for fold_idx in range(self._fold_num):
    #         print "fold:", fold_idx + 1
    #         train_data, val_data = du.get_folded_data(input_data, self._fold_num, fold_idx)
    #         # Training
    #         train_x = train_data[:, 0:-1]
    #         train_y = train_data[:, -1]
    #         print "training..."
    #         trained_clf = ev.timer(self.train, c, train_x, train_y)
    #         # Validating
    #         val_x = val_data[:, 0: -1]
    #         val_y = val_data[:, -1]
    #         print "validating..."
    #         error_val = ev.timer(self.validate, trained_clf, val_x, val_y)
    #         error_val_list.append(error_val)
    #     average_error_val = np.average(error_val_list)
    #     print "average validation error =", average_error_val
    #     return average_error_val

    # Validation
    def cross_validation(self, input_x, input_y, depth):
        print "Start Validation with depth =", depth, ", fold_num =", self._fold_num
        all_scores = []
        all_stds = []

        for dep in depth:
            clf = ensemble.GradientBoostingClassifier(n_estimators=100 , max_depth=dep, max_features="auto")
            scores = cross_validation.cross_val_score(clf, input_x, input_y.flatten(), cv=self._fold_num, scoring='f1_weighted')
            all_scores.append(scores.mean())
            all_stds.append(scores.std() * 2)
            print "Done cv for depth =", dep

        best_score_index = np.argmax(all_scores)
        best_score = all_scores[best_score_index]

        print "Cross Validation =", best_score, ", with best min_sample_leaves =", self._depth[best_score_index]
        print "All Scores", all_scores, ", with stds 95 confidence =", all_stds

        print "Training with tree num =", self._tree_num, ", min sample leaves num =", self._depth[best_score_index]
        self._best_clf = ev.timer(self.train, self._tree_num, self._depth[best_score_index], input_x, input_y)

        good_feature_indices = self.extract_good_features(self._best_clf, 100)
        print good_feature_indices

    def train(self, tree_num, depth, train_x, train_y):
        clf = ensemble.GradientBoostingClassifier(n_estimators=tree_num , max_depth=depth, max_features="auto")
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





