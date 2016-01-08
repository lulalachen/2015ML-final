from ..Def import path_def
from ..Utils import data_io as io
import numpy as np


def filter_unuseful_features():
    train_data_id, train_x, train_y = io.read_train_data(path_def.SAMPLE_TRAIN_X_CSV)
    train_data_var = np.var(train_x, axis=0)
    unuseful_indices = np.where(train_data_var == 0)

    raw_train_data_id, raw_train_data = io.read_raw_input_data(path_def.SAMPLE_TRAIN_X_CSV)
    raw_test_data_id, raw_test_data = io.read_raw_input_data(path_def.SAMPLE_TEST_X_CSV)

    extracted_feature_dim = raw_train_data.shape[1] if raw_train_data.shape[1] < raw_test_data.shape[1] else raw_test_data.shape[1]

    extract_mask = np.ones(train_x.shape[1], dtype=np.bool)
    extract_mask[unuseful_indices] = 0
    extract_mask = extract_mask[0: extracted_feature_dim]

    extracted_train_data = raw_train_data[:, 0: extracted_feature_dim][:, extract_mask]
    extracted_test_data = raw_test_data[:, 0: extracted_feature_dim][:, extract_mask]

    extracted_train_filename = path_def.DATA_PATH_ROOT + "filtered_" + path_def.SAMPLE_TRAIN_X_CSV
    extracted_test_filename = path_def.DATA_PATH_ROOT + "filtered_" + path_def.SAMPLE_TEST_X_CSV
    result_train_data = np.hstack((raw_train_data_id.reshape((raw_train_data_id.shape[0], 1)), extracted_train_data))
    result_test_data = np.hstack((raw_test_data_id.reshape((raw_test_data_id.shape[0], 1)), extracted_test_data))
    io.write_raw_output_data(extracted_train_filename, result_train_data)
    io.write_raw_output_data(extracted_test_filename, result_test_data)


def extract_features(feature_indices):
    feature_num = len(feature_indices)
    extracted_train_filename = path_def.DATA_PATH_ROOT + str(feature_num) + "_features_" + path_def.SAMPLE_TRAIN_X_CSV
    extracted_test_filename = path_def.DATA_PATH_ROOT + str(feature_num) + "_features_" + path_def.SAMPLE_TEST_X_CSV
    io.extract_features(path_def.SAMPLE_TRAIN_X_CSV, extracted_train_filename, feature_indices)
    io.extract_features(path_def.SAMPLE_TEST_X_CSV, extracted_test_filename, feature_indices)