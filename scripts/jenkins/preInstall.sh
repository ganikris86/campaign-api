echo stopping the oc api test application, if started

command="OC_API"
running=$(ps ax | grep -v grep | grep $command | wc -l)
if [ $running -gt 0 ]; then
    echo "OC API application is running, stopping the apps now."
    cd ${WORKSPACE%}/oc_api/
    npm run stopOCAPIServer

    cd ../..
    rm -rf $command
else
    echo "OC API application is not running, proceed with remaining steps"

    cd ../
    rm -rf $command
fi
