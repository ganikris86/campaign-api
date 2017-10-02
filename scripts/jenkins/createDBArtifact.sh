echo 'Create a DB artifact (zip file)'
cd ${WORKSPACE%}/scripts/database
tar -cf ocapi_db_1.0.${BUILD_NUMBER}.zip .
