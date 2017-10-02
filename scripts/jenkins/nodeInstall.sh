echo ${WORKSPACE%}
cd ${WORKSPACE%}/src/
npm install
echo ${PROJECT_NAME} - Build # ${BUILD_NUMBER}
