import numpy as np

from ..Def import path_def

TRUTH_TRAIN_FILE = path_def.DATA_PATH_ROOT + path_def.TRUTH_TRAIN_CSV


##################
# Simple data io
##################
def read_input_data(input_data_file, dtype=float, skip_header=True):
    input_data_path = path_def.DATA_PATH_ROOT + input_data_file
    input_data = np.genfromtxt(input_data_path, delimiter=',', dtype=dtype, skip_header=skip_header)
    data_id = input_data[:, 0]
    data = input_data[:, 1:]
    return data_id, data


def read_raw_input_data(input_data_file):
    input_data_path = path_def.DATA_PATH_ROOT + input_data_file
    input_data = np.genfromtxt(input_data_path, delimiter=',', dtype=str)
    data_id = input_data[:, 0]
    data = input_data[:, 1:]
    return data_id, data


def read_raw_data(raw_data_file):
    raw_data_path = path_def.DATA_PATH_ROOT + raw_data_file
    raw_data = np.genfromtxt(raw_data_path, delimiter=',', dtype=str)
    return raw_data


# Note that the first argument is the "output data path", not output data filename
# because the output data path depends on which algorithm you use (SVM, DNN,...)
# output data should be a numpy array
def write_output_data(output_data_path, output_data, dtype=float):
    if dtype == int:
        np.savetxt(output_data_path, output_data.astype(int), fmt='%i', delimiter=',')
    else:
        np.savetxt(output_data_path, output_data, fmt='%i,%f')


def write_raw_output_data(output_data_path, output_data):
    np.savetxt(output_data_path, output_data, fmt='%s', delimiter=',')


##########################################
# Specific data io (train / test / model)
##########################################
def read_train_data(train_data_file, dtype=float, skip_header=True):
    data_id, train_x = read_input_data(train_data_file, dtype, skip_header)
    data_id, train_y = read_input_data(path_def.TRUTH_TRAIN_CSV, skip_header=False)
    return data_id, train_x, train_y


def read_test_data(test_data_file, dtype=float, skip_header=True):
    return read_input_data(test_data_file, dtype, skip_header)


###########################################
# Feature extraction
###########################################
def extract_features(input_data_file, output_data_path, feature_indices):
    data_id, data = read_raw_input_data(input_data_file)
    extracted_data = data[:, feature_indices]
    result_data = np.hstack((data_id.reshape((data_id.shape[0], 1)), extracted_data))
    write_raw_output_data(output_data_path, result_data)
