echo 'Run unit test with coverage'
cd ${WORKSPACE%}/src/
npm run jutest
npm run coverage
npm run coverageRpt
