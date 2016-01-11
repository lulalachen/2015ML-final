from ..Def import path_def
from ..Utils import data_io as io
from ..Utils import evaluate as ev
import numpy as np


################################################
# Generate enrollment <-> Course Start Time CSV
################################################
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


################################################
# Gen Log Frequency Feature
# Calculate N days in 30 days (frequency)
# for each enrollment
################################################
def gen_log_frequency_feature():
    # Reading data
    print "Reading", path_def.ENROLLMENT_COURSE_START_TIME_CSV
    enrollment_course_start_time_map = ev.timer(io.read_raw_data, path_def.ENROLLMENT_COURSE_START_TIME_CSV)
    print "Reading", path_def.LOG_TRAIN_CSV
    log_data_train = ev.timer(io.read_raw_data, path_def.LOG_TRAIN_CSV)
    print "Reading", path_def.LOG_TEST_CSV
    log_data_test = ev.timer(io.read_raw_data, path_def.LOG_TEST_CSV)

    print "Generating train frequency features"
    train_enrollments, train_times = ev.timer(gen_day_histogram_from_log, log_data_train[1:, ], enrollment_course_start_time_map[1:, ])
    print "Generating test frequency features"
    test_enrollments, test_times = ev.timer(gen_day_histogram_from_log, log_data_test[1:, ], enrollment_course_start_time_map[1:,])

    train_frequency = np.array(gen_frequency_from_histograms(train_times))
    test_frequency = np.array(gen_frequency_from_histograms(test_times))

    train_enrollments = np.hstack((log_data_train[0, 0], train_enrollments))
    test_enrollments = np.hstack((log_data_test[0, 0], test_enrollments))

    header_log_frequency = 'log_frequency'
    train_frequency = np.hstack((header_log_frequency, train_frequency))
    test_frequency = np.hstack((header_log_frequency, test_frequency))

    train_enrollment_frequency = np.hstack((train_enrollments.reshape((train_enrollments.shape[0], 1)), train_frequency.reshape((train_frequency.shape[0], 1))))
    test_enrollment_frequency = np.hstack((test_enrollments.reshape((test_enrollments.shape[0], 1)), test_frequency.reshape((test_frequency.shape[0], 1))))

    train_enrollment_frequency_file = path_def.DATA_PATH_ROOT + "enrollment_log_frequency_train.csv"
    test_enrollment_frequency_file = path_def.DATA_PATH_ROOT + "enrollment_log_frequency_test.csv"
    print "Writing data to", train_enrollment_frequency_file
    ev.timer(io.write_raw_output_data, train_enrollment_frequency_file, train_enrollment_frequency)
    print "Writing data to", test_enrollment_frequency_file
    ev.timer(io.write_raw_output_data, test_enrollment_frequency_file, test_enrollment_frequency)


def gen_log_histogram_feature():
    # Reading data
    print "Reading", path_def.ENROLLMENT_COURSE_START_TIME_CSV
    enrollment_course_start_time_map = ev.timer(io.read_raw_data, path_def.ENROLLMENT_COURSE_START_TIME_CSV)
    print "Reading", path_def.LOG_TRAIN_CSV
    log_data_train = ev.timer(io.read_raw_data, path_def.LOG_TRAIN_CSV)
    print "Reading", path_def.LOG_TEST_CSV
    log_data_test = ev.timer(io.read_raw_data, path_def.LOG_TEST_CSV)

    print "Generating train histogram features"
    train_histogram_with_enrollments = ev.timer(gen_day_histogram_with_enrollment_from_log, log_data_train[1:, ], enrollment_course_start_time_map[1:, ])
    print "Generating test histogram features"
    test_histogram_with_enrollments = ev.timer(gen_day_histogram_with_enrollment_from_log, log_data_test[1:, ], enrollment_course_start_time_map[1:,])

    headers = [log_data_train[0, 0]]
    headers += ['day_' + str(i) for i in range(1, 31)]
    headers = np.array(headers)

    train_enrollment_histogram = np.vstack((headers, train_histogram_with_enrollments))
    test_enrollment_histogram = np.vstack((headers, test_histogram_with_enrollments))

    train_enrollment_histogram_file = path_def.DATA_PATH_ROOT + "enrollment_log_histogram_train.csv"
    test_enrollment_histogram_file = path_def.DATA_PATH_ROOT + "enrollment_log_histogram_test.csv"
    print "Writing data to", train_enrollment_histogram_file
    ev.timer(io.write_raw_output_data, train_enrollment_histogram_file, train_enrollment_histogram)
    print "Writing data to", test_enrollment_histogram_file
    ev.timer(io.write_raw_output_data, test_enrollment_histogram_file, test_enrollment_histogram)


