# XLS CAMPAIGN API - NodeJS project

This is a set of RESTful APIs built in Node.js to create and maintain the campaigns.

### Services offerred,
POST - Create a campaign<br>
GET - Get all campaigns<br>
GET - Get a campaign by id<br>
DELETE - Delete a campaign<br>
POST - Compute campaign statistics<br>
POST - Compute merchant statistics<br>


### Pre-requisite
1. Install Node version 8.1.3

2. Install Python V2.7
	Install Python version 2.7. To check if python is already present, use the cmd 'which python'

3. Install Oracle instant clients
	1.	Download the oracle instant clients instantclient-basic-linux.x64-12.1.0.2.0.zip and instantclient-sdk-linux.x64-12.1.0.2.0.zip
	2.	Execute : cd /data/oracle
	3.	Execute : unzip instantclient-basic-linux.x64-12.1.0.2.0.zip
	4.	Execute : unzip instantclient-sdk-linux.x64-12.1.0.2.0.zip
	5.	Execute : mv instantclient_12_1 instantclient
	6.	Execute : cd instantclient
	7.	Execute : ln -s libclntsh.so.12.1 libclntsh.so
	8.	Execute : ln -s libocci.so.12.1 libocci.so
	9.	Execute : export LD_LIBRARY_PATH=/data/oracle/instantclient
	10.	Execute : export OCI_LIB_DIR=/data/oracle/instantclient
	11.	Execute : export OCI_INC_DIR=/data/oracle/instantclient/sdk/include


### Steps to checkout the project and run,

1. To get the xls_campaign_api project to your machine, Git clone <git_project_repository> <br>
2. To download npm modules, run command "npm install" from the src directory of xls_campaign_api <br>
3. To start xls_campaign_api server, run command, "npm run startXLSCAMPAIGNAPIServer" <br>
4. To stop xls_campaign_api server, run command, "npm run stopXLSCAMPAIGNAPIServer" <br>
5. To run unit tests, run command, "npm run unitTest" <br>
6. To run integration tests using newman, follow the below steps, <br>
    a. Start xls_campaign_api server <br>
    c. Run the command "npm run integrationTest" in another command window. 
<br>



### In order to view the integration test report (generated by newman) in Jenkins through HTML publisher, do the following steps.

CSS is striped because of the Content Security Policy in Jenkins. (https://wiki.jenkins-ci.org/display/JENKINS/Configuring+Content+Security+Policy) <br>

The default rule is set to: sandbox; default-src 'none'; img-src 'self'; style-src 'self'; <br>
This rule set results in the following: <br>

No JavaScript allowed at all <br>
No plugins (object/embed) allowed <br>
No inline CSS, or CSS from other sites allowed <br>
No images from other sites allowed No frames allowed <br>
No web fonts allowed No XHR/AJAX allowed etc. <br>
To relax this rule, go to Manage Jenkins->Script console and type in the following command : <br>

System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "") <br>
and Press Run. If you see the output as 'Result:' below "Result" header then the protection disabled. Re-Run your build and you can see that the new HTML files archived will have the CSS enabled. <br>
