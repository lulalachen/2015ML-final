import numpy as np


def calc_dropout_rate(truth_data):
    return np.sum(truth_data) / truth_data.shape[0]
