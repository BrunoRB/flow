
CREATE OR REPLACE FUNCTION validateShapeData() RETURNS TRIGGER AS $$
    DECLARE
        newValue CHARACTER VARYING(30) := NEW.value;
        shapeName CHARACTER VARYING(30) := NEW.fk_shape_definition;
        hasUserText BOOLEAN;
    BEGIN
        
        SELECT has_user_text INTO hasUserText FROM shapedefinition WHERE name = shapeName;
        
        IF (hasUserText = FALSE AND newValue IS NOT NULL AND newValue != '') THEN
            RAISE NOTICE '(VALUE)';
            RETURN NULL;
        END IF;

        RETURN NEW;

    END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS validateShapeData ON shape;
CREATE TRIGGER validateShapeData BEFORE INSERT OR UPDATE ON shape FOR EACH ROW
    EXECUTE PROCEDURE validateShapeData();




CREATE OR REPLACE FUNCTION validateConnections() RETURNS TRIGGER AS $$
    DECLARE
        idSource BIGINT := NEW.fk_source_shape;
        idTarget BIGINT := NEW.fk_target_shape;

        sourceShapeName CHARACTER VARYING(30);
        targetShapeName CHARACTER VARYING(30);

        sourceMaxOutputs SMALLINT;
        targetMaxInputs SMALLINT;

        sourceOutputsCount SMALLINT;
        targetInputsCount SMALLINT;

        reverseConnectionCount SMALLINT;
    BEGIN
        -- validate if source can give more connection
        SELECT COUNT(id) INTO sourceOutputsCount FROM shapeconnection WHERE fk_source_shape = idSource;

        SELECT fk_shape_definition INTO sourceShapeName FROM shapeconnection INNER JOIN shape
            ON shape.id = idSource;

        SELECT max_outputs INTO sourceMaxOutputs FROM shapedefinition WHERE sourceShapeName = shapedefinition.name;

        IF (sourceOutputsCount >= sourceMaxOutputs) THEN
            RAISE NOTICE '(sourceOutputsCount >= sourceMaxOutputs)';
            RETURN NULL;
        END IF;

        -- VALIDATE if target can receive more connections
        SELECT COUNT(id) INTO targetInputsCount FROM shapeconnection WHERE fk_target_shape = idTarget;

        SELECT fk_shape_definition INTO sourceShapeName FROM shapeconnection INNER JOIN shape
            ON shape.id = idTarget;

        SELECT max_inputs INTO targetMaxInputs FROM shapedefinition WHERE targetShapeName = shapedefinition.name;

        IF (targetInputsCount >= targetMaxInputs) THEN
            RAISE NOTICE '(targetInputsCount >= targetMaxInputs)';
            RETURN NULL;
        END IF;

        --Validate reverse connection (A-B B-A)
        SELECT COUNT(id) INTO reverseConnectionCount FROM shapeconnection 
            WHERE fk_source_shape = idTarget AND fk_target_shape = idSource;
        IF (reverseConnectionCount > 0) THEN
            RAISE NOTICE 'Reverse connection not allowed';
            RETURN NULL;
        END IF;

        --validate own connection (A-A)
        IF (idSource = idTarget) THEN
            RAISE NOTICE 'A shape cannot be connected to itself';
            RETURN NULL;
        END IF;

        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS validateConnections ON shapeconnection;
CREATE TRIGGER validateConnections BEFORE INSERT ON shapeconnection FOR EACH ROW
    EXECUTE PROCEDURE validateConnections();
