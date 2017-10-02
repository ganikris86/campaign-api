whenever sqlerror exit 1;

DECLARE
  FUNCTION fnc_reset_sequence(p_seq_name IN VARCHAR2) RETURN NUMERIC IS
    l_val NUMBER;
  BEGIN
    EXECUTE IMMEDIATE 'select ' || p_seq_name || '.nextval from dual'
      INTO l_val;
    EXECUTE IMMEDIATE 'alter sequence ' || p_seq_name || ' increment by -' ||
                      l_val || ' minvalue 0';
    EXECUTE IMMEDIATE 'select ' || p_seq_name || '.nextval from dual'
      INTO l_val;
    EXECUTE IMMEDIATE 'alter sequence ' || p_seq_name ||
                      ' increment by 1 minvalue 0';
    RETURN 0;
  END fnc_reset_sequence;
BEGIN
  DECLARE
    err_code NUMBER := 0;
  BEGIN
    dbms_output.put_line('Sequence reset for SEQ_SCENARIO');
    err_code := fnc_reset_sequence('SEQ_SCENARIO');
  
    IF err_code = 0 THEN
      dbms_output.put_line('Sequence reset for SEQ_CAMPAIGN');
      err_code := fnc_reset_sequence('SEQ_CAMPAIGN');
    END IF;
	
	 IF err_code = 0 THEN
      dbms_output.put_line('Sequence reset for SEQ_LOOP_CPG_ID');
      err_code := fnc_reset_sequence('SEQ_LOOP_CPG_ID');
    END IF;
    
  END;
END;
/

quit;
/