import numpy as np
from sklearn import preprocessing


def normalize_data(data):
    return preprocessing.normalize(data, norm='l1', axis=0)


def standardize_data_var(data):
    data_mean = np.mean(data, axis=0)
    data_var = np.var(data, axis=0)
    return (data - data_mean) / data_var


def standardize_data_std(data):
    return preprocessing.scale(data)


def random_sample(data, sample_num):
    data_num = data.shape[0]
    sample_indices = np.random.choice(np.arange(data_num), sample_num)
    return data[sample_indices]
