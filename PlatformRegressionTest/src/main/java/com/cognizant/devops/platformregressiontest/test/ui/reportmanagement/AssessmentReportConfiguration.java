/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
package com.cognizant.devops.platformregressiontest.test.ui.reportmanagement;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.cognizant.devops.platformregressiontest.test.common.LoginAndSelectModule;

public class AssessmentReportConfiguration extends LoginAndSelectModule {

	private static final Logger log = LogManager.getLogger(AssessmentReportConfiguration.class);

	@FindBy(xpath = "//mat-icon[@title='Add']")
	WebElement addButton;

	@FindBy(xpath = "//div[contains(text(),'Add Report')]")
	WebElement addReport;

	@FindBy(xpath = "//input[@placeholder='Enter a report name']")
	WebElement reportName;

	@FindBy(xpath = "//input[@placeholder='Enter a Report Title']")
	WebElement titleName;

	@FindBy(xpath = "//mat-select[@placeholder='Select report template']")
	static WebElement reportTemplateDropDown;

	@FindBy(xpath = "//span[contains(@class,'mat-option-text')]")
	private List<WebElement> reportTemplateList;

	@FindBy(xpath = "//mat-select[@name='schedule']")
	WebElement frequencyDropDown;

	@FindBy(xpath = "//span[contains(@class, 'mat-option-text')]")
	private List<WebElement> frequencyNameList;

	// div[contains(@class, 'mat-calendar-arrow')]
	@FindBy(xpath = "//div[@class='mat-calendar-arrow']")
	WebElement selectYearArrowButton;

	@FindBy(xpath = "//div[contains(@class, 'mat-calendar-body-cell')]")
	private List<WebElement> yearList;

	@FindBy(xpath = "//div[contains(@class, 'mat-calendar-invert')]")
	WebElement selectMonthArrowButton;

	@FindBy(xpath = "//div[contains(@class, 'mat-calendar-body-cell-content')]")
	private List<WebElement> monthList;

	@FindBy(xpath = "//div[contains(@class, 'mat-calendar-body-cell-content')]")
	private List<WebElement> dateList;

	@FindBy(xpath = "//mat-icon[@title= 'Add Tasks']")
	WebElement addTaskButton;

	@FindBy(xpath = "(//div[@id='fromAllTaskList'])[1]")
	WebElement kpiTask;

	@FindBy(xpath = "//span[text()=' ADD ']")
	WebElement taskaddButton;

	@FindBy(xpath = "(//div[@id='fromAllTaskList'])[2]")
	WebElement pdfTask;

	@FindBy(xpath = "//mat-icon[@title='Add Email']")
	WebElement clickMailingDetails;

	@FindBy(xpath = "//input[@name='senderEmailAddress']")
	WebElement mailFrom;

	@FindBy(xpath = "//textarea[@name='receiverEmailAddress']")
	WebElement mailTo;

	@FindBy(xpath = "//textarea[@name='receiverCCEmailAddress']")
	WebElement ccReceiverMailAddress;

	@FindBy(xpath = "//textarea[@name='receiverBCCEmailAddress']")
	WebElement bccReceiverMailAddress;

	@FindBy(xpath = "//input[@name='mailSubject']")
	WebElement mailSubject;

	@FindBy(xpath = "//textarea[@name='mailBodyTemplate']")
	WebElement mailBodyTemplate;

	@FindBy(xpath = "(//button[contains(@class,'configureBut mat-raised-button')])[2]")
	WebElement addMail;

	@FindBy(xpath = "//mat-icon[@title='Save']")
	WebElement saveButton;

	@FindBy(xpath = "//div[contains(@class, 'gridheadercenter')]")
	WebElement saveReportConfirmationMessage;

	@FindBy(xpath = "//span[text()= 'YES']")
	WebElement yesButton;

	@FindBy(xpath = "//div[text()= ' Success ']")
	WebElement successMessage;

