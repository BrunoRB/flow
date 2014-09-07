

INSERT INTO shapedefinition (
    name, default_value, max_inputs, max_outputs, max_copies, has_user_text, conn_label_type
) VALUES
	('begin',           NULL, 0, 1, 1, FALSE, 'text'), --TERMINATOR BEGIN

	('end',             NULL, 1, 0, 1, FALSE, NULL), --TERMINATOR END

	('process',         NULL, 2, 1, -1, TRUE, 'text'), --PROCESS

    ('manual_input',    NULL, 2, 1, -1, TRUE, 'text'),

    ('decision',        NULL, 2, 2, -1, TRUE, 'boolean'), --DECISION

    ('connector',       NULL, 2, 1, -1, FALSE, 'text'), --CONNECTOR

    ('display',         NULL, 2, 1, -1, TRUE, 'text'); --DISPLAY