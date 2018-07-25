#-------------------------------------------------------------------------------
# Copyright 2017 Cognizant Technology Solutions
#   
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy
# of the License at
# 
#   http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.
#-------------------------------------------------------------------------------
# Turn on a case-insensitive matching (-s set nocasematch)
opt=$1
action=$2
echo "$opt"
case $opt in
        [lL][Ii][nN][uU][Xx])
                case $action in 
                	[uU][nN][iI][nN][sS][tT][aA][lL][lL])
                		sudo service  InSightsGitLabAgent stop
						sudo rm -R /etc/init.d/InSightsGitLabAgent
						echo "Service un-installation step completed"
		            ;;
		         	*)
		         		echo "Git Running on Linux..."
						sudo cp -xp InSightsGitLabAgent.sh  /etc/init.d/InSightsGitLabAgent
						sudo chmod +x /etc/init.d/InSightsGitLabAgent
						sudo chkconfig InSightsGitLabAgent on
						sudo service  InSightsGitLabAgent status
						sudo service  InSightsGitLabAgent stop
						sudo service  InSightsGitLabAgent status
						sudo service  InSightsGitLabAgent start
						sudo service  InSightsGitLabAgent status
						
						echo "Service installaton steps completed"
		        	;;   
				esac
		        ;;
        [uU][bB][uU][nN][tT][uU])
		     case $action in 
                [uU][nN][iI][nN][sS][tT][aA][lL][lL]) 
					sudo systemctl stop InSightsGitLabAgent
					sudo rm -R /etc/systemd/system/InSightsGitLabAgent.service
					echo "Service un-installation step completed"				
			        ;;
				*)
                   echo "Git Running on Ubuntu..."
					sudo cp -xp InSightsGitLabAgent.service /etc/systemd/system
					sudo systemctl enable InSightsGitLabAgent
					sudo systemctl start InSightsGitLabAgent
					echo "Service installaton steps completed"
        			;;
			 esac
			 ;;
        centos)
               echo "Git Running on centso..."
               ;;
        *)
        	    echo "Please provide correct OS input"
esac
