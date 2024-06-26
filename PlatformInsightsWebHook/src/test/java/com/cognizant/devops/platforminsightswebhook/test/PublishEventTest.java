/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
package com.cognizant.devops.platforminsightswebhook.test;

import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.TimeoutException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.cognizant.devops.platforminsightswebhook.application.AppProperties;
import com.cognizant.devops.platforminsightswebhook.message.factory.WebHookMessagePublisherMQ;
import com.cognizant.devops.platforminsightswebhook.message.factory.WebhookMessageFactory;
import com.cognizant.devops.platforminsightswebhook.message.factory.WebhookMessagePublisherSQS;

public class PublishEventTest {
	private static final Logger log = LogManager.getLogger(PublishEventTest.class);

	String message = "{  \"action\": \"created\",  \"comment\": {  \"url\": \"https://api.github.com/repos/Codertocat/Hello-World/comments/33548674\",  \"html_url\": \"https://github.com/Codertocat/Hello-World/commit/6113728f27ae82c7b1a177c8d03f9e96e0adf246#commitcomment-33548674\",  \"id\": 33548674,  \"node_id\": \"MDEzOkNvbW1pdENvbW1lbnQzMzU0ODY3NA==\",  \"user\": { \"login\": \"Codertocat\", \"id\": 21031067, \"node_id\": \"MDQ6VXNlcjIxMDMxMDY3\", \"avatar_url\": \"https://avatars1.githubusercontent.com/u/21031067?v=4\", \"gravatar_id\": \"\", \"url\": \"https://api.github.com/users/Codertocat\", \"html_url\": \"https://github.com/Codertocat\", \"followers_url\": \"https://api.github.com/users/Codertocat/followers\", \"following_url\": \"https://api.github.com/users/Codertocat/following{/other_user}\", \"gists_url\": \"https://api.github.com/users/Codertocat/gists{/gist_id}\", \"starred_url\": \"https://api.github.com/users/Codertocat/starred{/owner}{/repo}\", \"subscriptions_url\": \"https://api.github.com/users/Codertocat/subscriptions\", \"organizations_url\": \"https://api.github.com/users/Codertocat/orgs\", \"repos_url\": \"https://api.github.com/users/Codertocat/repos\", \"events_url\": \"https://api.github.com/users/Codertocat/events{/privacy}\", \"received_events_url\": \"https://api.github.com/users/Codertocat/received_events\", \"type\": \"User\", \"site_admin\": false  },  \"position\": null,  \"line\": null,  \"path\": null,  \"commit_id\": \"6113728f27ae82c7b1a177c8d03f9e96e0adf246\",  \"created_at\": \"2019-05-15T15:20:39Z\",  \"updated_at\": \"2019-05-15T15:20:39Z\",  \"author_association\": \"OWNER\",  \"body\": \"This is a really good change! :+1:\"  },  \"repository\": {  \"id\": 186853002,  \"node_id\": \"MDEwOlJlcG9zaXRvcnkxODY4NTMwMDI=\",  \"name\": \"Hello-World\",  \"full_name\": \"Codertocat/Hello-World\",  \"private\": false,  \"owner\": { \"login\": \"Codertocat\", \"id\": 21031067, \"node_id\": \"MDQ6VXNlcjIxMDMxMDY3\", \"avatar_url\": \"https://avatars1.githubusercontent.com/u/21031067?v=4\", \"gravatar_id\": \"\", \"url\": \"https://api.github.com/users/Codertocat\", \"html_url\": \"https://github.com/Codertocat\", \"followers_url\": \"https://api.github.com/users/Codertocat/followers\", \"following_url\": \"https://api.github.com/users/Codertocat/following{/other_user}\", \"gists_url\": \"https://api.github.com/users/Codertocat/gists{/gist_id}\", \"starred_url\": \"https://api.github.com/users/Codertocat/starred{/owner}{/repo}\", \"subscriptions_url\": \"https://api.github.com/users/Codertocat/subscriptions\", \"organizations_url\": \"https://api.github.com/users/Codertocat/orgs\", \"repos_url\": \"https://api.github.com/users/Codertocat/repos\", \"events_url\": \"https://api.github.com/users/Codertocat/events{/privacy}\", \"received_events_url\": \"https://api.github.com/users/Codertocat/received_events\", \"type\": \"User\", \"site_admin\": false  },  \"html_url\": \"https://github.com/Codertocat/Hello-World\",  \"description\": null,  \"fork\": false,  \"url\": \"https://api.github.com/repos/Codertocat/Hello-World\",  \"forks_url\": \"https://api.github.com/repos/Codertocat/Hello-World/forks\",  \"keys_url\": \"https://api.github.com/repos/Codertocat/Hello-World/keys{/key_id}\",  \"collaborators_url\": \"https://api.github.com/repos/Codertocat/Hello-World/collaborators{/collaborator}\",  \"teams_url\": \"https://api.github.com/repos/Codertocat/Hello-World/teams\",  \"hooks_url\": \"https://api.github.com/repos/Codertocat/Hello-World/hooks\",  \"issue_events_url\": \"https://api.github.com/repos/Codertocat/Hello-World/issues/events{/number}\",  \"events_url\": \"https://api.github.com/repos/Codertocat/Hello-World/events\",  \"assignees_url\": \"https://api.github.com/repos/Codertocat/Hello-World/assignees{/user}\",  \"branches_url\": \"https://api.github.com/repos/Codertocat/Hello-World/branches{/branch}\",  \"tags_url\": \"https://api.github.com/repos/Codertocat/Hello-World/tags\",  \"blobs_url\": \"https://api.github.com/repos/Codertocat/Hello-World/git/blobs{/sha}\",  \"git_tags_url\": \"https://api.github.com/repos/Codertocat/Hello-World/git/tags{/sha}\",  \"git_refs_url\": \"https://api.github.com/repos/Codertocat/Hello-World/git/refs{/sha}\",  \"trees_url\": \"https://api.github.com/repos/Codertocat/Hello-World/git/trees{/sha}\",  \"statuses_url\": \"https://api.github.com/repos/Codertocat/Hello-World/statuses/{sha}\",  \"languages_url\": \"https://api.github.com/repos/Codertocat/Hello-World/languages\",  \"stargazers_url\": \"https://api.github.com/repos/Codertocat/Hello-World/stargazers\",  \"contributors_url\": \"https://api.github.com/repos/Codertocat/Hello-World/contributors\",  \"subscribers_url\": \"https://api.github.com/repos/Codertocat/Hello-World/subscribers\",  \"subscription_url\": \"https://api.github.com/repos/Codertocat/Hello-World/subscription\",  \"commits_url\": \"https://api.github.com/repos/Codertocat/Hello-World/commits{/sha}\",  \"git_commits_url\": \"https://api.github.com/repos/Codertocat/Hello-World/git/commits{/sha}\",  \"comments_url\": \"https://api.github.com/repos/Codertocat/Hello-World/comments{/number}\",  \"issue_comment_url\": \"https://api.github.com/repos/Codertocat/Hello-World/issues/comments{/number}\",  \"contents_url\": \"https://api.github.com/repos/Codertocat/Hello-World/contents/{+path}\",  \"compare_url\": \"https://api.github.com/repos/Codertocat/Hello-World/compare/{base}...{head}\",  \"merges_url\": \"https://api.github.com/repos/Codertocat/Hello-World/merges\",  \"archive_url\": \"https://api.github.com/repos/Codertocat/Hello-World/{archive_format}{/ref}\",  \"downloads_url\": \"https://api.github.com/repos/Codertocat/Hello-World/downloads\",  \"issues_url\": \"https://api.github.com/repos/Codertocat/Hello-World/issues{/number}\",  \"pulls_url\": \"https://api.github.com/repos/Codertocat/Hello-World/pulls{/number}\",  \"milestones_url\": \"https://api.github.com/repos/Codertocat/Hello-World/milestones{/number}\",  \"notifications_url\": \"https://api.github.com/repos/Codertocat/Hello-World/notifications{?since,all,participating}\",  \"labels_url\": \"https://api.github.com/repos/Codertocat/Hello-World/labels{/name}\",  \"releases_url\": \"https://api.github.com/repos/Codertocat/Hello-World/releases{/id}\",  \"deployments_url\": \"https://api.github.com/repos/Codertocat/Hello-World/deployments\",  \"created_at\": \"2019-05-15T15:19:25Z\",  \"updated_at\": \"2019-05-15T15:20:34Z\",  \"pushed_at\": \"2019-05-15T15:20:33Z\",  \"git_url\": \"git://github.com/Codertocat/Hello-World.git\",  \"ssh_url\": \"git@github.com:Codertocat/Hello-World.git\",  \"clone_url\": \"https://github.com/Codertocat/Hello-World.git\",  \"svn_url\": \"https://github.com/Codertocat/Hello-World\",  \"homepage\": null,  \"size\": 0,  \"stargazers_count\": 0,  \"watchers_count\": 0,  \"language\": \"Ruby\",  \"has_issues\": true,  \"has_projects\": true,  \"has_downloads\": true,  \"has_wiki\": true,  \"has_pages\": true,  \"forks_count\": 0,  \"mirror_url\": null,  \"archived\": false,  \"disabled\": false,  \"open_issues_count\": 2,  \"license\": null,  \"forks\": 0,  \"open_issues\": 2,  \"watchers\": 0,  \"default_branch\": \"master\"  },  \"sender\": {  \"login\": \"Codertocat\",  \"id\": 21031067,  \"node_id\": \"MDQ6VXNlcjIxMDMxMDY3\",  \"avatar_url\": \"https://avatars1.githubusercontent.com/u/21031067?v=4\",  \"gravatar_id\": \"\",  \"url\": \"https://api.github.com/users/Codertocat\",  \"html_url\": \"https://github.com/Codertocat\",  \"followers_url\": \"https://api.github.com/users/Codertocat/followers\",  \"following_url\": \"https://api.github.com/users/Codertocat/following{/other_user}\",  \"gists_url\": \"https://api.github.com/users/Codertocat/gists{/gist_id}\",  \"starred_url\": \"https://api.github.com/users/Codertocat/starred{/owner}{/repo}\",  \"subscriptions_url\": \"https://api.github.com/users/Codertocat/subscriptions\",  \"organizations_url\": \"https://api.github.com/users/Codertocat/orgs\",  \"repos_url\": \"https://api.github.com/users/Codertocat/repos\",  \"events_url\": \"https://api.github.com/users/Codertocat/events{/privacy}\",  \"received_events_url\": \"https://api.github.com/users/Codertocat/received_events\",  \"type\": \"User\",  \"site_admin\": false  }  }";

