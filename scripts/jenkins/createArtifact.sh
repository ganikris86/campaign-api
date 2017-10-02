echo 'Create an artifact (zip file)'
cd ${WORKSPACE%}/src/
tar -cf mea_xls_api_app_1.0.${BUILD_NUMBER}.zip .