	@FindBy(xpath = "//button[contains(@class,'mat-raised-button')]")
	WebElement okButton;

	@FindBy(xpath = "//div[@class = 'sectionHeadingStyle']")
	WebElement reportsLandingPage;

	@FindBy(xpath = "//td[contains(@class, 'reportName')]")
	List<WebElement> reportsNameList;

	@FindBy(xpath = "//div[contains(@class, 'mat-radio-ripple mat-ripple')]")
	private List<WebElement> radioButtonsList;

	@FindBy(xpath = "//mat-icon[@title='Edit ']")
	WebElement clickEditButton;

	@FindBy(xpath = "//mat-icon[@title='Activate report and run immediately']")
	WebElement immiediateRunButton;

	@FindBy(xpath = "//div[text()=' Start Report Execution ']")
	WebElement immediateRunConfirmMessage;

	@FindBy(xpath = "//span[text() ='YES']")
	WebElement immediateRunClickYes;

	@FindBy(xpath = "//div[text() =' Success ']")
	WebElement immediateRunSuccess;

	@FindBy(xpath = "//span[text() ='OK']")
	WebElement immediateRunOk;

	@FindBy(xpath = "//div[text()=' Update Active/Inactive State ']")
	WebElement confirmationMessage;

	@FindBy(xpath = "//span[text()='YES']")
	WebElement clickYes;

	@FindBy(xpath = "//mat-icon[@title='Delete ']")
	WebElement clickDelete;

	@FindBy(xpath = "//span[text()='OK']")
	WebElement clickOk;

	static String reportTemplateName = LoginAndSelectModule.testData.get("sprintScoreCardTemplate");
	String frequencyName = LoginAndSelectModule.testData.get("frequencyName");
	String year = LoginAndSelectModule.testData.get("year");
	String month = LoginAndSelectModule.testData.get("month");
	String date = LoginAndSelectModule.testData.get("date");

	public AssessmentReportConfiguration() {
		PageFactory.initElements(driver, this);
	}

	public void clickAddButton() {

		driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
		addButton.click();
		driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
	}

	public boolean navigateToaddReportConfirmation() {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		return saveReportConfirmationMessage.isDisplayed();

	}

	public boolean navigateToaddReportSuccess() {

		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		return successMessage.isDisplayed();
	}

	public boolean navigateToReportsLandingPage() {

		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		return reportsLandingPage.isDisplayed();
	}

	public boolean addNewReport() {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		clickAddButton();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		reportName.sendKeys(LoginAndSelectModule.testData.get("reportName"));
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		titleName.sendKeys(LoginAndSelectModule.testData.get("title"));
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		try {
			selectReportTemplate(reportTemplateName);
			Thread.sleep(2000);
			if (((frequencyName).equals(LoginAndSelectModule.testData.get("oneTimeFrequency")))
					|| ((frequencyName).equals(LoginAndSelectModule.testData.get("BiWeeklyFrequency")))
					|| ((frequencyName).equals(LoginAndSelectModule.testData.get("triWeeklyFrequency")))) {
				selectFrequency(frequencyName);
				Thread.sleep(2000);
				driver.manage().timeouts().implicitlyWait(3600, TimeUnit.SECONDS);
				clickCalender();
				Thread.sleep(2000);
				driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
				selectYear(year);
				Thread.sleep(2000);
				driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
				selectMonth(month);
				Thread.sleep(2000);
				driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
				selectDate(date);
				Thread.sleep(2000);
			} else {
				selectFrequency(frequencyName);
			}
			Thread.sleep(2000);
			driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
			dragAndDropTask();
			driver.manage().timeouts().implicitlyWait(2400, TimeUnit.SECONDS);
			addMaildetails();
			driver.manage().timeouts().implicitlyWait(4000, TimeUnit.SECONDS);
			Thread.sleep(2000);
			saveButton.click();
			Thread.sleep(2000);
			driver.manage().timeouts().implicitlyWait(4000, TimeUnit.SECONDS);
			navigateToaddReportConfirmation();
			driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
			clickYesButton();
			driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
			navigateToaddReportSuccess();
			driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
			okButton.click();
			driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);

		} catch (Exception e) {

			log.error("Please fill the mendatory fields", e);
		}

