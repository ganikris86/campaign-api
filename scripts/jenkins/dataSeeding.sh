echo Execute database related scripts
cd ${WORKSPACE%}/scripts/database
chmod +x *.sh

echo Delete bucket
export PATH=$PATH:/opt/couchbase/bin
./delete_bucket.sh

sleep 5s

echo Create bucket
./create_bucket.sh

echo Re-create indexes and counters
cd /opt/couchbase/bin/
echo "$(<${WORKSPACE%}/scripts/database/001_indexes.sql)" | ./cbq
echo "$(<${WORKSPACE%}/scripts/database/002_counters.sql)" | ./cbq

echo Remove all data in offer_catalogue db and re-insert data seed
echo "$(<${WORKSPACE%}/scripts/jenkins/testDataSeed.sql)" | ./cbq