def gen_day_histogram_from_log(log_data, enrollment_course_start_time_map):
    enrollments = log_data[:, 0]
    unique_enrollments = np.unique(enrollments)

    days_counts = []
    for enrollment in unique_enrollments:
        enrollment_log_data = log_data[np.where(log_data[:, 0] == enrollment)]
        enrollment_log_times = np.array(enrollment_log_data[:, 1], dtype='datetime64[s]')
        course_start_time = enrollment_course_start_time_map[np.where(enrollment_course_start_time_map[:, 0] == enrollment), 1][0]
        course_start_times = np.repeat(np.array(course_start_time, dtype='datetime64[s]'), enrollment_log_times.shape[0])
        time_differences = enrollment_log_times - course_start_times
        online_days = np.array(time_differences / 86400, dtype=np.int)
        days_count = np.bincount(online_days, minlength=30)
        days_counts.append(days_count)
    return unique_enrollments, days_counts


def gen_day_histogram_with_enrollment_from_log(log_data, enrollment_course_start_time_map):
    enrollments = log_data[:, 0]
    unique_enrollments = np.unique(enrollments)

    days_counts = []
    for enrollment in unique_enrollments:
        enrollment_log_data = log_data[np.where(log_data[:, 0] == enrollment)]
        enrollment_log_times = np.array(enrollment_log_data[:, 1], dtype='datetime64[s]')
        course_start_time = enrollment_course_start_time_map[np.where(enrollment_course_start_time_map[:, 0] == enrollment), 1][0]
        course_start_times = np.repeat(np.array(course_start_time, dtype='datetime64[s]'), enrollment_log_times.shape[0])
        time_differences = enrollment_log_times - course_start_times
        online_days = np.array(time_differences / 86400, dtype=np.int)
        days_count = np.bincount(online_days, minlength=30)
        days_counts.append(days_count)
    histogram_with_enrollment = np.hstack((unique_enrollments.reshape((unique_enrollments.shape[0], 1)), np.array(days_counts)))
    return histogram_with_enrollment


def gen_frequency_from_histograms(day_histograms):
    day_frequencies = []
    for day_histogram in day_histograms:
        day_frequency = float(day_histogram[day_histogram > 0].shape[0]) / float(day_histogram.shape[0])
        day_frequencies.append(day_frequency)
    return day_frequencies


################################################
# Gen Log Unique Object Count Feature
# Calculate unique object count
# for each enrollment
################################################
def gen_log_unique_object_count():
    # Reading data
    print "Reading", path_def.LOG_TRAIN_CSV
    log_data_train = ev.timer(io.read_raw_data, path_def.LOG_TRAIN_CSV)
    print "Reading", path_def.LOG_TEST_CSV
    log_data_test = ev.timer(io.read_raw_data, path_def.LOG_TEST_CSV)

    print "Generating train unique object count features"
    train_unique_object_counts_with_enrollment = gen_unique_object_count_from_log(log_data_train[1:, ])
    print "Generating test unique object count features"
    test_unique_object_counts_with_enrollment = gen_unique_object_count_from_log(log_data_test[1:, ])

    headers = np.array([log_data_train[0, 0], 'unique_object_count'])

    train_enrollment_unique_object_counts = np.vstack((headers, train_unique_object_counts_with_enrollment))
    test_enrollment_unique_object_counts = np.vstack((headers, test_unique_object_counts_with_enrollment))

    train_enrollment_unique_object_count_file = path_def.DATA_PATH_ROOT + "enrollment_log_unique_object_count_train.csv"
    test_enrollment_unique_object_count_file = path_def.DATA_PATH_ROOT + "enrollment_log_unique_object_count_test.csv"
    print "Writing data to", train_enrollment_unique_object_count_file
    ev.timer(io.write_raw_output_data, train_enrollment_unique_object_count_file, train_enrollment_unique_object_counts)
    print "Writing data to", test_enrollment_unique_object_count_file
    ev.timer(io.write_raw_output_data, test_enrollment_unique_object_count_file, test_enrollment_unique_object_counts)


