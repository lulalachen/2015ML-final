from ..Def import path_def
from ..Utils import data_io as io
from ..Utils import evaluate as ev
import numpy as np


def gen_enrollment_course_start_map():
    print "Reading", path_def.OBJECT_CSV
    object_data = ev.timer(io.read_raw_data, path_def.OBJECT_CSV)
    print "Reading", path_def.ENROLLMENT_TRAIN_CSV
    enrollment_train_data = ev.timer(io.read_raw_data, path_def.ENROLLMENT_TRAIN_CSV)
    print "Reading", path_def.ENROLLMENT_TEST_CSV
    enrollment_test_data = ev.timer(io.read_raw_data, path_def.ENROLLMENT_TEST_CSV)

    print "Extracting train course times"
    train_course_times = get_course_start_time(object_data, enrollment_train_data)
    print "Extracting test course times"
    test_course_times = get_course_start_time(object_data, enrollment_test_data)

    train_enrollment_course_times = np.hstack((enrollment_train_data[:, 0].reshape((enrollment_train_data.shape[0], 1)), train_course_times.reshape((train_course_times.shape[0], 1))))
    test_enrollment_course_times = np.hstack((enrollment_test_data[:, 0].reshape((enrollment_test_data.shape[0], 1)), test_course_times.reshape((test_course_times.shape[0], 1))))

    print "Combining all data"
    all_enrollment_course_times = np.vstack((train_enrollment_course_times, test_enrollment_course_times[1:, :]))

    output_file = path_def.DATA_PATH_ROOT + "enrollment_course_start_time.csv"
    print "Writing data to", output_file
    ev.timer(io.write_raw_output_data, output_file, all_enrollment_course_times)


def get_course_start_time(object_data, enrollment_data):
    course_times = ['course_start_time']
    for i in range(1, enrollment_data.shape[0]):
        course_objects = object_data[np.where(object_data == enrollment_data[i, 2])[0]]
        course_object_row = course_objects[np.where(course_objects == 'course')[0]][0]
        if course_object_row[2] == 'course':
            course_times.append(course_object_row[4])
    return np.array(course_times)
