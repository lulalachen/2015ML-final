import numpy as np

INPUT_FILE = "../Data/ML_final_project/sampleSubmission.csv"
OUT_FILE = "../Result/Random/derek_random_0.8.csv"

data = np.genfromtxt(INPUT_FILE, delimiter=',')
DATA_SIZE = data.shape[0]


id = data[:, 0]
result = np.random.choice([0, 1], DATA_SIZE, p=[0.2, 0.8])

OUT_DATA = np.column_stack((id, result))


np.savetxt(OUT_FILE, OUT_DATA.astype(int), fmt='%i', delimiter=',')
