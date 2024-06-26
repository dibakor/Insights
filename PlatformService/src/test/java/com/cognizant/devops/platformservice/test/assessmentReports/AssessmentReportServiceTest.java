/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 * 
 * http:www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
package com.cognizant.devops.platformservice.test.assessmentReports;

import static org.testng.Assert.assertTrue;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import org.apache.commons.compress.utils.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.multipart.MultipartFile;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.cognizant.devops.platformservice.assessmentreport.service.GrafanaUtilities;
import com.cognizant.devops.platformservice.emailconfiguration.controller.InsightsEmailConfigurationController;
import com.cognizant.devops.platformcommons.constants.ConfigOptions;
import com.cognizant.devops.platformcommons.constants.PlatformServiceConstants;
import com.cognizant.devops.platformcommons.core.util.InsightsUtils;
import com.cognizant.devops.platformcommons.core.util.JsonUtils;
import com.cognizant.devops.platformcommons.exception.InsightsCustomException;
import com.cognizant.devops.platformdal.assessmentreport.InsightsAssessmentConfiguration;
import com.cognizant.devops.platformdal.assessmentreport.InsightsAssessmentReportTemplate;
import com.cognizant.devops.platformdal.assessmentreport.InsightsContentConfig;
import com.cognizant.devops.platformdal.assessmentreport.InsightsKPIConfig;
import com.cognizant.devops.platformdal.assessmentreport.ReportConfigDAL;
import com.cognizant.devops.platformdal.grafana.pdf.GrafanaOrgToken;
import com.cognizant.devops.platformdal.workflow.InsightsWorkflowTask;
import com.cognizant.devops.platformdal.workflow.InsightsWorkflowTaskSequence;
import com.cognizant.devops.platformservice.assessmentreport.controller.InsightsAssessmentReportController;
import com.cognizant.devops.platformservice.assessmentreport.service.AssesmentReportServiceImpl;
import com.cognizant.devops.platformservice.rest.filemanagement.service.FileManagementServiceImpl;
import com.cognizant.devops.platformservice.test.testngInitializer.TestngInitializerTest;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

@Test
@ContextConfiguration(locations = { "classpath:spring-test-config.xml" })
@SuppressWarnings("unused")
@WebAppConfiguration
public class AssessmentReportServiceTest extends AssessmentReportServiceData {
	JsonObject testData = new JsonObject();
	private static final Logger log = LogManager.getLogger(AssessmentReportServiceTest.class);

	@BeforeClass
	public void prepareData() throws InsightsCustomException {
		try {
			String path = System.getenv().get(ConfigOptions.INSIGHTS_HOME) + File.separator
					+ TestngInitializerTest.TESTNG_TESTDATA + File.separator
					+ TestngInitializerTest.TESTNG_PLATFORMSERVICE + File.separator + "AssessmentReportService.json";
			testData = JsonUtils.getJsonData(path).getAsJsonObject();
			prepareAssessmentData();
		} catch (Exception e) {
			log.error("message", e);
		}
	}

	@Autowired
	InsightsAssessmentReportController insightsAssessmentReportController;
	@Autowired
	AssesmentReportServiceImpl assessmentService;
	@Autowired
	FileManagementServiceImpl fileManagementService;
	ReportConfigDAL reportConfigDAL = new ReportConfigDAL();
	@Autowired
	GrafanaUtilities GrafanaUtilities;
	@Autowired
	InsightsEmailConfigurationController insightsEmailConfigurationController;

