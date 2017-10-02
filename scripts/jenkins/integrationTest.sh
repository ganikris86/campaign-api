echo 'Export build id with a different value to allow mea xls api startup'
export BUILD_ID=dontKillMe
echo 'Starting the mea xls api application'
cd ${WORKSPACE%}/src/
npm run startMEAXLSAPIServer

echo 'Run integration test'
cd ${WORKSPACE%}/src/
npm run integrationTest
