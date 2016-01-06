DATATYPE=train node combine_enrollment_truth.js # Combine enrollment_with_truth
DATATYPE=test node combine_enrollment_truth.js # Combine enrollment_with_truth
DATATYPE=train node combine_enrollment\(y\)_with_course_stats.js
DATATYPE=test node combine_enrollment\(y\)_with_course_stats.js
node combine_sample_train_x_with_y.js # Combine sample_train_with_truth
# node stats.js # Get stats of sample_train