		return verifyReportName(LoginAndSelectModule.testData.get("reportName"));
	}

	public boolean immediateReportRun() {

		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		selectReport();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		immiediateRunButton.click();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		immediateRunConfirmMessage.isDisplayed();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		immediateRunClickYes.click();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		immediateRunSuccess.isDisplayed();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		immediateRunOk.click();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		return reportsLandingPage.isDisplayed();
	}

	public boolean inActiveReport() throws InterruptedException {

		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		selectReport();
		Thread.sleep(2000);
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		clickToggleButton();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		confirmationMessage.click();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		Thread.sleep(2000);
		clickYes.click();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		return reportsLandingPage.isDisplayed();

	}

	public boolean editReport() throws InterruptedException {
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		selectReport();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		clickEditButton.click();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		addTaskButton.click();
		Thread.sleep(2000);
		WebElement emailExecutionTaskSource = driver.findElement(By.xpath("(//div[@id='fromSelectedTaskList'])[3]"));
		WebElement taskExecutionDestination = driver.findElement(By.xpath("(//div[@class='container'])[1]"));
		driver.manage().timeouts().implicitlyWait(5000, TimeUnit.SECONDS);
		Thread.sleep(2000);
		Actions act = new Actions(driver);
		act.dragAndDrop(emailExecutionTaskSource, taskExecutionDestination).build().perform();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		Thread.sleep(2000);
		for (int i = 0; i <= 2; i++) {
			try {
				taskaddButton.click();
				break;
			} catch (Exception e) {
				log.error(e.getMessage());
			}
		}

		Thread.sleep(2000);
		saveButton.click();
		Thread.sleep(2000);
		driver.manage().timeouts().implicitlyWait(4000, TimeUnit.SECONDS);
		navigateToaddReportConfirmation();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		clickYesButton();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		navigateToaddReportSuccess();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		okButton.click();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		return reportsLandingPage.isDisplayed();
	}

	public boolean deleteReport() {
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		selectReport();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		clickDelete.click();
		driver.manage().timeouts().implicitlyWait(10000, TimeUnit.SECONDS);
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		clickYesButton();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		clickOk.click();
		return reportsLandingPage.isDisplayed();

	}

	private void clickYesButton() {
		for (int i = 0; i <= 3; i++) {
			try {
				yesButton.click();
				driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
				break;
			} catch (Exception e) {
				log.error(e.getMessage());
			}
		}
	}

	public void selectReportTemplate(String reportTemplateName) throws InterruptedException {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		reportTemplateDropDown.click();
		Thread.sleep(2000);
		List<WebElement> templateList = reportTemplateList;
		for (WebElement temaplateName : templateList) {
			if (temaplateName.getText().equals(reportTemplateName)) {
				temaplateName.click();
				break;
			}
		}

	}

	private String selectFrequency(String frequencyName) throws InterruptedException {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		frequencyDropDown.click();
		Thread.sleep(2000);
		List<WebElement> frequencyList = frequencyNameList;
		for (WebElement frequency : frequencyList) {
			if (frequency.getText().equals(frequencyName)) {
				frequency.click();
				break;
			}
		}
		return frequencyName;

	}

	public void clickCalender() {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		driver.findElement(By.xpath("//button[contains(@aria-label,'Open calendar')]")).click();

	}

	public void selectYear(String year) {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		selectYearArrowButton.click();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		List<WebElement> requiredYear = yearList;
		for (WebElement yearSelected : requiredYear) {
			if (yearSelected.getText().equals(year)) {
				yearSelected.click();
				break;
			}
		}

	}

	public void selectMonth(String month) {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		List<WebElement> requiredMonth = monthList;
		for (WebElement selectedMonth : requiredMonth) {
			if (selectedMonth.getText().equals(month)) {
				selectedMonth.click();
				break;
			}
		}

	}

	public void selectDate(String date) {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		List<WebElement> requiredDate = dateList;
		for (WebElement selectedDate : requiredDate) {
			if (selectedDate.getText().equals(date)) {
				selectedDate.click();
				break;
			}
		}
	}

	private void dragAndDropTask() throws InterruptedException {
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		addTaskButton.click();
		WebElement kpiExecutionTaskSource = driver.findElement(By.xpath("(//div[@id='fromAllTaskList'])[1]"));
		WebElement pdfExecutionTaskSource = driver.findElement(By.xpath("(//div[@id='fromAllTaskList'])[2]"));
		WebElement emailExecutionTaskSource = driver.findElement(By.xpath("(//div[@id='fromAllTaskList'])[3]"));
		WebElement taskExecutionDestination = driver.findElement(By.xpath("(//div[@class='container'])[2]"));

		Actions act = new Actions(driver);

		act.dragAndDrop(kpiExecutionTaskSource, taskExecutionDestination).build().perform();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		act.dragAndDrop(pdfExecutionTaskSource, taskExecutionDestination).build().perform();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		act.dragAndDrop(emailExecutionTaskSource, taskExecutionDestination).build().perform();
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		Thread.sleep(2000);
		taskaddButton.click();

	}

	private void addMaildetails() throws InterruptedException {

		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		clickMailingDetails.click();
		driver.manage().timeouts().implicitlyWait(4000, TimeUnit.SECONDS);
		mailFrom.sendKeys(LoginAndSelectModule.testData.get("mailFrom"));
		driver.manage().timeouts().implicitlyWait(2400, TimeUnit.SECONDS);
		mailTo.sendKeys(LoginAndSelectModule.testData.get("mailTo"));
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		ccReceiverMailAddress.sendKeys(LoginAndSelectModule.testData.get("ccMail"));
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		bccReceiverMailAddress.sendKeys(LoginAndSelectModule.testData.get("bccMail"));
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		mailSubject.sendKeys(LoginAndSelectModule.testData.get("subject"));
		driver.manage().timeouts().implicitlyWait(1200, TimeUnit.SECONDS);
		mailBodyTemplate.sendKeys(LoginAndSelectModule.testData.get("bodyTemplate"));
		Thread.sleep(2000);
		addMail.click();
		driver.manage().timeouts().implicitlyWait(4000, TimeUnit.SECONDS);
	}

	public boolean verifyReportName(String report) {
		boolean isReportName = false;
		for (int i = 0; i < reportsNameList.size(); i++) {
			if (reportsNameList.get(i).getText().equals(report)) {
				isReportName = true;
				break;
			}

		}
		return isReportName;
	}

	public void selectReport() {
		for (int i = 0; i < reportsNameList.size(); i++) {
			if (reportsNameList.get(i).getText().equals(LoginAndSelectModule.testData.get("reportName"))) {
				List<WebElement> deleteButtons = reportsNameList.get(i)
						.findElements(By.xpath(".//preceding::span[contains(@class, 'mat-radio-container')]"));
				driver.manage().timeouts().implicitlyWait(3600, TimeUnit.SECONDS);
				deleteButtons.get(i).click();
				break;
			}
		}

	}

	public void clickToggleButton() {
		for (WebElement element : reportsNameList) {
			if (element.getText().equals(LoginAndSelectModule.testData.get("reportName"))) {
				List<WebElement> toggleButtons = element
						.findElements(By.xpath(".//following::div[contains(@class, 'mat-slide-toggle-bar')]"));
				driver.manage().timeouts().implicitlyWait(3600, TimeUnit.SECONDS);
				toggleButtons.get(0).click();
				break;
			}

		}
	}
}