def gen_unique_object_count_from_log(log_data):
    enrollments = log_data[:, 0].astype(np.int)
    unique_enrollments = np.unique(enrollments)
    enrollment_counts = np.bincount(enrollments)
    enrollment_counts_accum = np.add.accumulate(enrollment_counts)
    enrollment_unique_object_counts = []
    for enrollment in unique_enrollments:
        enrollment_end_idx = enrollment_counts_accum[enrollment]
        enrollment_start_idx = enrollment_counts_accum[enrollment] - enrollment_counts[enrollment]
        enrollment_object_data = log_data[enrollment_start_idx: enrollment_end_idx, 4]
        unique_object_count = np.unique(enrollment_object_data).shape[0]
        enrollment_unique_object_counts.append(unique_object_count)
    enrollment_unique_object_counts = np.array(enrollment_unique_object_counts)
    unique_object_counts_with_enrollment = np.hstack((unique_enrollments.reshape((unique_enrollments.shape[0], 1)), enrollment_unique_object_counts.reshape((enrollment_unique_object_counts.shape[0], 1))))
    return unique_object_counts_with_enrollment


def gen_user_unique_object_count_features():
    # Reading data
    print "Reading", path_def.ENROLLMENT_TRAIN_CSV
    enrollment_data_train = ev.timer(io.read_raw_data, path_def.ENROLLMENT_TRAIN_CSV)
    print "Reading", path_def.ENROLLMENT_TEST_CSV
    enrollment_data_test = ev.timer(io.read_raw_data, path_def.ENROLLMENT_TEST_CSV)
    print "Reading", path_def.ENROLLMENT_UNIQ_OBJ_COUNT_TRAIN_CSV
    enrollment_uniq_obj_count_train = ev.timer(io.read_raw_data, path_def.ENROLLMENT_UNIQ_OBJ_COUNT_TRAIN_CSV)
    print "Reading", path_def.ENROLLMENT_UNIQ_OBJ_COUNT_TEST_CSV
    enrollment_uniq_obj_count_test = ev.timer(io.read_raw_data, path_def.ENROLLMENT_UNIQ_OBJ_COUNT_TEST_CSV)

    print "Generating train user unique object count features"
    train_unique_user_object_counts_with_enrollment = user_unique_object_count_from_log(enrollment_data_train[1:, ], enrollment_uniq_obj_count_train[1:, ])
    print "Generating test user unique object count features"
    test_unique_user_object_counts_with_enrollment = user_unique_object_count_from_log(enrollment_data_test[1:, ], enrollment_uniq_obj_count_test[1:, ])

    headers = np.array([enrollment_data_train[0, 0], 'unique_user_object_count'])

    train_enrollment_unique_user_object_counts = np.vstack((headers, train_unique_user_object_counts_with_enrollment))
    test_enrollment_unique_user_object_counts = np.vstack((headers, test_unique_user_object_counts_with_enrollment))

    train_enrollment_unique_user_object_count_file = path_def.DATA_PATH_ROOT + "enrollment_log_unique_user_object_count_train.csv"
    test_enrollment_unique_user_object_count_file = path_def.DATA_PATH_ROOT + "enrollment_log_unique_user_object_count_test.csv"
    print "Writing data to", train_enrollment_unique_user_object_count_file
    ev.timer(io.write_raw_output_data, train_enrollment_unique_user_object_count_file, train_enrollment_unique_user_object_counts)
    print "Writing data to", test_enrollment_unique_user_object_count_file
    ev.timer(io.write_raw_output_data, test_enrollment_unique_user_object_count_file, test_enrollment_unique_user_object_counts)


def user_unique_object_count_from_log(enrollment_data, enrollment_uniq_obj_count_data):
    all_user_data = enrollment_data[:, 1]
    all_enrollment_user_obj_data = np.hstack((enrollment_uniq_obj_count_data, all_user_data.reshape(all_user_data.shape[0], 1)))
    unique_user_data, user_counts = np.unique(all_user_data, return_counts=True)
    user_sorted_enrollment_data = all_enrollment_user_obj_data[all_enrollment_user_obj_data[:, -1].argsort()]
    user_counts_accum = np.add.accumulate(user_counts)
    for i in range(user_counts.shape[0]):
        sorted_enrollment_end_idx = user_counts_accum[i]
        sorted_enrollment_start_idx = sorted_enrollment_end_idx - user_counts[i]
        user_uniq_object_counts = user_sorted_enrollment_data[sorted_enrollment_start_idx: sorted_enrollment_end_idx, 1].astype(int)
        user_sorted_enrollment_data[sorted_enrollment_start_idx: sorted_enrollment_end_idx, 1] = np.sum(user_uniq_object_counts)
    user_sorted_enrollment_data = user_sorted_enrollment_data[user_sorted_enrollment_data[:, 0].astype(int).argsort()]
    return user_sorted_enrollment_data[:, 0: 2]

