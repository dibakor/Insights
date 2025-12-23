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
package com.cognizant.devops.platformservice.security.config;

import java.io.IOException;
import java.util.UUID;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import com.cognizant.devops.platformcommons.constants.LogMessageConstants;

public class InsightsCustomCsrfFilter extends OncePerRequestFilter {

	private static Logger log = LogManager.getLogger(InsightsCustomCsrfFilter.class);
	

	/**
	 * Filter used to extract CSRF token and add it in response header.
	 * In Spring Security 6, CSRF tokens are deferred by default.
	 * This filter forces the token to be loaded by calling getToken().
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		long startTime = System.currentTimeMillis();
		try {
			updateLogInformation(request);
			log.debug(" Inside Filter == CustomCsrfFilter token ........ {} method {} ", request.getRequestURL(),
					request.getMethod());

			// Try to get CSRF token from request attribute (Spring Security 6 compatible)
			CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
			if (csrf == null) {
				// Also try the default attribute name used by Spring Security
				csrf = (CsrfToken) request.getAttribute("_csrf");
			}

			if (csrf != null) {
				// IMPORTANT: In Spring Security 6, calling getToken() forces the deferred token to load
				String token = csrf.getToken();
				log.debug("CSRF token loaded: {}", token != null ? "present" : "null");

				if (token != null) {
					Cookie cookie = WebUtils.getCookie(request, AuthenticationUtils.CSRF_COOKIE_NAME);
					if (cookie == null || !token.equals(cookie.getValue())) {
						cookie = new Cookie(AuthenticationUtils.CSRF_COOKIE_NAME, token);
						cookie.setPath("/");
						response.addCookie(cookie);
						log.debug("CSRF cookie set with token");
					}
				}
			} else {
				log.debug("CSRF token not available for url {} (may be ignored endpoint)", request.getRequestURL());
			}

			filterChain.doFilter(request, response);
		} catch (Exception e) {
			log.error(e);
		} finally {
			long processingTime = System.currentTimeMillis() - startTime;
			ThreadContext.put(LogMessageConstants.PROCESSINGTIME, String.valueOf(processingTime));
			log.debug(" processing time for method {} is {}",request.getRequestURI() , processingTime);
		}
		log.debug("Out doFilter CustomCsrfFilter ...............");
	}

	private void updateLogInformation(HttpServletRequest request) {
		final String token;
		
		token = UUID.randomUUID().toString().toUpperCase().replace("-", "");

		ThreadContext.put(LogMessageConstants.PROCESSINGTIME, String.valueOf(0));
		ThreadContext.put(LogMessageConstants.TRACEID, token);
		ThreadContext.put(LogMessageConstants.TYPE, LogMessageConstants.APILOGSTYPE);
		ThreadContext.put(LogMessageConstants.HTTPMETHOD, request.getMethod());
		ThreadContext.put(LogMessageConstants.ENDPOINT, request.getRequestURI());
	}
}