	@Test(priority = 1)
	public void testsaveKpiDefinition() throws InsightsCustomException, IOException {
		try {
			JsonObject response = insightsAssessmentReportController
					.saveKpiDefinition(testData.get("registerkpi").toString());
			InsightsKPIConfig kpi = reportConfigDAL.getKPIConfig(registerkpiJson.get("kpiId").getAsInt());
			Assert.assertNotNull(kpi);
			Assert.assertNotNull(kpi.getKpiId());
			Assert.assertEquals(kpi.getKpiId().intValue(), registerkpiJson.get("kpiId").getAsInt());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 2)
	public void testsaveROIKpiDefinition() throws InsightsCustomException, IOException {
		try {
			JsonObject response = insightsAssessmentReportController
					.saveKpiDefinition(testData.get("registerROIkpi").toString());
			InsightsKPIConfig kpi = reportConfigDAL.getKPIConfig(registerROIkpiJson.get("kpiId").getAsInt());
			Assert.assertNotNull(kpi);
			Assert.assertNotNull(kpi.getKpiId());
			Assert.assertEquals(kpi.getKpiId().intValue(), registerROIkpiJson.get("kpiId").getAsInt());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 3)
	public void testsaveKpiDefinitionDuplicateKpiId() throws InsightsCustomException, IOException {
		String expectedOutcome = "KPI already exists";
		JsonObject response = insightsAssessmentReportController
				.saveKpiDefinition(testData.get("registerkpi").toString());
		String actual = response.get("message").getAsString().replace("\"", "");
		Assert.assertEquals(actual, expectedOutcome);
	}

	@Test(priority = 4)
	public void testsaveKpiDefinitionIncompleteData() throws InsightsCustomException, IOException {
		JsonObject response = insightsAssessmentReportController
				.saveKpiDefinition(testData.get("incorrectRegisterkpi").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 5)
	public void testsaveContentDefinition() throws InsightsCustomException, IOException {
		try {
			JsonObject response = insightsAssessmentReportController
					.saveContentDefinition(testData.get("registerContent").toString());
			InsightsContentConfig content = reportConfigDAL
					.getContentConfig(registerContentJson.get("contentId").getAsInt());
			Assert.assertNotNull(content);
			Assert.assertNotNull(content.getKpiConfig().getKpiId());
			Assert.assertEquals(content.getContentId().intValue(), registerContentJson.get("contentId").getAsInt());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 6)
	public void testsaveContentDefinitionDuplicateContentId() throws InsightsCustomException, IOException {
		String expectedOutcome = "Content Definition already exists";
		JsonObject response = insightsAssessmentReportController
				.saveContentDefinition(testData.get("registerContent").toString());
		String actual = response.get("message").getAsString().replace("\"", "");
		Assert.assertEquals(actual, expectedOutcome);
	}

	@Test(priority = 7)
	public void testsaveContentDefinitionIncompleteData() throws InsightsCustomException, IOException {
		JsonObject response = insightsAssessmentReportController
				.saveContentDefinition(testData.get("incorrectContent").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 8)
	public void testsaveContentDefinitionWithoutKpi() throws InsightsCustomException, IOException {
		String expectedOutcome = "KPI not exists";
		JsonObject response = insightsAssessmentReportController
				.saveContentDefinition(testData.get("contentWithoutKpi").toString());
		String actual = response.get("message").getAsString().replace("\"", "");
		Assert.assertEquals(actual, expectedOutcome);
	}

	@Test(priority = 9)
	public void testUploadKPIInDatabase() throws InsightsCustomException, IOException {
		FileInputStream input = null;
		try {
			String expectedOutcome = "All KPI records are inserted successfully. ";
			input = new FileInputStream(kpiFile);
			MultipartFile multipartFile = new MockMultipartFile("file", kpiFile.getName(), "text/plain",
					IOUtils.toByteArray(input));
			JsonObject response = insightsAssessmentReportController.saveBulkKpiDefinition(multipartFile);
			readFileAndgetKpiIdList(kpiFile.getName());
			String actual = response.get("data").getAsString().replace("\"", "");
			Assert.assertEquals(actual, expectedOutcome);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		} finally {
			input.close();
		}
	}

	@Test(priority = 10)
	public void testUploadContentInDatabase() throws InsightsCustomException, IOException {
		FileInputStream input = null;
		try {
			String expectedOutcome = "All Content records are inserted successfully.";
			input = new FileInputStream(configFile);
			MultipartFile multipartFile = new MockMultipartFile("file", configFile.getName(), "text/plain",
					IOUtils.toByteArray(input));
			JsonObject response = insightsAssessmentReportController.saveBulkContentDefinition(multipartFile);
			String actual = response.get("data").getAsString().replace("\"", "");
			Assert.assertEquals(actual, expectedOutcome);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		} finally {
			input.close();
		}
	}

	@Test(priority = 11)
	public void testUploadContentInDatabaseWithWrongFileFormat() throws InsightsCustomException, IOException {
		String expectedOutcome = "Invalid file format.";
		FileInputStream input = new FileInputStream(configFileTxt);
		MultipartFile multipartFile = new MockMultipartFile("file", configFileTxt.getName(), "text/plain",
				IOUtils.toByteArray(input));
		JsonObject response = insightsAssessmentReportController.saveBulkContentDefinition(multipartFile);
		String actual = response.get("message").getAsString().replace("\"", "");
		Assert.assertEquals(actual, expectedOutcome);
	}

	@Test(priority = 12)
	public void testUploadKPIInDatabaseWithWrongFileFormat() throws InsightsCustomException, IOException {
		String expectedOutcome = "Invalid kpi file format.";
		FileInputStream input = new FileInputStream(kpiFileTxt);
		MultipartFile multipartFile = new MockMultipartFile("file", kpiFileTxt.getName(), "text/plain",
				IOUtils.toByteArray(input));
		JsonObject response = insightsAssessmentReportController.saveBulkKpiDefinition(multipartFile);
		String actual = response.get("message").getAsString().replace("\"", "");
		Assert.assertEquals(actual, expectedOutcome);
	}

	@Test(priority = 13)
	public void testUploadKPIInDatabaseWithEmptyFile() throws InsightsCustomException, IOException {
		FileInputStream input = new FileInputStream(emptyFile);
		MultipartFile multipartFile = new MockMultipartFile("file", emptyFile.getName(), "text/plain",
				IOUtils.toByteArray(input));
		JsonObject response = insightsAssessmentReportController.saveBulkKpiDefinition(multipartFile);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 14)
	public void testUploadContentInDatabaseWithEmptyFile() throws InsightsCustomException, IOException {
		FileInputStream input = new FileInputStream(emptyFile);
		MultipartFile multipartFile = new MockMultipartFile("file", emptyFile.getName(), "text/plain",
				IOUtils.toByteArray(input));
		JsonObject response = insightsAssessmentReportController.saveBulkContentDefinition(multipartFile);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 15)
	public void testSaveReportTemplate() throws InsightsCustomException {
		try {
			JsonObject response = insightsAssessmentReportController
					.saveReportTemplate(testData.get("reportTemplate").toString());
			String actual = response.get("status").getAsString().replace("\"", "");
			reportIdString = response.get("data").getAsString().replace("\"", "").replaceAll("[^0-9]", "");
			setReportId(reportIdString);
			Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 16)
	public void testEditReportTemplate() throws InsightsCustomException {
		try {
			JsonObject response = insightsAssessmentReportController.editReportTemplate(reportTemplateEdit);
			String actual = response.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 17)
	public void testEditReportTemplateMissingReportId() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.editReportTemplate(reportTemplateEditMissingReportId);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 18)
	public void testEditReportTemplateValidationError() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.editReportTemplate("&amp;" + testData.get("reportTemplateEditValidation").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 19)
	public void testSaveROIReportTemplate() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject response = insightsAssessmentReportController
					.saveReportTemplate(testData.get("reportTemplateROI").toString());
			String actual = response.get("status").getAsString().replace("\"", "");
			reportIdROIString = response.get("data").getAsString().replace("\"", "").replaceAll("[^0-9]", "");
			setOneTimeAssessmentROIReport(reportIdROIString);
			Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 20)
	public void testGetReportTemplate() throws InsightsCustomException {
		try {
			JsonObject reportTemplates = insightsAssessmentReportController.getReportTemplateList();
			Assert.assertNotNull(reportTemplates.get("data"));
			Assert.assertTrue(reportTemplates.getAsJsonArray("data").size() > 0);
			String actual = reportTemplates.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 21)
	public void testGetKPIlistOfReportTemplate() throws InsightsCustomException {
		try {
			JsonObject kpiList = insightsAssessmentReportController.getKPIlist(reportIdString);
			JsonArray kpiArray = kpiList.getAsJsonArray("data");
			Assert.assertNotNull(kpiArray);
			Assert.assertTrue(kpiArray.size() > 0);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 22)
	public void testSaveReportTemplateWithoutKPIDs() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.saveReportTemplate(testData.get("reportTemplateWithoutKPIDs").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 23)
	public void testSaveReportTemplateWithoutExistingKPIDs() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.saveReportTemplate(testData.get("reportTemplateWithoutExistingKPIDs").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 24)
	public void testIncorrectReportTemplate() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.saveReportTemplate(testData.get("incorrectReportTemplate").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 25)
	public void testSaveDailyAssessmentReport() throws InsightsCustomException {
		try {
			JsonObject responseJson = insightsAssessmentReportController.saveAssessmentReport(dailyAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			Assert.assertNotNull(assessment, "Report not found in db");
			int assessmentId = assessment.getReportTemplateEntity().getReportId();
			int templateId = convertStringIntoJson(dailyAssessmentReport).get("reportTemplate").getAsInt();
			Assert.assertEquals(assessmentId, templateId, "Report Template not present in db as expected");
			Long dailyExpectedNextRun = getNextRunTime(InsightsUtils.getCurrentTimeInSeconds(), "DAILY");
			Assert.assertEquals(assessment.getStartDate(), dailyExpectedAssessmentStartDate, "Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), dailyExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), dailyExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 26)
	public void testSaveWeeklyAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController.saveAssessmentReport(weeklyAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			int templateId = convertStringIntoJson(weeklyAssessmentReport).get("reportTemplate").getAsInt();
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), weeklyExpectedAssessmentStartDate, "Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), weeklyExpectedAssessmentEndDate, "End date not equal");
			weeklyExpectedNextRun = getNextRunTime(InsightsUtils.getCurrentTimeInSeconds(), "WEEKLY");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), weeklyExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 27)
	public void testSaveMonthlyAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController.saveAssessmentReport(monthlyAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			int templateId = convertStringIntoJson(monthlyAssessmentReport).get("reportTemplate").getAsInt();
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), monthlyExpectedAssessmentStartDate, "Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), monthlyExpectedAssessmentEndDate, "End date not equal");
			monthlyExpectedNextRun = getNextRunTime(InsightsUtils.getCurrentTimeInSeconds(), "MONTHLY");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), monthlyExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 28)
	public void testSaveQuarterlyAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(quarterlyAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			int templateId = convertStringIntoJson(quarterlyAssessmentReport).get("reportTemplate").getAsInt();
			quarterlyExpectedNextRun = getNextRunTime(InsightsUtils.getCurrentTimeInSeconds(), "QUARTERLY");
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), quarterlyExpectedAssessmentStartDate,
					"Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), quarterlyExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), quarterlyExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 29)
	public void testYearlyQuarterlyAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController.saveAssessmentReport(yearlyAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			int templateId = convertStringIntoJson(yearlyAssessmentReport).get("reportTemplate").getAsInt();
			yearlyExpectedNextRun = getNextRunTime(InsightsUtils.getCurrentTimeInSeconds(), "YEARLY");
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), yearlyExpectedAssessmentStartDate, "Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), yearlyExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), yearlyExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 30)
	public void testSaveOneTimeAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController.saveAssessmentReport(oneTimeAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			int templateId = convertStringIntoJson(oneTimeAssessmentReport).get("reportTemplate").getAsInt();
			oneTimeExpectedAssessmentStartDate = getStartDate("2020-07-01T00:00:00Z");
			oneTimeExpectedAssessmentEndDate = getEndDate("2020-07-03T00:00:00Z");
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), oneTimeExpectedAssessmentStartDate, "Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), oneTimeExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), oneTimeExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
			Assert.assertFalse(assessment.getWorkflowConfig().isReoccurence());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 31)
	public void testSaveROIOneTimeAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(oneTimeAssessmentROIReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			int templateId = convertStringIntoJson(oneTimeAssessmentROIReport).get("reportTemplate").getAsInt();
			oneTimeAssessmentROIReportJson = convertStringIntoJson(oneTimeAssessmentROIReport);
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), oneTimeExpectedAssessmentStartDate, "Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), oneTimeExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), oneTimeExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
			Assert.assertFalse(assessment.getWorkflowConfig().isReoccurence());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 32)
	public void testSaveBiWeeklyAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController.saveAssessmentReport(biWeeklyAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			int templateId = convertStringIntoJson(biWeeklyAssessmentReport).get("reportTemplate").getAsInt();
			biWeeklyExpectedAssessmentStartDate = getStartDate("2020-07-01T00:00:00Z");
			biWeeklyExpectedAssessmentEndDate = 0L;
			biWeeklyExpectedNextRun = getNextRunTime(biWeeklyExpectedAssessmentStartDate, "BI_WEEKLY_SPRINT");
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), biWeeklyExpectedAssessmentStartDate, "Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), biWeeklyExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), biWeeklyExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's nexttask field not assigned -1");
			});
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 33)
	public void testSaveTriWeeklyAssessmentReportWithoutReoccurence()
			throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(triWeeklyAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			int templateId = convertStringIntoJson(triWeeklyAssessmentReport).get("reportTemplate").getAsInt();
			triWeeklyExpectedAssessmentStartDate = getStartDate("2020-06-02T00:00:00Z");
			triWeeklyExpectedAssessmentEndDate = 0L;
			triWeeklyExpectedNextRun = getNextRunTime(triWeeklyExpectedAssessmentStartDate, "TRI_WEEKLY_SPRINT");
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), triWeeklyExpectedAssessmentStartDate,
					"Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), triWeeklyExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), triWeeklyExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's nexttask field not assigned -1");
			});
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 34)
	public void testSaveTriWeeklyAssessmentReportWithDataSource() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(triWeeklyAssessmentReportWithDataSource);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			int templateId = convertStringIntoJson(triWeeklyAssessmentReportWithDataSource).get("reportTemplate")
					.getAsInt();
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			triWeeklyExpectedAssessmentStartDateWithDataSource = getStartDate("2020-06-02T00:00:00Z");
			triWeeklyExpectedAssessmentEndDateWithDataSource = 0L;
			triWeeklyExpectedNextRunWithDataSource = getNextRunTime(triWeeklyExpectedAssessmentStartDate,
					"TRI_WEEKLY_SPRINT");
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(), templateId,
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), triWeeklyExpectedAssessmentStartDate,
					"Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), triWeeklyExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), triWeeklyExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's nexttask field not assigned -1");
			});
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 35)
	public void testSaveAssessmentIncompleteReport() throws InsightsCustomException {
		JsonObject responseJson = insightsAssessmentReportController
				.saveAssessmentReport(testData.get("incorrectAssessmentReport").toString());
		String actual = responseJson.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 36)
	public void testLoadAssessmentReportList() throws InsightsCustomException {
		try {
			String userDetail = "{\"userName\":\"Test_User\"}";
			JsonObject report = insightsAssessmentReportController.getAssessmentReport(userDetail);
			JsonArray reportList = report.getAsJsonArray("data");
			Assert.assertNotNull(reportList);
			Assert.assertTrue(reportList.size() > 0);
		} catch (AssertionError e) {
			log.error(e);
		}
	}

	@Test(priority = 37)
	public void testDeleteAssessmentReport() throws InsightsCustomException {
		try {
			dailyAssessmentReportJson = convertStringIntoJson(dailyAssessmentReport);
			String deleteAssessmentReportConfigId = String.valueOf(reportConfigDAL
					.getAssessmentByAssessmentName(dailyAssessmentReportJson.get("reportName").getAsString()).getId());
			JsonObject response = insightsAssessmentReportController.deleteReport(deleteAssessmentReportConfigId);
			String actual = response.get("status").getAsString();
			Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 38)
	public void testDeleteAssessmentReportWithWrongConfigID() throws InsightsCustomException {
		try {
			JsonObject response = insightsAssessmentReportController.deleteReport(deleteAssessmentReportWrongConfigId);
			String actual = response.get("status").getAsString();
			Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 39)
	public void testGetSchedule() throws InsightsCustomException {
		try {
			JsonArray scheduleRecords = insightsAssessmentReportController.getScheduleList().getAsJsonArray("data");
			Assert.assertNotNull(scheduleRecords);
			Assert.assertTrue(scheduleRecords.size() > 0);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 40)
	public void testUpdateAssessmentReportState() throws InsightsCustomException {
		try {
			int assessmentStateid = reportConfigDAL
					.getAssessmentByAssessmentName(weeklyAssessmentReportJson.get("reportName").getAsString()).getId();
			getInfoAssessmentReportState(assessmentStateid);
			final JsonObject updateAssessmentReportStateJson = convertStringIntoJson(updateAssessmentReportState);
			JsonObject response = insightsAssessmentReportController.updateWebhookStatus(updateAssessmentReportState);
			String status = response.get("status").getAsString();
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(updateAssessmentReportStateJson.get("id").getAsInt());
			Assert.assertEquals(status, PlatformServiceConstants.SUCCESS);
			Assert.assertEquals(assessment.getWorkflowConfig().isActive().booleanValue(),
					updateAssessmentReportStateJson.get("isActive").getAsBoolean());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 41)
	public void testUpdateAssessmentReportIncorrectData() throws InsightsCustomException {
		try {
			JsonObject response = insightsAssessmentReportController
					.updateAssessmentReport(testData.get("updateIncorrectAssessmentReport").toString());
			String actual = response.get("status").getAsString();
			String message = response.get("message").getAsString().replace("\"", "");
			Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
			Assert.assertEquals(message, "No entity found for query");
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 42)
	public void testSaveOneTimeAssessmentReportWithStartDateGreaterThanEndDate()
			throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject assessmentResponse = insightsAssessmentReportController
					.saveAssessmentReport(oneTimeAssessmentReportWithStartDateGreaterThanEndDate);
			String actual = assessmentResponse.get("status").getAsString();
			Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 43)
	public void testSaveDailyEmailAssessmentReport() throws InsightsCustomException {
		try {
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(dailyEmailAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(),
					dailyEmailAssessmentReportJson.get("reportTemplate").getAsInt(),
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), dailyEmailExpectedAssessmentStartDate,
					"Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), dailyEmailExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), dailyEmailExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
			Assert.assertNotNull(assessment.getWorkflowConfig().getEmailConfig(), "Email details not found in db");
			Assert.assertEquals(
					assessment.getWorkflowConfig().getEmailConfig().getSubject(), dailyEmailAssessmentReportJson
							.get("emailDetails").getAsJsonObject().get("mailSubject").getAsString(),
					"Email details not found in db");
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 44)
	public void testSaveDailyWithoutEmailAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(dailywithoutEmailAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(),
					dailywithoutEmailAssessmentReportJson.get("reportTemplate").getAsInt(),
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), dailywithoutEmailExpectedAssessmentStartDate,
					"Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), dailywithoutEmailExpectedAssessmentEndDate,
					"End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), dailywithoutEmailExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
			Assert.assertNull(assessment.getWorkflowConfig().getEmailConfig(), "Email details present in db");
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 45)
	public void testSaveEmailCCAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(dailyEmailCcAssessmentReport);
			JsonObject responseJsonData = responseJson.getAsJsonObject("data");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(responseJsonData.get("assessmentReportId").getAsInt());
			Assert.assertNotNull(assessment, "Report not found in db");
			Assert.assertEquals(assessment.getReportTemplateEntity().getReportId(),
					dailyEmailAssessmentReportJson.get("reportTemplate").getAsInt(),
					"Report Template not present in db as expected");
			Assert.assertEquals(assessment.getStartDate(), dailyEmailCCExpectedAssessmentStartDate,
					"Start Date not equal");
			Assert.assertEquals(assessment.getEndDate(), dailyEmailCCExpectedAssessmentEndDate, "End date not equal");
			Assert.assertEquals(assessment.getWorkflowConfig().getNextRun(), dailyEmailCCExpectedNextRun,
					"Next run not equal");
			Assert.assertTrue(assessment.getWorkflowConfig().getTaskSequenceEntity().size() > 0,
					"Records not present in Workflow Task Sequence table");
			Set<InsightsWorkflowTaskSequence> set = assessment.getWorkflowConfig().getTaskSequenceEntity();
			int noOfTasks = set.size();
			set.forEach(x -> {
				if (x.getSequence() == noOfTasks)
					Assert.assertEquals(x.getNextTask().intValue(), -1, "Last task's next task not assigned -1");
			});
			Assert.assertNotNull(assessment.getWorkflowConfig().getEmailConfig(), "Email details not found in db");
			Assert.assertEquals(
					assessment.getWorkflowConfig().getEmailConfig().getMailCC(), dailyEmailCCAssessmentReportJson
							.get("emailDetails").getAsJsonObject().get("receiverCCEmailAddress").getAsString(),
					"Email details not found in db");
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 46)
	public void testSaveEmailBCCAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			String expectedOutcome = "Assessment Report with the given Report name already exists";
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(dailyEmailBCCAssessmentReport);
			String actualStatus = responseJson.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 47)
	public void testSaveAssessmentReportWithNoReportTemplate() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject responseJson = insightsAssessmentReportController
					.saveAssessmentReport(saveAssessmentReportWithInvalidReportTemplate);
			String actualStatus = responseJson.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.FAILURE);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 48)
	public void testUpdateAssessmentReport() throws InsightsCustomException {
		try {
			assessmentid = reportConfigDAL
					.getAssessmentByAssessmentName(dailyEmailAssessmentReportJson.get("reportName").getAsString())
					.getId();
			getInfoAssessmentReport(assessmentid);
			JsonObject response = insightsAssessmentReportController.updateAssessmentReport(updateAssessmentReport);
			String expectedOutcome = " Assessment Report Id updated " + assessmentid;
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			String actualOutcome = response.get("data").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
			Assert.assertEquals(actualOutcome, expectedOutcome);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 49)
	public void testGrafanaPDFSaveReportTemplate() throws InsightsCustomException, IOException {
		FileInputStream input = null;
		try {
			input = new FileInputStream(tableJson);
			MultipartFile multipartConfigFile = new MockMultipartFile("file", tableJson.getName(), "text/plain",
					IOUtils.toByteArray(input));
			String message = fileManagementService.uploadConfigurationFile(multipartConfigFile, "table", "JSON",
					"GRAFANA_PDF_TEMPLATE", false);
			assessmentService.saveKpiDefinition(registerGrafanakpiJson);
			assessmentService.saveContentDefinition(registerGrafanaContentJson);
			JsonObject response = insightsAssessmentReportController
					.saveReportTemplate(testData.get("grafanaReportTemplate").toString());
			String grafanaReportIdString = response.get("data").getAsString().replace("\"", "").replaceAll("[^0-9]",
					"");
			grafanaReportId = Integer.parseInt(grafanaReportIdString);
			getGrafanaAssessmentReport(grafanaReportId);
			InsightsAssessmentReportTemplate report = (InsightsAssessmentReportTemplate) reportConfigDAL
					.getReportTemplateByReportId(grafanaReportId);
			assessmentReportDataInit();
			Assert.assertNotNull(report);
			Assert.assertTrue(report.getReportsKPIConfig().size() > 0);
		} catch (AssertionError | IOException e) {
			Assert.fail(e.getMessage());
		} finally {
			input.close();
		}
	}

	@Test(priority = 50)
	public void testGetAllReportTitles() throws InsightsCustomException {
		try {
			String expectedStatus = "success";
			String userName = "{\"userName\":\"Test_User\"}";

			JsonObject response = insightsEmailConfigurationController.getAllReportTitles(REPORT_SOURCE, userName);
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			JsonArray reportTitleList = response.get("data").getAsJsonArray();

			Assert.assertEquals(actualStatus, expectedStatus);
			Assert.assertNotNull(reportTitleList);
			Assert.assertTrue(reportTitleList.size() > 0);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 51)
	public void testGrafanaPDFSaveAssessmentReport() throws InsightsCustomException, InterruptedException {
		Thread.sleep(5000);
		try {
			JsonObject response = deleteGrafanaAPIToken(
					getGrafanaOrgId(grafanaAssessmentReportJson.get("userName").getAsString()));
			JsonObject responseJson = insightsAssessmentReportController.saveAssessmentReport(grafanaAssessmentReport);
			String actualStatus = responseJson.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 52)
	public void testUpdateAssessmentReportGrafanaPdf() throws InsightsCustomException, InterruptedException {
		Thread.sleep(5000);
		try {
			assessmentid = reportConfigDAL
					.getAssessmentByAssessmentName(grafanaAssessmentReportJson.get("reportName").getAsString()).getId();
			getInfoGrafanaAssessmentReport(assessmentid);
			JsonObject response = insightsAssessmentReportController
					.updateAssessmentReport(updateGrafanaAssessmentReport);
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.FAILURE);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 53)
	public void testSetRetryStatus() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject assessmentResponse = insightsAssessmentReportController
					.saveAssessmentReport(dailyRestartAssessmentReportStr);
			JsonObject assessmentResponseData = assessmentResponse.getAsJsonObject("data");
			int configId = reportConfigDAL
					.getAssessmentByAssessmentName(dailyRestartAssessmentReport.get("reportName").getAsString())
					.getId();
			setRetryStatusJson(configId);
			String status = insightsAssessmentReportController.setWorkflowStatus(retryJson).get("status").getAsString()
					.replace("\"", "");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(Integer.valueOf(configId));
			Assert.assertEquals(status, PlatformServiceConstants.SUCCESS);
			Assert.assertEquals(assessment.getWorkflowConfig().getStatus(), "RESTART");
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 54)
	public void setWorkflowStatusValidationError() throws InsightsCustomException, InterruptedException {
		JsonObject response = insightsAssessmentReportController.setWorkflowStatus(retryJsonValidation);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 55)
	public void testRunImmediateStatus() throws InsightsCustomException, InterruptedException {
		Thread.sleep(1000);
		try {
			JsonObject assessmentResponse = insightsAssessmentReportController
					.saveAssessmentReport(dailyRunImmediateAssessmentReportStr);
			JsonObject assessmentResponseData = assessmentResponse.getAsJsonObject("data");
			int configId = reportConfigDAL
					.getAssessmentByAssessmentName(dailyRunImmediateAssessmentReport.get("reportName").getAsString())
					.getId();
			String retryJson = "{\"configId\":" + configId + ",\"runimmediate\":true}";
			String status = insightsAssessmentReportController.setWorkflowStatus(retryJson).get("status").getAsString()
					.replace("\"", "");
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByConfigId(Integer.valueOf(configId));
			Assert.assertEquals(status, PlatformServiceConstants.SUCCESS);
			Assert.assertTrue(assessment.getWorkflowConfig().isRunImmediate());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 56)
	public void testGrafanaPDFUpdateReportTemplate() throws InsightsCustomException {
		try {
			grafanaPDFreportTemplateJson.addProperty("reportId", grafanaReportId);
			String editGrafanaReport = grafanaPDFreportTemplateJson.toString();
			JsonObject response = insightsAssessmentReportController.editReportTemplate(editGrafanaReport);
			String grafanaReportIdString = response.get("data").getAsString().replace("\"", "").replaceAll("[^0-9]",
					"");
			int grafanaReportId = Integer.parseInt(grafanaReportIdString);
			InsightsAssessmentReportTemplate report = (InsightsAssessmentReportTemplate) reportConfigDAL
					.getReportTemplateByReportId(grafanaReportId);
			assessmentReportDataInit();
			Assert.assertNotNull(report);
			Assert.assertTrue(report.getReportsKPIConfig().size() > 0);
			Assert.assertNotEquals(grafanaReportId, -1);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 57)
	public void testUpdateKpiDefinition() throws InsightsCustomException {
		try {
			JsonObject updatekpiJson = convertStringIntoJson(testData.get("updatekpiString").toString());
			JsonObject response = insightsAssessmentReportController
					.updateKpiDefinition(testData.get("updatekpiString").toString());
			InsightsKPIConfig kpi = reportConfigDAL.getKPIConfig(updatekpiJson.get("kpiId").getAsInt());
			Assert.assertNotNull(kpi);
			Assert.assertNotNull(kpi.getKpiId());
			Assert.assertEquals(kpi.getKpiId().intValue(), updatekpiJson.get("kpiId").getAsInt());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 58)
	public void testDeleteKpiDefinition() throws InsightsCustomException {
		try {
			JsonObject deleteKpijson = convertStringIntoJson(testData.get("deleteKpiString").toString());
			String expectedMessage = "KPI definition attached to report template";
			JsonObject response = insightsAssessmentReportController
					.deleteKpiDefinition(testData.get("deleteKpiString").toString());
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			String actualOutcome = response.get("message").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.FAILURE);
			Assert.assertEquals(actualOutcome, expectedMessage);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 59)
	public void testUpdateContentDefinition() throws InsightsCustomException {
		try {
			JsonObject updateContentJson = convertStringIntoJson(testData.get("updateContentString").toString());
			JsonObject response = insightsAssessmentReportController
					.updateContentDefinition(testData.get("updateContentString").toString());
			JsonObject response1 = insightsAssessmentReportController
					.updateContentDefinition(testData.get("updateContentString1").toString());
			JsonObject response2 = insightsAssessmentReportController
					.updateContentDefinition(testData.get("updateContentString2").toString());
			InsightsKPIConfig kpi = reportConfigDAL.getKPIConfig(updateContentJson.get("kpiId").getAsInt());
			Assert.assertNotNull(kpi);
			Assert.assertNotNull(kpi.getKpiId());
			Assert.assertEquals(kpi.getKpiId().intValue(), updateContentJson.get("kpiId").getAsInt());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 60)
	public void testDeleteContentDefinition() throws InsightsCustomException {
		try {
			String deleteContentRequest = "{\"contentId\":10541}";
			JsonObject deleteContentRequestJson = convertStringIntoJson(deleteContentRequest);
			JsonObject response = insightsAssessmentReportController.deleteContentDefinition(deleteContentRequest);
			String contentId = deleteContentRequestJson.get("contentId").getAsString();
			String expectedOutcome = "Content definition deleted for ContentId " + contentId;
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			String actualOutcome = response.getAsJsonObject("data").get("message").getAsString();
			Assert.assertEquals(actualOutcome, expectedOutcome);
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 61)
	public void testDeleteContentDefinitionValidation() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.deleteContentDefinition("&amp;" + testData.get("deleteContentRequestValidation").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 62)
	public void testSetReportTemplateStatus() throws InsightsCustomException {
		try {
			JsonObject response = insightsAssessmentReportController.setReportTemplateStatus(setReportTemplateStatus);
			String expectedOutcome = "Report Template Id " + reportIdString + " status changed successfully ";
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			String actualOutcome = response.get("data").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
			Assert.assertEquals(actualOutcome, expectedOutcome);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 63)
	public void testUploadReportTemplateDesignFiles()
			throws InsightsCustomException, NumberFormatException, IOException {
		try {
			JsonObject response = insightsAssessmentReportController.uploadReportTemplateDesignFiles(
					readReportTemplateDesignFiles(4, templateDesignFilesArray), Integer.parseInt(reportIdString));
			String expectedOutcome = "File uploaded";
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			String actualOutcome = response.get("data").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
			Assert.assertEquals(actualOutcome, expectedOutcome);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 64)
	public void testUploadReportTemplateDesignException()
			throws InsightsCustomException, NumberFormatException, IOException {
		try {
			JsonObject response = insightsAssessmentReportController.uploadReportTemplateDesignFiles(
					readReportTemplateDesignFiles(1, templateDesignFilesArrayError), Integer.parseInt(reportIdString));
			Assert.assertEquals(response.get("status").getAsString().replace("\"", ""),
					PlatformServiceConstants.FAILURE);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 65)
	public void testGetAllReportTemplateList() throws InsightsCustomException {
		try {
			JsonObject response = insightsAssessmentReportController.getAllReportTemplateList();
			JsonArray reportTemplateList = response.getAsJsonArray("data");
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
			Assert.assertNotNull(reportTemplateList);
			Assert.assertFalse(reportTemplateList.isEmpty());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 66)
	public void testDeleteKpiDefinitionFail() throws InsightsCustomException {
		try {
			String expectedMessage = "KPI definition attached to report template";
			JsonObject response = insightsAssessmentReportController
					.deleteKpiDefinition(testData.get("deleteKpiStringFail").toString());
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			String actualOutcome = response.get("message").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.FAILURE);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 67)
	public void testDeleteKpiDefinitionFailException() throws InsightsCustomException {
		try {
			String expectedMessage = "KPI definition attached to report template";
			JsonObject response = insightsAssessmentReportController
					.deleteKpiDefinition(testData.get("deleteKpiStringFailException").toString());
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.FAILURE);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 68)
	public void testUpdateKpiDefinitionFail() throws InsightsCustomException {
		try {
			JsonObject updatekpiJson = convertStringIntoJson(testData.get("updatekpiStringFail").toString());
			JsonObject response = insightsAssessmentReportController
					.updateKpiDefinition(testData.get("updatekpiStringFail").toString());
			InsightsKPIConfig kpi = reportConfigDAL.getKPIConfig(updatekpiJson.get("kpiId").getAsInt());
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 69)
	public void testUploadKPIInDatabase1() throws InsightsCustomException, IOException {
		try (FileInputStream input = new FileInputStream(kpiFileNoData)) {
			String expectedOutcome = "No KPI defination found in request json";
			MultipartFile multipartFile = new MockMultipartFile("file", kpiFileNoData.getName(), "text/plain",
					IOUtils.toByteArray(input));
			JsonObject response = insightsAssessmentReportController.saveBulkKpiDefinition(multipartFile);
			readFileAndgetKpiIdList(kpiFileNoData.getName());
			String actual = response.get("data").getAsString().replace("\"", "");
			Assert.assertEquals(actual, expectedOutcome);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 70)
	public void testGetReportTemplateKpiDetails() throws InsightsCustomException, IOException {
		try {
			JsonObject response = insightsAssessmentReportController
					.getReportTemplateKpiDetails(String.valueOf(grafanaReportId));
			String actual = response.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 71)
	public void testGetReportTemplateKpiDetailsFail() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.getReportTemplateKpiDetails(reportIdString);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 72)
	public void testLoadAssessmentReportList1() throws InsightsCustomException {
		String userDetail = "{\"userNamererr\":\"Test_Userrrrr\"}";
		JsonObject report = insightsAssessmentReportController.getAssessmentReport(userDetail);
		String actualStatus = report.get("status").getAsString().replace("\"", "");
		JsonArray reportList = report.getAsJsonArray("data");
		Assert.assertEquals(actualStatus, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 72)
	public void testSaveReportTemplateDuplicate() throws InsightsCustomException {
		try {
			JsonObject response = insightsAssessmentReportController.saveReportTemplate(reportTemplateDuplicate);
			String actual = response.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 74)
	public void testUpdateAssessmentReportStateFail() throws InsightsCustomException {
		final JsonObject updateAssessmentReportStateJson = convertStringIntoJson(updateAssessmentReportStateFail);
		JsonObject response = insightsAssessmentReportController.updateWebhookStatus(updateAssessmentReportStateFail);
		String status = response.get("status").getAsString();
		Assert.assertEquals(status, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 75)
	public void testsaveKpiDefinitionValidationError() throws InsightsCustomException, IOException {
		JsonObject response = insightsAssessmentReportController
				.saveKpiDefinition("&amp;" + testData.get("registerkpiValidation").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 76)
	public void testsaveContentDefinitionValidationError() throws InsightsCustomException, IOException {
		JsonObject response = insightsAssessmentReportController
				.saveContentDefinition("&amp;" + testData.get("registerContentValiation").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 77)
	public void testSaveAssessmentReportValidationError() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.saveAssessmentReport(AssessmentReportValidation);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 78)
	public void testUpdateAssessmentReportValidationError() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.updateAssessmentReport(AssessmentReportValidation);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 79)
	public void testsaveReportTemplateValidationError() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.saveReportTemplate("&amp;" + testData.get("reportTemplateValidation").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 80)
	public void testSetReportTemplateStatusFail() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.setReportTemplateStatus(testData.get("setReportTemplateStatusWrongId").toString());
		String actualStatus = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actualStatus, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 81)
	public void testSetReportTemplateStatusValidationError() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.setReportTemplateStatus(setReportTemplateStatusValidation);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 82)
	public void testDeleteReportTemplateBeforeDeleteAssessmentReport() throws InsightsCustomException {
		int id = Integer.parseInt(reportIdString);
		JsonObject response = insightsAssessmentReportController.deleteReportTemplate(deleteReportTemplate);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 83)
	public void testDeleteAllAssessmentReport() throws InsightsCustomException {
		List<String> assessmentReportNames = Arrays.asList(weeklyAssessmentReportJson.get("reportName").getAsString(),
				monthlyAssessmentReportJson.get("reportName").getAsString(),
				quarterlyAssessmentReportJson.get("reportName").getAsString(),
				yearlyAssessmentReportJson.get("reportName").getAsString(),
				oneTimeAssessmentReportJson.get("reportName").getAsString(),
				oneTimeAssessmentROIReportJson.get("reportName").getAsString(),
				biWeeklyAssessmentReportJson.get("reportName").getAsString(),
				triWeeklyAssessmentReportJson.get("reportName").getAsString(),
				triWeeklyAssessmentWithDataSourceReportJson.get("reportName").getAsString(),
				dailyEmailAssessmentReportJson.get("reportName").getAsString(),
				dailyEmailCCAssessmentReportJson.get("reportName").getAsString(),
				dailyEmailBCCAssessmentReportJson.get("reportName").getAsString(),
				dailywithoutEmailAssessmentReportJson.get("reportName").getAsString(),
				dailyRestartAssessmentReport.get("reportName").getAsString(),
				dailyRunImmediateAssessmentReport.get("reportName").getAsString(),
				grafanaAssessmentReportJson.get("reportName").getAsString());
		List<String> assessmentReportDeleteResponse = new ArrayList<String>();
		for (String assessmentReport : assessmentReportNames) {
			InsightsAssessmentConfiguration assessment = reportConfigDAL
					.getAssessmentByAssessmentName(assessmentReport.trim());
			String workflowID = assessment.getWorkflowConfig().getWorkflowId();
			workflowConfigDAL.deleteWorkflowTaskSequence(workflowID);
			String deleteAssessmentReportConfigId1 = String
					.valueOf(reportConfigDAL.getAssessmentByAssessmentName(assessmentReport).getId());
			JsonObject deleteResponse = insightsAssessmentReportController
					.deleteReport(deleteAssessmentReportConfigId1);
			String deleteResponseActual = deleteResponse.get("status").getAsString();
			assessmentReportDeleteResponse.add(deleteResponseActual);
		}
		Assert.assertEquals(false, assessmentReportDeleteResponse.contains("failure"));
	}

	@Test(priority = 84)
	public void testUploadReportTemplate() throws InsightsCustomException, IOException {
		try (FileInputStream input = new FileInputStream(file)) {
			MultipartFile multipartFile = new MockMultipartFile("file", file.getName(), "text/plain",
					IOUtils.toByteArray(input));
			JsonObject response = insightsAssessmentReportController.uploadReportTemplate(multipartFile);
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			String reportIdGenerated = response.get("data").getAsString().replace("\"", "").replaceAll("[^0-9]", "");
			deleteUploadedReportTemplate(Integer.parseInt(reportIdGenerated));
			JsonObject deleteResponse = insightsAssessmentReportController
					.deleteReportTemplate(deleteUploadedReportTemplate);
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 85)
	public void testDeleteReportTemplateAfterDeleteAssessmentReport() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.deleteReportTemplate(deleteReportTemplate);
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
	}

	@Test(priority = 86)
	public void testDeleteGrafanaToken() throws InsightsCustomException, InterruptedException {
		JsonObject response = deleteGrafanaAPIToken(
				getGrafanaOrgId(grafanaAssessmentReportJson.get("userName").getAsString()));
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
		Thread.sleep(5000);
	}

	@Test(priority = 87)
	public void testGetChartType() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.getChartType();
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
	}

	@Test(priority = 88)
	public void testGetVisualizationUtil() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.getVisualizationUtil();
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
	}

	@Test(priority = 89)
	public void testGetTemplateType() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.getTemplateType();
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
	}

	@Test(priority = 90)
	public void testGetAllActiveContentList() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.getAllActiveContentList();
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
	}

	@Test(priority = 91)
	public void testGetContentAction() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController.getContentAction();
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
	}

	@Test(priority = 92)
	public void testUpdateContentDefinitionValidationError() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.updateContentDefinition("&amp;" + testData.get("updateContentStringValidation").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 93)
	public void testDeleteKpiDefinitionValidationError() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.deleteKpiDefinition("&amp;" + testData.get("deleteKpiStringValidation").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 94)
	public void testDeleteKpiDefinitionAfterReportTemplateDelete() throws InsightsCustomException {
		try {
			JsonObject deleteKpijson = convertStringIntoJson(testData.get("deleteKpiString").toString());
			JsonObject response = insightsAssessmentReportController
					.deleteKpiDefinition(testData.get("deleteKpiString").toString());
			String actualStatus = response.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actualStatus, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 95)
	public void testUpdateKpiDefinitionValidationError() throws InsightsCustomException {
		JsonObject response = insightsAssessmentReportController
				.updateKpiDefinition("&amp;" + testData.get("updatekpiStringValidation").toString());
		String actual = response.get("status").getAsString().replace("\"", "");
		Assert.assertEquals(actual, PlatformServiceConstants.FAILURE);
	}

	@Test(priority = 96)
	public void testGetReportTemplateCheck() throws InsightsCustomException {
		try {
			JsonObject response1 = insightsAssessmentReportController.deleteReportTemplate(deleteGrafanaReportTemplate);
			JsonObject response2 = insightsAssessmentReportController.deleteReportTemplate(deleteROIReportTemplate);
			JsonObject reportTemplates = insightsAssessmentReportController.getReportTemplateList();
			String actual = reportTemplates.get("status").getAsString().replace("\"", "");
			Assert.assertEquals(actual, PlatformServiceConstants.SUCCESS);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 97)
	public void testCreateOrgAndSaveDashboardInGrafana() throws InsightsCustomException {
		try {
			deleteGrafanaOrgId(String.valueOf(getGrafanaOrgId(username)));
			GrafanaUtilities.createOrgAndSaveDashboardInGrafana(testData.get("sampleDashboard").getAsJsonObject(),
					username);
			Assert.assertEquals(String.valueOf(getGrafanaOrgId(username)).isEmpty(), false);
			deleteGrafanaOrgId(String.valueOf(getGrafanaOrgId(username)));
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@Test(priority = 98)
	public void refreshGrafanaTokenForDifferentOrgs() throws InsightsCustomException {
		try {
			int[] orgIds = { 1, 2, 3 };
			for (int id : orgIds) {
				GrafanaUtilities.refreshGrafanaToken(id);
				deleteGrafanaAPIToken(id);
			}
			Assert.assertTrue(true);
		} catch (AssertionError e) {
			Assert.fail(e.getMessage());
		}
	}

	@AfterClass
	public void cleanUp() {
		// deleteTask
		try {
			InsightsWorkflowTask tasks = workflowConfigDAL.getTaskbyTaskDescription("KPI_Execute_service_test");
			int taskID = tasks.getTaskId();
			workflowConfigDAL.deleteTask(taskID);
		} catch (Exception e) {
			log.error("Error cleaning up at AssessmentReportsServiceTest KPIWorkflow Task", e);
		}
		try {
			InsightsWorkflowTask pdftasks = workflowConfigDAL.getTaskbyTaskDescription("PDF_Execute_service_test");
			int pdftaskID = pdftasks.getTaskId();
			workflowConfigDAL.deleteTask(pdftaskID);
		} catch (Exception e) {
			log.error("Error cleaning up at AssessmentReportsServiceTest PDFWorkflow Task", e);
		}
		try {
			InsightsWorkflowTask emailtasks = workflowConfigDAL.getTaskbyTaskDescription("Email_Execute_service_test");
			int emailtaskID = emailtasks.getTaskId();
			workflowConfigDAL.deleteTask(emailtaskID);
		} catch (Exception e) {
			log.error("Error cleaning up at AssessmentReportsServiceTest EmailWorkflow Task", e);
		}

		// Delete Content
		try {
			reportConfigDAL.deleteContentbyContentID(registerContentJson.get("contentId").getAsInt());
			reportConfigDAL.deleteContentbyContentID(registerGrafanaContentJson.get("contentId").getAsInt());
		} catch (Exception e) {
			log.error("Error cleaning up at AssessmentReportsServiceTest Content record", e);
		}

		// Delete KPI
		try {
			reportConfigDAL.deleteKPIbyKpiID(registerkpiJson.get("kpiId").getAsInt());
			reportConfigDAL.deleteKPIbyKpiID(registerROIkpiJson.get("kpiId").getAsInt());
			reportConfigDAL.deleteKPIbyKpiID(registerGrafanakpiJson.get("kpiId").getAsInt());
		} catch (Exception e) {
			log.error("Error cleaning up at AssessmentReportsServiceTest KPI record", e);
		}
		// Delete bulk Content
		for (int element : contentIdList) {
			try {
				reportConfigDAL.deleteContentbyContentID(element);
			} catch (Exception e) {
				log.error("Error cleaning up at AssessmentReportsServiceTest Bulk Content record", e);
			}
		}
		// Delete bulk kpi

		for (int element : kpiIdList) {
			try {
				reportConfigDAL.deleteKPIbyKpiID(element);
			} catch (Exception e) {
				log.error("Error cleaning up at AssessmentReportsServiceTest Bulk KPI record", e);
			}
		}

		// Delete vType json
		try {
			fileManagementService.deleteConfigurationFile("table");
		} catch (InsightsCustomException e) {
			log.error("Error cleaning up at AssessmentReportsServiceTest vType Json", e);
		}
	}
}
