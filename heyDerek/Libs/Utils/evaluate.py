import numpy as np
import time


def timer(func, *args):
    t1 = time.time()
    results = func(*args)
    t2 = time.time()
    print "...costs", t2 - t1, "seconds"
    return results


def error01(ref, predict):
    return np.average(np.abs(ref - predict) / 2.0)


def calc_dropout_rate(truth_data):
    return np.sum(truth_data) / truth_data.shape[0]
