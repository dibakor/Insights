/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 *   
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * 	of the License at
 *   
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *   
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

package com.cognizant.devops.platformservice.security.config;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.util.StreamUtils;

import com.cognizant.devops.platformcommons.core.util.ValidationUtils;
import com.cognizant.devops.platformcommons.exception.InsightsCustomException;
import com.cognizant.devops.platformservice.rest.datatagging.constants.DatataggingConstants;
import com.cognizant.devops.platformservice.rest.util.PlatformServiceUtil;

/**
 * This class is responsible to validate Request Header, Cookies and Paramanter
 * 
 * @author 716660
 *
 */
public final class RequestWrapper extends HttpServletRequestWrapper {
	private static Logger log = LogManager.getLogger(RequestWrapper.class);
	HttpServletRequest request;
	HttpServletResponse response;
	Boolean validationStatus = false;

	/**
	 * Cached request body bytes. This allows the body to be read multiple times,
	 * which is required for Spring Security 6 compatibility where filters may
	 * need to read the body before the controller processes it.
	 */
	private byte[] cachedBody;

	/**
	 * Constructor to set HttpServletRequest and HttpServletResponse
	 *
	 * @param servletRequest
	 * @param servletResponse
	 * @throws InsightsCustomException
	 */
	public RequestWrapper(HttpServletRequest servletRequest, HttpServletResponse servletResponse) throws InsightsCustomException {
		super(servletRequest);
		this.request = servletRequest;
		this.response = servletResponse;

		// Cache the request body for Spring Security 6 compatibility
		// This allows multiple reads of the input stream
		try {
			this.cachedBody = StreamUtils.copyToByteArray(servletRequest.getInputStream());
		} catch (IOException e) {
			log.warn("Unable to cache request body: {}", e.getMessage());
			this.cachedBody = new byte[0];
		}

		validatAllHeaders();
		inValidateAllCookies();
		validateAllParameter();
	}

	/**
	 * Returns a cached ServletInputStream that can be read multiple times.
	 * Required for Spring Security 6 where the CSRF filter or other filters
	 * may read the body before the controller.
	 */
	@Override
	public ServletInputStream getInputStream() throws IOException {
		return new CachedBodyServletInputStream(this.cachedBody);
	}

	/**
	 * Returns a BufferedReader that reads from the cached body.
	 */
	@Override
	public BufferedReader getReader() throws IOException {
		String encoding = getCharacterEncoding();
		if (encoding == null) {
			encoding = "UTF-8";
		}
		return new BufferedReader(new InputStreamReader(getInputStream(), encoding));
	}

	/**
	 * Validate and Apply the XSS filter to the parameters
	 * 
	 * @throws InsightsCustomException
	 */
	public void validateAllParameter() throws InsightsCustomException {
		Map<String, String[]> parameterMap = request.getParameterMap();
		int maxParamCount = 50;
		int paramCount = parameterMap.size();
		if(paramCount > maxParamCount){
			log.debug("In validateAllParameter ==== parameter count exceeds max limit {}",paramCount);
			throw new InsightsCustomException("In validateAllParameter ==== parameter count exceeds max limit");
		} else {
			for(Map.Entry<String,String[]> entry : parameterMap.entrySet()){
				
				String paramName = ValidationUtils.cleanXSS(entry.getKey());
				ValidationUtils.cleanXSS(request.getParameter(paramName));
			}
			log.debug("In validateAllParameter ==== Completed ");
		}
	}

	/**
	 * Validate and Apply the XSS filter to the all Headers
	 * 
	 * @throws InsightsCustomException
	 */
	public void validatAllHeaders() throws InsightsCustomException {

		Enumeration<String> headerNames = request.getHeaderNames();
		List<String> headerNameslist = Collections.list(headerNames);
		StringBuilder headerInfo = new StringBuilder();
		int maxParamCount = 50;
		int headersCount = headerNameslist.size();
		if(headersCount > maxParamCount ) {
			log.debug("In validatAllHeaders ==== headers count exceeds max limit {}", headersCount);
			throw new InsightsCustomException("In validatAllHeaders ==== headers count exceeds max limit ");
		} else {
			for (int i =0; i < headersCount; i++ ) {
				String headerName = headerNameslist.get(i);
				String headersValue = request.getHeader(headerName);
				// Null check to prevent NPE when header value is null
				if (headersValue != null) {
					headerInfo.append(headerName.concat(DatataggingConstants.VALIDATE_ALLHEADERS_EQUALS).concat(headersValue).concat(DatataggingConstants.COMMA));
					ValidationUtils.cleanXSS(headerName, headersValue);
				} else {
					headerInfo.append(headerName.concat(DatataggingConstants.VALIDATE_ALLHEADERS_EQUALS).concat("null").concat(DatataggingConstants.COMMA));
				}
			}
			log.debug("In validatedAllHeaders  ==== Completed {} ",headerInfo);
		}
	}

	/**
	 * Validate request cookies from XSS and HTTP_Response_Splitting
	 */
	public Cookie[] inValidateAllCookies() {
		Cookie[] cookies = null;
		cookies = PlatformServiceUtil.validateCookies(request.getCookies());
		log.debug(" in RequestWrapper cookies ==== Complated ");
		return cookies;
	}

	/**
	 * Inner class that wraps a byte array as a ServletInputStream.
	 * Allows multiple reads of the same data which is required for
	 * Spring Security 6 filter chain compatibility.
	 */
	private static class CachedBodyServletInputStream extends ServletInputStream {

		private final ByteArrayInputStream inputStream;

		public CachedBodyServletInputStream(byte[] cachedBody) {
			// Defensive null check
			this.inputStream = new ByteArrayInputStream(cachedBody != null ? cachedBody : new byte[0]);
		}

		@Override
		public boolean isFinished() {
			return inputStream.available() == 0;
		}

		@Override
		public boolean isReady() {
			return true;
		}

		@Override
		public void setReadListener(ReadListener readListener) {
			throw new UnsupportedOperationException("ReadListener is not supported");
		}

		@Override
		public int read() throws IOException {
			return inputStream.read();
		}

		@Override
		public int read(byte[] b) throws IOException {
			return inputStream.read(b);
		}

		@Override
		public int read(byte[] b, int off, int len) throws IOException {
			return inputStream.read(b, off, len);
		}

		@Override
		public int available() throws IOException {
			return inputStream.available();
		}
	}

}
