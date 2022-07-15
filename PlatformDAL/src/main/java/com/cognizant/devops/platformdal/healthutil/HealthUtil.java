/*******************************************************************************
 * Copyright 2020 Cognizant Technology Solutions
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
package com.cognizant.devops.platformdal.healthutil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.cognizant.devops.platformcommons.config.ApplicationConfigProvider;
import com.cognizant.devops.platformcommons.constants.AgentCommonConstant;
import com.cognizant.devops.platformcommons.constants.PlatformServiceConstants;
import com.cognizant.devops.platformcommons.constants.ServiceStatusConstants;
import com.cognizant.devops.platformcommons.core.util.JsonUtils;
import com.cognizant.devops.platformcommons.core.util.SystemStatus;
import com.cognizant.devops.platformcommons.dal.elasticsearch.ElasticSearchDBHandler;
import com.cognizant.devops.platformcommons.dal.neo4j.GraphDBHandler;
import com.cognizant.devops.platformcommons.dal.neo4j.GraphResponse;
import com.cognizant.devops.platformcommons.dal.neo4j.NodeData;
import com.cognizant.devops.platformcommons.exception.InsightsCustomException;
import com.cognizant.devops.platformdal.agentConfig.AgentConfig;
import com.cognizant.devops.platformdal.agentConfig.AgentConfigDAL;
import com.cognizant.devops.platformdal.dal.PostgresMetadataHandler;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class HealthUtil {
	static Logger log = LogManager.getLogger(HealthUtil.class);
	private static final String VERSION = "version";
	private static final String HOST_ENDPOINT = "endPoint";
	private static final String AGENT_NODES = "agentNodes";
	private static final String HEALTH_STATUS = "healthStatus";
	private static final String LAST_RUN_TIME = "lastRunTime";

	/**
	 * Method to fetch Client Response for Services and components
	 * 
	 * @param hostEndPoint
	 * @param apiUrl
	 * @param displayType
	 * @param serviceType
	 * @param isRequiredAuthentication
	 * @param username
	 * @param password
	 * @param authToken
	 * @return JsonObject
	 */
	public JsonObject getClientResponse(String hostEndPoint, String apiUrl, String displayType, String serviceType,
			boolean isRequiredAuthentication, String username, String password, String authToken) {
		JsonObject returnResponse = null;
		String strResponse = "";
		JsonObject json = null;
		String version = "";
		String serviceResponse;
		//ElasticSearchDBHandler apiCallElasticsearch = new ElasticSearchDBHandler();
		try {
			
			serviceResponse = getServiceResponse(isRequiredAuthentication,apiUrl,username, password, authToken);
			
			if (serviceResponse != null && !("").equalsIgnoreCase(serviceResponse)) {
				strResponse = "Response successfully recieved from " + apiUrl;
				log.info("response: {} ",serviceResponse);
				if (serviceType.equalsIgnoreCase(ServiceStatusConstants.NEO4J)) {
					json = JsonUtils.parseStringAsJsonObject(serviceResponse);
					version = json.get("neo4j_version").getAsString();
					String totalDBSize = getNeo4jDBSize(hostEndPoint, username, password, authToken);
					returnResponse = buildSuccessResponse(strResponse, hostEndPoint, displayType, version);
					returnResponse.addProperty("totalDBSize", totalDBSize);
				} else if (serviceType.equalsIgnoreCase(ServiceStatusConstants.RABBITMQ)) {
					json = JsonUtils.parseStringAsJsonObject(serviceResponse);
					version = "RabbitMq version " + json.get("rabbitmq_version").getAsString() + "\n Erlang version "
							+ json.get("erlang_version").getAsString();
					returnResponse = buildSuccessResponse(strResponse, hostEndPoint, displayType, version);
				} else if (serviceType.equalsIgnoreCase(ServiceStatusConstants.ES)) {
					returnResponse = getESResponse(json,serviceResponse,strResponse, hostEndPoint, displayType);
			
				} else if (serviceType.equalsIgnoreCase(ServiceStatusConstants.PGSQL)) {
					hostEndPoint = ApplicationConfigProvider.getInstance().getPostgre().getInsightsDBUrl();
					PostgresMetadataHandler pgdbHandler = new PostgresMetadataHandler();
					version = pgdbHandler.getPostgresDBVersion();
					returnResponse = buildSuccessResponse(strResponse, hostEndPoint, displayType, version);
				} else if (serviceType.equalsIgnoreCase(ServiceStatusConstants.GRAFANA)
						|| serviceType.equalsIgnoreCase(ServiceStatusConstants.LOKI)
						|| serviceType.equalsIgnoreCase(ServiceStatusConstants.VAULT)
						) {
					json = JsonUtils.parseStringAsJsonObject(serviceResponse);
					version = json.get(VERSION).getAsString();
					returnResponse = buildSuccessResponse(strResponse, hostEndPoint, displayType, version);
				} else if (serviceType.equalsIgnoreCase(ServiceStatusConstants.PROMTAIL)) {
					version = "";
					returnResponse = buildSuccessResponse(strResponse, hostEndPoint, displayType, version);
				} else if (serviceType.equalsIgnoreCase(ServiceStatusConstants.H2O)) {
					returnResponse = getH2oResponse(json,serviceResponse,strResponse, hostEndPoint, displayType);
			
				}
			} else {
				strResponse = "Response not received from service " + apiUrl;
				returnResponse = buildFailureResponse(strResponse, hostEndPoint, displayType, version);
			}
		} catch (Exception e) {
			log.error("Error while capturing health check at {} ",apiUrl, e);
			log.error(e.getMessage());
			strResponse = "Error while capturing health check at " + apiUrl;
			returnResponse = buildFailureResponse(strResponse, hostEndPoint, displayType, version);
		}
		return returnResponse;
	}
	
	private JsonObject getESResponse(JsonObject json, String serviceResponse,
			String strResponse, String hostEndPoint, String displayType) {
		
		String version = "";
		JsonObject response = null;
		
		json = JsonUtils.parseStringAsJsonObject(serviceResponse);
		JsonObject versionElasticsearch = (JsonObject) json.get(VERSION);
		if (versionElasticsearch != null) {
			version = versionElasticsearch.get("number").getAsString();
		}
		response = buildSuccessResponse(strResponse, hostEndPoint, displayType, version);
		
		return response;
		
	}
	private JsonObject getH2oResponse(JsonObject json, String serviceResponse,
			String strResponse, String hostEndPoint, String displayType) {
		String version = "";
		JsonObject response = null;
		
		json = JsonUtils.parseStringAsJsonObject(serviceResponse);
		JsonArray entries = json.getAsJsonArray("entries");
		for (JsonElement entry : entries) {
			JsonObject entryJson = entry.getAsJsonObject();
			String entryName = entryJson.get("name").getAsString();
			if(entryName.equalsIgnoreCase("Build project version")) {
				version = entryJson.get("value").getAsString();
			}
		}
		
		response = buildSuccessResponse(strResponse, hostEndPoint, displayType, version);
		return response;
	}
	
	private String getServiceResponse(boolean isRequiredAuthentication, String apiUrl, String username, String password, String authToken) throws InsightsCustomException {
		
		String response;
		ElasticSearchDBHandler apiCallElasticsearch = new ElasticSearchDBHandler();
		
		if (isRequiredAuthentication) {
			response = SystemStatus.jerseyGetClientWithAuthentication(apiUrl, username, password, authToken);
		} else {
			response = apiCallElasticsearch.search(apiUrl);
		}
		
		return response;
	}


	/**
	 * Method to build Success Response
	 * 
	 * @param message
	 * @param apiUrl
	 * @param type
	 * @param version
	 * @return JsonObject
	 */
	public JsonObject buildSuccessResponse(String message, String apiUrl, String type, String version) {
		JsonObject jsonResponse = new JsonObject();
		jsonResponse.addProperty(PlatformServiceConstants.STATUS, PlatformServiceConstants.SUCCESS);
		jsonResponse.addProperty(PlatformServiceConstants.MESSAGE, message);
		jsonResponse.addProperty(HOST_ENDPOINT, apiUrl);
		jsonResponse.addProperty(ServiceStatusConstants.TYPE, type);
		jsonResponse.addProperty(VERSION, version);
		return jsonResponse;
	}

	/**
	 * Method to build Failure Response
	 * 
	 * @param message
	 * @param apiUrl
	 * @param type
	 * @param version
	 * @return JsonObject
	 */
	public JsonObject buildFailureResponse(String message, String apiUrl, String type, String version) {
		JsonObject jsonResponse = new JsonObject();
		jsonResponse.addProperty(PlatformServiceConstants.STATUS, PlatformServiceConstants.FAILURE);
		jsonResponse.addProperty(PlatformServiceConstants.MESSAGE, message);
		jsonResponse.addProperty(HOST_ENDPOINT, apiUrl);
		jsonResponse.addProperty(ServiceStatusConstants.TYPE, type);
		jsonResponse.addProperty(VERSION, version);
		return jsonResponse;
	}

	
	/**
	 * Method to fetch status of Components
	 * 
	 * @param serviceType
	 * @return JsonObject
	 */
	public JsonObject getComponentStatus(String serviceType) {
		JsonObject returnObject = null;
		try {
			if (serviceType.equalsIgnoreCase("PlatformEngine")) {
				returnObject = getServiceResponse("HEALTH:ENGINE", 1);
			} else if (serviceType.equalsIgnoreCase("PlatformWebhookSubscriber")) {
				returnObject = getServiceResponse("HEALTH:WEBHOOKSUBSCRIBER", 1);
			} else if (serviceType.equalsIgnoreCase("PlatformWebhookEngine")) {
				returnObject = getServiceResponse("HEALTH:WEBHOOKENGINE", 1);
			} else if (serviceType.equalsIgnoreCase("PlatformAuditEngine")) {
				returnObject = getServiceResponse("HEALTH:AUDITENGINE", 1);
			} else if (serviceType.equalsIgnoreCase("PlatformDataArchivalEngine")) {
				returnObject = getServiceResponse("HEALTH:DATAARCHIVALENGINE", 1);
			} else if (serviceType.equalsIgnoreCase("PlatformWorkflow")) {
				returnObject = getServiceResponse("HEALTH:INSIGHTS_WORKFLOW", 1);
			} else if (serviceType.equalsIgnoreCase("PlatformService")) {
				returnObject = getServiceResponse("HEALTH:INSIGHTS_PLATFORMSERVICE", 1);
			}else if (serviceType.equalsIgnoreCase("Agents")) {
				returnObject = getAgentResponse("HEALTH:LATEST",100);
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		return returnObject;
	}

	
	/**
	 * Method to load Health Data
	 * 
	 * @param label
	 * @param agentId
	 * @param limitOfRow
	 * @return GraphResponse
	 */
	public GraphResponse loadHealthData(String label, String agentId, int limitOfRow) {

		String query = "";

		if (agentId.equalsIgnoreCase("")) {
			query = "MATCH (n:" + label
					+ ") where n.inSightsTime IS NOT NULL RETURN n order by n.inSightsTime DESC LIMIT " + limitOfRow;
		} else if (!agentId.equalsIgnoreCase("")) {
			String queueName = getAgentHealthQueueName(agentId);
			// To handle case where Agent delete from Postgres but data present in Neo4j
			if (queueName == null) {
				queueName = label;
			}
			query = "MATCH (n:" + queueName + ") where n.inSightsTime IS NOT NULL and n.agentId ='" + agentId
					+ "' RETURN n order by n.inSightsTime DESC LIMIT " + limitOfRow;
		}
		log.info("query  ====== {} ", query);
		GraphResponse graphResponse = null;
		try {
			GraphDBHandler dbHandler = new GraphDBHandler();
			graphResponse = dbHandler.executeCypherQuery(query);
		} catch (Exception e) {
			log.error(e.getMessage());
			graphResponse = new GraphResponse();
		}
		return graphResponse;
	}

	/**
	 * Method to build Agent Response
	 * 
	 * @param status
	 * @param message
	 * @param graphResponse
	 * @return JsonObject
	 */
	private JsonObject buildAgentResponse(String status, String message, GraphResponse graphResponse) {
		String toolcategory = "";
		String toolName = "";
		String insightTimeX = "";
		String agentstatus = "";
		String agentId = "";
		JsonObject jsonResponse = new JsonObject();
		JsonArray agentNode = new JsonArray();
		if (status.equalsIgnoreCase(PlatformServiceConstants.SUCCESS)) {

			jsonResponse.addProperty(ServiceStatusConstants.TYPE, ServiceStatusConstants.AGENTS);

			Iterator<NodeData> agentnodeIterator = graphResponse.getNodes().iterator();
			while (agentnodeIterator.hasNext()) {
				NodeData node = agentnodeIterator.next();
				toolcategory = node.getPropertyMap().get(AgentCommonConstant.CATEGORY);
				toolName = node.getPropertyMap().get(AgentCommonConstant.TOOLNAME);
				if (node.getPropertyMap().containsKey(AgentCommonConstant.AGENTID)) {
					agentId = node.getPropertyMap().get(AgentCommonConstant.AGENTID);
				} else {
					agentId = "";
				}
				agentstatus = node.getPropertyMap().get(PlatformServiceConstants.STATUS);
				insightTimeX = node.getPropertyMap().get(PlatformServiceConstants.INSIGHTSTIMEX);
				JsonObject jsonResponse2 = new JsonObject();
				jsonResponse2.addProperty(PlatformServiceConstants.INSIGHTSTIMEX, insightTimeX);
				jsonResponse2.addProperty(AgentCommonConstant.TOOLNAME, toolName);
				jsonResponse2.addProperty(AgentCommonConstant.AGENTID, agentId);
				jsonResponse2.addProperty(PlatformServiceConstants.INSIGHTSTIMEX, insightTimeX);
				jsonResponse2.addProperty(PlatformServiceConstants.STATUS, agentstatus);
				jsonResponse2.addProperty(AgentCommonConstant.CATEGORY, toolcategory);
				agentNode.add(jsonResponse2);
			}
			jsonResponse.add(AGENT_NODES, agentNode);
		} else {
			jsonResponse.addProperty(PlatformServiceConstants.STATUS, PlatformServiceConstants.FAILURE);
			jsonResponse.addProperty(PlatformServiceConstants.MESSAGE, message);
			jsonResponse.addProperty(AgentCommonConstant.CATEGORY, toolcategory);
			jsonResponse.addProperty(ServiceStatusConstants.TYPE, ServiceStatusConstants.AGENTS);
			jsonResponse.addProperty(AgentCommonConstant.TOOLNAME, toolName);
			jsonResponse.addProperty(PlatformServiceConstants.INSIGHTSTIMEX, insightTimeX);
			jsonResponse.addProperty(VERSION, "");
			jsonResponse.add(AGENT_NODES, agentNode);
		}

		return jsonResponse;
	}

	/**
	 * Method to get Neo4h DB size
	 * 
	 * @param hostEndPoint
	 * @param username
	 * @param password
	 * @param authToken
	 * @return String
	 */
	private String getNeo4jDBSize(String hostEndPoint, String username, String password, String authToken) {
		long totalStoreSize = 0L;
		String returnSize = "";
		try {
			if(ApplicationConfigProvider.getInstance().getGraph().getVersion().contains("4.")) {
				GraphDBHandler dbHandler = new GraphDBHandler();
				String storeSizeQuery = "CALL apoc.monitor.store() YIELD logSize, totalStoreSize RETURN sum(logSize+totalStoreSize)";
				JsonObject storeSizeResponse = dbHandler.executeCypherQueryForJsonResponse(storeSizeQuery);
				log.debug("Neo4j database store size Response ====== {} ",storeSizeResponse);
				JsonArray dataArray = storeSizeResponse.get("results").getAsJsonArray().get(0).getAsJsonObject().get("data").getAsJsonArray();
				totalStoreSize = dataArray.get(0).getAsJsonObject().get("row").getAsJsonArray().get(0).getAsLong();
			} else {
				String apiUrlForSize = hostEndPoint
						+ "/db/manage/server/jmx/domain/org.neo4j/instance%3Dkernel%230%2Cname%3DStore+sizes";
				String serviceNeo4jResponse = SystemStatus.jerseyGetClientWithAuthentication(apiUrlForSize, username,
						password, authToken);
				log.debug("serviceNeo4jResponse ====== {} ",serviceNeo4jResponse);

				JsonElement object = JsonUtils.parseString(serviceNeo4jResponse);
				if (object.isJsonArray()) {					
					totalStoreSize = getTotalStoreSize(object);					
				}
			}
			
			log.debug(" info totalStoreSize  ==== {}",totalStoreSize);
			if (totalStoreSize > 0) {
				returnSize = humanReadableByteCount(totalStoreSize, Boolean.FALSE);
			}
		} catch (Exception e) {
			log.error(e.getMessage());
			log.error(" Error while geeting neo4j Size");
		}
		return returnSize;
	}

	private long getTotalStoreSize(JsonElement object) {
		long totalStoreSize = 0L;
		if (object.getAsJsonArray().get(0).getAsJsonObject().get("attributes").isJsonArray()) {
			JsonArray beans = object.getAsJsonArray().get(0).getAsJsonObject().get("attributes")
					.getAsJsonArray();
			for (JsonElement jsonElement : beans) {
				if (jsonElement.getAsJsonObject().get("name").getAsString()
						.equalsIgnoreCase("TotalStoreSize")) {
					totalStoreSize = jsonElement.getAsJsonObject().get("value").getAsLong();
				}
			}
		}
		return totalStoreSize;
	}
	/**
	 * Method to generate Human Readable byte count
	 * 
	 * @param bytes
	 * @param si
	 * @return String
	 */
	public static String humanReadableByteCount(long bytes, boolean si) {
		int unit = si ? 1000 : 1024;
		if (bytes < unit)
			return bytes + " B";
		int exp = (int) (Math.log(bytes) / Math.log(unit));
		String pre = (si ? "kMGTPE" : "KMGTPE").charAt(exp - 1) + (si ? "" : "i");
		return String.format("%.1f %sB", bytes / Math.pow(unit, exp), pre);
	}

	/**
	 * Method to get Agent Health Queue name
	 * 
	 * @param agentId
	 * @return String
	 */
	public String getAgentHealthQueueName(String agentId) {
		String healthRoutingKey = null;
		try {
			AgentConfigDAL agentConfigDal = new AgentConfigDAL();
			AgentConfig agentConfig = agentConfigDal.getAgentConfigurations(agentId);
			JsonObject config = JsonUtils.parseStringAsJsonObject(agentConfig.getAgentJson());
			JsonObject json = config.get("publish").getAsJsonObject();
			healthRoutingKey = json.get("health").getAsString().replace(".", ":");
		} catch (Exception e) {
			log.error(" No DB record found for agentId {} ", agentId);
		}
		return healthRoutingKey;
	}
	
	/**
	 * Method to get Service Response
	 * 
	 * @param labels
	 * @param noOfRows
	 * @return JsonObject
	 */
	private JsonObject getServiceResponse(String labels,int noOfRows) {
		String successResponse = "";
		String version = "";
		String status = "";
		JsonObject returnObject = null;
		GraphResponse graphResponse = loadHealthData(labels,"", noOfRows);
		if (graphResponse != null) {
			if (!graphResponse.getNodes().isEmpty()) {
				successResponse = graphResponse.getNodes().get(0).getPropertyMap().get("message");
				version = graphResponse.getNodes().get(0).getPropertyMap().get(VERSION);
				status = graphResponse.getNodes().get(0).getPropertyMap().get("status");
				if (status.equalsIgnoreCase(PlatformServiceConstants.SUCCESS)) {
					returnObject = buildSuccessResponse(successResponse, "-",
							ServiceStatusConstants.SERVICE, version);
				} else {
					returnObject = buildFailureResponse(successResponse, "-",
							ServiceStatusConstants.SERVICE, version);
				}
			} else {
				successResponse = "Node list is empty in response not received from Neo4j";
				returnObject = buildFailureResponse(successResponse, "-",
						ServiceStatusConstants.SERVICE, version);
			}
		} else {
			successResponse = "Response not received from Neo4j";
			returnObject = buildFailureResponse(successResponse, "-", ServiceStatusConstants.SERVICE,
					version);
		}
		return returnObject;
	}
	
	/**
	 * Method to fetch response of Agents
	 * 
	 * @param labels
	 * @param noOfRows
	 * @return JsonObject
	 */
	private JsonObject getAgentResponse(String labels, int noOfRows) {
		String successResponse = "";
		String status = "";
		GraphResponse graphResponse = loadHealthData(labels, "", noOfRows);
		if (graphResponse != null) {
			if (!graphResponse.getNodes().isEmpty()) {
				status = PlatformServiceConstants.SUCCESS;
			} else {
				successResponse = "Node list is empty in response not received from Neo4j";
				status = PlatformServiceConstants.FAILURE;
			}
		} else {
			successResponse = "Response not received from Neo4j";
			status = PlatformServiceConstants.FAILURE;
		}
		log.debug("message {} ", successResponse);
		return buildAgentResponse(status, successResponse, graphResponse);
	}
	
	/**
	 * Method to fetch data component HTML
	 * 
	 * @return String
	 */
	public JsonObject getDataComponentStatus() {
		JsonObject dataComponentStatus = new JsonObject();
		try {
			JsonObject grafanaStatus = getComponentStatusResponse(ServiceStatusConstants.GRAFANA);
			dataComponentStatus.add(ServiceStatusConstants.GRAFANA, grafanaStatus);
			JsonObject postgreStatus = getComponentStatusResponse(ServiceStatusConstants.PGSQL);
			dataComponentStatus.add(ServiceStatusConstants.PGSQL, postgreStatus);
			JsonObject neo4jStatus = getComponentStatusResponse(ServiceStatusConstants.NEO4J);
			dataComponentStatus.add(ServiceStatusConstants.NEO4J, neo4jStatus);
			JsonObject rabbitMqStatus = getComponentStatusResponse(ServiceStatusConstants.RABBITMQ);
			dataComponentStatus.add(ServiceStatusConstants.RABBITMQ, rabbitMqStatus);
			String pythonVersion = getPythonVersion();
			if(pythonVersion != null && pythonVersion.length() != 0) {
				JsonObject pythonStatus= new JsonObject();
				pythonStatus.addProperty("status", "success");
				pythonStatus.addProperty("message", "");
				pythonStatus.addProperty("type", ServiceStatusConstants.OTHERS);
				pythonStatus.addProperty("endpoint", "");
				pythonStatus.addProperty( VERSION, pythonVersion.substring(7));
				dataComponentStatus.add(ServiceStatusConstants.PYTHON, pythonStatus);
			}
			if(ServiceStatusConstants.ES_HOST != null && !ServiceStatusConstants.ES_HOST.isEmpty() ) {				
				JsonObject esStatus = getComponentStatusResponse(ServiceStatusConstants.ES);
				dataComponentStatus.add(ServiceStatusConstants.ES, esStatus);
			}
			if(ServiceStatusConstants.LOKI_HOST != null && !ServiceStatusConstants.LOKI_HOST.isEmpty() ) {			
				JsonObject lokiStatus = getComponentStatusResponse(ServiceStatusConstants.LOKI);
				dataComponentStatus.add(ServiceStatusConstants.LOKI, lokiStatus);
			}
			if(ServiceStatusConstants.PROMTAIL_HOST != null && !ServiceStatusConstants.PROMTAIL_HOST.isEmpty() ) {	
				JsonObject promtailStatus = getComponentStatusResponse(ServiceStatusConstants.PROMTAIL);
				dataComponentStatus.add(ServiceStatusConstants.PROMTAIL, promtailStatus);
			}
			if(ServiceStatusConstants.VAULT_HOST != null && !ServiceStatusConstants.VAULT_HOST.isEmpty() ) {				
				JsonObject vaultStatus = getComponentStatusResponse(ServiceStatusConstants.VAULT);
				dataComponentStatus.add(ServiceStatusConstants.VAULT, vaultStatus);
			}
			if(ServiceStatusConstants.H2O_HOST != null && !ServiceStatusConstants.H2O_HOST.isEmpty() ) {				
				JsonObject h2oStatus = getComponentStatusResponse(ServiceStatusConstants.H2O);
				dataComponentStatus.add(ServiceStatusConstants.H2O, h2oStatus);
			}
			
		} catch (Exception e) {
			log.error("Worlflow Detail ==== Error creating HTML body for data components");
		}
		log.debug(" dataComponentStatus {} ", dataComponentStatus);
		return dataComponentStatus;

	}

	/**
	 * Method to fetch Service HTML
	 * 
	 * @return String
	 */
	public JsonObject getServiceStatus() {
		JsonObject serviceStatus = new JsonObject();
		try {

			JsonObject jsonPlatformServiceStatus = getComponentStatus("PlatformService");
			serviceStatus.add(ServiceStatusConstants.PLATFORM_SERVICE, jsonPlatformServiceStatus);
			JsonObject jsonPlatformEngineStatus = getComponentStatus("PlatformEngine");
			serviceStatus.add(ServiceStatusConstants.PLATFORM_ENGINE, jsonPlatformEngineStatus);
			JsonObject jsonPlatformWorkflowStatus = getComponentStatus("PlatformWorkflow");
			serviceStatus.add(ServiceStatusConstants.PLATFORM_WORKFLOW, jsonPlatformWorkflowStatus);
		} catch (Exception e) {
			log.error("Worlflow Detail ==== Error creating HTML body for services");
		}
		log.debug(" serviceStatus {} ", serviceStatus);
		return serviceStatus;

	}
	
	/**
	 * Method to get health status of all agents
	 * 
	 * @return JsonObject
	 */
	public JsonObject getAgentsStatus() {
		return getComponentStatus("Agents");
	}
	
	public JsonObject getRegisteredAgentsAndHealth() throws InsightsCustomException {
		AgentConfigDAL agentConfigDAL = new AgentConfigDAL();
		JsonObject agentDetails = new  JsonObject();
		JsonArray agentNodes = new JsonArray();
		try {
			List<AgentConfig> agentConfigList = agentConfigDAL.getAllDataAgentConfigurations();
			for (AgentConfig agentConfig : agentConfigList) {
				JsonObject node = new JsonObject();
				node.addProperty("toolName", agentConfig.getToolName());
				node.addProperty("agentId", agentConfig.getAgentKey());
				JsonObject agentHealthNode = getAgentHealth(node, agentConfig.getAgentKey());
				if(agentHealthNode.has(LAST_RUN_TIME)) {
					node.addProperty(LAST_RUN_TIME,agentHealthNode.get(LAST_RUN_TIME).getAsString());
				} else {
					node.addProperty(LAST_RUN_TIME, "");
				}
				if(agentHealthNode.has(HEALTH_STATUS)) {
					node.addProperty(HEALTH_STATUS,agentHealthNode.get(HEALTH_STATUS).getAsString());
				} else {
					node.addProperty(HEALTH_STATUS,"");
				}
				agentNodes.add(node);
			}
			agentDetails.add(AGENT_NODES, agentNodes);
		} catch (Exception e) {
			log.error("Error getting all agent config ", e);
			throw new InsightsCustomException(e.toString());
		}
		return agentDetails;
	}
	
	public JsonObject getAgentHealth(JsonObject agentJson, String agentId) {
		GraphDBHandler graphDBHandler = new GraphDBHandler();
		JsonObject response;
		try {
			response = graphDBHandler.executeCypherQueryForJsonResponse("MATCH (n:HEALTH:LATEST) where n.agentId='"+agentId+"' return n order by n.inSightsTime desc limit 1");		
			JsonArray responseArray = response.get("results").getAsJsonArray();
			JsonArray responseData = responseArray.get(0).getAsJsonObject().get("data").getAsJsonArray();
			if(responseData.size() > 0) {
				agentJson.addProperty(LAST_RUN_TIME, responseData.get(0).getAsJsonObject().get("row").getAsJsonArray().get(0).getAsJsonObject().get(PlatformServiceConstants.INSIGHTSTIMEX).getAsString());
				agentJson.addProperty(HEALTH_STATUS, responseData.get(0).getAsJsonObject().get("row").getAsJsonArray().get(0).getAsJsonObject().get(PlatformServiceConstants.STATUS).getAsString());
			}
		} catch (Exception e) {
			log.error("Error getting agent health ", e);
		}
		
		return agentJson;
	}
	
	private String getPythonVersion() {
		StringBuilder version = new StringBuilder();
		try {
			Process process;
			process = Runtime.getRuntime().exec("python -V");
			BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));
			String line;
			while((line = in.readLine()) != null) {
				version.append(line);
			}
			process.destroy();
		} catch (IOException e) {
			log.error("Error getting python versions ", e);
		}
		return version.toString();
	}
	
	private JsonObject getComponentStatusResponse(String componentName) {
		JsonObject response;
		
		String username = null;
		String password = null;
		String authToken = null;
		String hostEndPoint = "";
		String apiUrl = "";
		String componentType = "";
		Boolean isAuthRequired = false;
		
		switch (componentName) {
		case ServiceStatusConstants.PGSQL:
			hostEndPoint = ServiceStatusConstants.POSTGRESQL_HOST;
			apiUrl = hostEndPoint;
			componentType = ServiceStatusConstants.DB;
			break;
		case ServiceStatusConstants.NEO4J:
			hostEndPoint = ServiceStatusConstants.NEO4J_HOST;
			if(ApplicationConfigProvider.getInstance().getGraph().getVersion().contains("3.5")) {
				apiUrl = hostEndPoint + "/db/data/";
			}else {
				apiUrl = hostEndPoint; 
			}
			componentType = ServiceStatusConstants.DB;
			isAuthRequired = true;
			authToken = ApplicationConfigProvider.getInstance().getGraph().getAuthToken();
			break;
		case ServiceStatusConstants.RABBITMQ:
			hostEndPoint = ServiceStatusConstants.RABBIT_MQ;
			apiUrl = hostEndPoint + "/api/overview";
			componentType = ServiceStatusConstants.DB;
			isAuthRequired = true;
			username = ApplicationConfigProvider.getInstance().getMessageQueue().getUser();
			password = ApplicationConfigProvider.getInstance().getMessageQueue().getPassword();
			break;
		case ServiceStatusConstants.GRAFANA:
			hostEndPoint = ServiceStatusConstants.GRAFANA_HOST;
			apiUrl = hostEndPoint + "/api/health";
			componentType = ServiceStatusConstants.OTHERS;
			break;
		case ServiceStatusConstants.ES:
			hostEndPoint = ServiceStatusConstants.ES_HOST;
			apiUrl = hostEndPoint;
			componentType = ServiceStatusConstants.OTHERS;
			break;
		case ServiceStatusConstants.LOKI:
			hostEndPoint = ServiceStatusConstants.LOKI_HOST;
			apiUrl = hostEndPoint + "/loki/api/v1/status/buildinfo";
			componentType = ServiceStatusConstants.OTHERS;
			break;
		case ServiceStatusConstants.PROMTAIL:
			hostEndPoint = ServiceStatusConstants.PROMTAIL_HOST;
			apiUrl = hostEndPoint + "/ready";
			componentType = ServiceStatusConstants.OTHERS;
			break;
		case ServiceStatusConstants.VAULT:
			hostEndPoint = ServiceStatusConstants.VAULT_HOST;
			apiUrl = hostEndPoint + "/sys/health";
			componentType = ServiceStatusConstants.OTHERS;
			break;
		case ServiceStatusConstants.H2O:
			hostEndPoint = ServiceStatusConstants.H2O_HOST;
			apiUrl = hostEndPoint + "/3/About"; 
			componentType = ServiceStatusConstants.OTHERS;
			break;
		default:
			break;
		}
		
		response = getClientResponse(hostEndPoint, apiUrl, componentType,
				componentName, isAuthRequired, username, password, authToken);
		
		return response;
	}

}
