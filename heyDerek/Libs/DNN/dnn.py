from ..Def import path_def
from ..Utils import data_io as io
from ..Utils import evaluate as ev
from ..Utils import data_util as du
import numpy as np
import pdnn_interface
import cPickle
import gzip


class DNN:
    def __init__(self, nnet_spec, lrate, l2_reg, momentum, activation):
        # Model Parameters
        self._nnet_spec = nnet_spec
        self._lrate = lrate
        self._l2_reg = l2_reg
        self._momentum = momentum
        self._activation = activation
        self._train_batch_size = 256
        self._test_batch_size = 256

        # DNN root path
        self._dnn_root_path = path_def.DEREK_ROOT + path_def.LIB_ROOT + path_def.DNN_ROOT

        # Data Preparation / Result / Model path
        self._data_path = self._dnn_root_path + path_def.DATA_PATH_ROOT
        self._result_path = self._dnn_root_path + path_def.RESULT_FOLDER
        self._model_path = self._dnn_root_path + path_def.MODEL_FOLDER

        # Working directory
        self._working_path = self._dnn_root_path + path_def.TMP_FOLDER

        # Prepared data file name
        self._train_file = "train.pickle.gz"
        self._val_file = "valid.pickle.gz"
        self._test_file = "test.pickle.gz"

        # Model file name
        self._dnn_param_file = self.get_model_name() + "_model.param"
        self._dnn_cfg_file = self.get_model_name() + "_model.cfg"

        # Classify result file name
        self._dnn_classify_file = "dnn.classify.pickle.gz"

        # Validation Parameters
        self._val_proportion = 0.1

    def run(self, track="track1"):
        # Prepare data
        self.prep_data()

        # Training
        self.train()

        # Testing
        self.test()

        # Output results
        self.save_output_data(track)

    def get_model_name(self):
        return "dnn_spec_" + self._nnet_spec.replace(':', '-') + "_lr_" + self._lrate.replace(':', '-') + "_l2reg_" + str(self._l2_reg) + "_m_" + str(self._momentum) + "_a_" + self._activation

    # Data Preparation: prepare train, validation and test data
    def prep_data(self):
        # Read input data
        input_data_id, input_x, input_y = self.read_input_data(path_def.SAMPLE_TRAIN_X_CSV, io.read_train_data)
        # Preprocess input data
        input_x = self.preprocess_input_data(input_x)

        # Shuffle and split train / validation data
        input_data = np.hstack((input_x, input_y))
        input_data = du.shuffle_data(input_data)  # shuffle input data

        input_data_num = input_data.shape[0]
        val_data_num = int(input_data_num * self._val_proportion)

        val_data = input_data[0: val_data_num]
        train_data = input_data[val_data_num:]

        val_feature = np.array(val_data[:, 0: -1], dtype=np.float32)
        val_label = np.array(val_data[:, -1].flatten(), dtype=np.int64)

        train_feature = np.array(train_data[:, 0: -1], dtype=np.float32)
        train_label = np.array(train_data[:, -1].flatten(), dtype=np.int64)

        # Read test data
        test_data_id, test_x = self.read_input_data(path_def.SAMPLE_TEST_X_CSV, io.read_test_data)
        test_x = self.preprocess_input_data(test_x)

        test_feature = np.array(test_x, dtype=np.float32)
        test_label = np.array(test_data_id, dtype=np.int64)  # use id as temp label for test data

        # Write prepared data
        train_data_file = self._data_path + self._train_file
        val_data_file = self._data_path + self._val_file
        test_data_file = self._data_path + self._test_file

        with gzip.open(train_data_file, 'wb') as f:
            cPickle.dump((train_feature, train_label), f)

        with gzip.open(val_data_file, 'wb') as f:
            cPickle.dump((val_feature, val_label), f)

        with gzip.open(test_data_file, 'wb') as f:
            cPickle.dump((test_feature, test_label), f)

    # Data Input / Output
    def read_input_data(self, filename, read_method, *read_args):
        print "Reading file:", filename
        return ev.timer(read_method, filename, *read_args)

    def save_output_data(self, track="track1"):
        track_name = "track1" if track == "track1" else "track2"
        test_data_file = self._data_path + self._test_file
        output_data_file = self._data_path + self._dnn_classify_file

        with gzip.open(test_data_file, 'rb') as f:
            test_feature, test_label = cPickle.load(f)

        with gzip.open(output_data_file, 'rb') as f:
            class_results = cPickle.load(f)

        if track == "track1":
            results = class_results[:, 1]
        else:
            soft_results = class_results[:, 1]
            results = np.array(soft_results >= 0.5, dtype=np.int)

        result_filename = self.get_model_name() + "_" + track_name + ".csv"
        result_file = self._result_path + result_filename
        result_data = np.hstack((test_label.reshape((test_label.shape[0], 1)), results.reshape((results.shape[0], 1))))
        print "Writing results"
        out_data_type = float if track == "track1" else int
        ev.timer(io.write_output_data, result_file, result_data, out_data_type)

    # Data preprocessing
    def preprocess_input_data(self, input_data):
        return du.normalize_data_minmax(input_data, axis=0)

    def train(self):
        train_data_file = self._data_path + self._train_file
        val_data_file = self._data_path + self._val_file
        dnn_param_file = self._model_path + self._dnn_param_file
        dnn_cfg_file = self._model_path + self._dnn_cfg_file

        pdnn_interface.run_dnn(train_data_file,
                               val_data_file,
                               self._nnet_spec,
                               self._working_path,
                               self._activation,
                               self._l2_reg,
                               self._lrate,
                               self._momentum,
                               20,
                               dnn_param_file,
                               dnn_cfg_file,
                               self._train_batch_size)

    def test(self):
        test_data_file = self._data_path + self._test_file
        output_data_file = self._data_path + self._dnn_classify_file
        dnn_param_file = self._model_path + self._dnn_param_file
        dnn_cfg_file = self._model_path + self._dnn_cfg_file

        pdnn_interface.run_extract_feats(test_data_file,
                                         dnn_param_file,
                                         dnn_cfg_file,
                                         output_data_file,
                                         -1,
                                         self._test_batch_size)