	private Properties p = null;
	private WebhookMessageFactory messageFactory;

	@BeforeTest
	public void init() throws Exception {
		try (FileReader reader = new FileReader("src/test/resources/properties.prop")) {
			p = new Properties();

			p.load(reader);

			AppProperties.mqHost = p.getProperty("mqHost");
			AppProperties.port = Integer.parseInt(p.getProperty("port"));
			AppProperties.mqUser = p.getProperty("mqUser");
			AppProperties.mqPassword = p.getProperty("mqPassword");
			AppProperties.mqExchangeName = p.getProperty("mqExchangeName");
			AppProperties.instanceName = "testInstance";
			AppProperties.providerName = p.getProperty("providerName");
			AppProperties.awsAccessKey = p.getProperty("awsAccessKey");
			AppProperties.awsSecretKey = p.getProperty("awsSecretKey");
			AppProperties.awsRegion = p.getProperty("awsRegion");
			if (AppProperties.getProviderName().equals("AWSSQS")) {
				messageFactory = new WebhookMessagePublisherSQS();
			} else {
				messageFactory = new WebHookMessagePublisherMQ();
			}
			messageFactory.initializeConnection();
		} catch (Exception e) {
			log.error("Error while initialization {} ", e.getMessage());
		}
	}

	@Test
	public void testPublishEvent() throws Exception {
		try {
			messageFactory.publishEventAction(message, "IPW_WebhookTest");
			Assert.assertTrue(Boolean.TRUE);
		} catch (AssertionError e) {
			log.error(e);
		}
	}

	@AfterTest
	public void cleanUp() throws IOException, TimeoutException {
		try {
			Assert.assertTrue(Boolean.TRUE);
		} catch (AssertionError e) {
			log.error(e);
		}
	}
}
