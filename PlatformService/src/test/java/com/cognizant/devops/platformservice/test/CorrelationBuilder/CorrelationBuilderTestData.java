/*******************************************************************************
 *  * Copyright 2017 Cognizant Technology Solutions
 *  * 
 *  * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  * use this file except in compliance with the License.  You may obtain a copy
 *  * of the License at
 *  * 
 *  *   http://www.apache.org/licenses/LICENSE-2.0
 *  * 
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 *  * License for the specific language governing permissions and limitations under
 *  * the License.
 *******************************************************************************/
package com.cognizant.devops.platformservice.test.CorrelationBuilder;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;

import com.cognizant.devops.platformcommons.constants.ConfigOptions;

public class CorrelationBuilderTestData extends AbstractTestNGSpringContextTests {
	private static final Logger log = LogManager.getLogger(CorrelationBuilderTestData.class);

	public static void resetConfig(String configDetails) throws IOException {
		Stream<Path> paths = null;
		FileWriter file = null;
		try {
			String configFilePath = System.getenv().get("INSIGHTS_HOME") + File.separator + ConfigOptions.CONFIG_DIR;
			File configFile = null;
			Path dir = Paths.get(configFilePath);
			paths = Files.find(dir, Integer.MAX_VALUE, (path, attrs) -> attrs.isRegularFile()
					&& path.toString().endsWith(ConfigOptions.CORRELATION_TEMPLATE));
			configFile = new File(paths.limit(1).findFirst().get().toFile().getCanonicalPath());
			file = new FileWriter(configFile);
			file.write(configDetails);
			file.flush();
		} catch (Exception e) {
			log.error("Error while resetting config {} ", e.getMessage());
		} finally {
			paths.close();
			file.close();
		}
	}
}
