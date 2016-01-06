/* Replace with your SQL commands */
CREATE TABLE object(
    course_id       text,
    module_id       text,
    category        text,
    children        text,
    start           text
);

CREATE TABLE enrollment (
    enrollment_id   int,
    username        text,
    course_id       text,
    result          boolean
);

CREATE TABLE log (
    enrollment_id   int,
    time            text,
    source          text,
    event           text,
    object          text
);


