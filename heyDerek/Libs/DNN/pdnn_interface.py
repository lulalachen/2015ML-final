import os

# Python command
PYTHON = "python"

# PDNN Library path
PDNN_PATH         = os.environ['PYTHONPATH']
RUN_DNN_PATH      = PDNN_PATH + "\\cmds\\run_DNN.py"
RUN_EXTRACT_FEATS = PDNN_PATH + "\\cmds\\run_Extract_Feats.py"

# run_DNN.py arguments
TRAIN_DATA        = "--train-data"
VALID_DATA        = "--valid-data"
NNET_SPEC         = "--nnet-spec"
WDIR              = "--wdir"
ACTIVATION        = "--activation"
L2REG             = "--l2-reg"
LRATE             = "--lrate"
MOMENTUM          = "--momentum"
MODEL_SAVE_STEP   = "--model-save-step"
PARAM_OUTPUT_FILE = "--param-output-file"
CFG_OUTPUT_FILE   = "--cfg-output-file"

# run_Extract_Feats.py arguments
DATA        = "--data"
NNET_PARAM  = "--nnet-param"
NNET_CFG    = "--nnet-cfg"
OUTPUT_FILE = "--output-file"
LAYER_INDEX = "--layer-index"
BATCH_SIZE  = "--batch-size"

# String util
DOUBLE_QUOTE = "\""


def dquote(str):
    return DOUBLE_QUOTE + str + DOUBLE_QUOTE


def run_dnn(train_data, valid_data, nnet_spec, wdir, activation, l2_reg, lrate, momentum, model_save_step, param_outfile, cfg_outfile, batch_size):
    arguments = " ".join((TRAIN_DATA, dquote(train_data),
                          VALID_DATA, dquote(valid_data),
                          NNET_SPEC, dquote(nnet_spec),
                          WDIR, wdir,
                          ACTIVATION, activation,
                          L2REG, str(l2_reg),
                          LRATE, dquote(lrate),
                          MOMENTUM, str(momentum),
                          MODEL_SAVE_STEP, str(model_save_step),
                          PARAM_OUTPUT_FILE, dquote(param_outfile),
                          CFG_OUTPUT_FILE, dquote(cfg_outfile),
                          BATCH_SIZE, str(batch_size)))

    run_dnn_command = " ".join((PYTHON, RUN_DNN_PATH, arguments))
    os.system(run_dnn_command)


def run_extract_feats(data, nnet_param, nnet_cfg, output_file, layer_index, batch_size):
    arguments = " ".join((DATA, dquote(data),
                          NNET_PARAM, dquote(nnet_param),
                          NNET_CFG, dquote(nnet_cfg),
                          OUTPUT_FILE, dquote(output_file),
                          LAYER_INDEX, str(layer_index),
                          BATCH_SIZE, str(batch_size)))

    run_extract_feats_command = " ".join((PYTHON, RUN_EXTRACT_FEATS, arguments))
    os.system(run_extract_feats_command)
