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
package com.cognizant.devops.platformservice.security.config.jwt;

import java.util.Arrays;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

import com.cognizant.devops.platformcommons.config.ApplicationConfigProvider;
import com.cognizant.devops.platformservice.security.config.AuthenticationUtils;
import com.cognizant.devops.platformservice.security.config.InsightsAuthenticationFilter;
import com.cognizant.devops.platformservice.security.config.InsightsCrossScriptingFilter;
import com.cognizant.devops.platformservice.security.config.InsightsCustomCsrfFilter;
import com.cognizant.devops.platformservice.security.config.InsightsExternalAPIAuthenticationFilter;
import com.cognizant.devops.platformservice.security.config.InsightsResponseHeaderWriterFilter;
import com.cognizant.devops.platformservice.security.config.grafana.SpringAccessDeniedHandler;

@ComponentScan(basePackages = { "com.cognizant.devops" })
@Configuration
@EnableWebSecurity
@Conditional(InsightsJWTBeanInitializationCondition.class)
public class InsightsSecurityConfigurationAdapterJWT {

	private static Logger log = LogManager.getLogger(InsightsSecurityConfigurationAdapterJWT.class);

	@Autowired
	private SpringAccessDeniedHandler springAccessDeniedHandler;

	@Autowired
	private AuthenticationUtils authenticationUtils;

	DefaultSpringSecurityContextSource contextSource;

	static final String AUTHTYPE = "JWT";

	@Bean
	@Conditional(InsightsJWTBeanInitializationCondition.class)
	AuthenticationManager nativeAuthenticationManager() throws Exception {
		log.debug("message Inside InsightsSecurityConfigurationAdapterJWT, AuthenticationManagerBuilder **** {} ",
				ApplicationConfigProvider.getInstance().getAutheticationProtocol());
		if (AUTHTYPE.equalsIgnoreCase(ApplicationConfigProvider.getInstance().getAutheticationProtocol())) {
			log.debug("message Inside InsightsSecurityConfigurationAdapter, check authentication provider **** ");
			ApplicationConfigProvider.performSystemCheck();
		}
		return new ProviderManager(Arrays.asList(jwtAuthenticationProvider()));
	}

	/**
	 * SecurityFilterChain for /user/insightsso/** path
	 * This chain handles initial JWT SSO authentication requests
	 */
	@Bean
	@Order(4)
	@Conditional(InsightsJWTBeanInitializationCondition.class)
	SecurityFilterChain jwtSsoFilterChain(HttpSecurity http) throws Exception {
		if (AUTHTYPE.equalsIgnoreCase(ApplicationConfigProvider.getInstance().getAutheticationProtocol())) {
			log.debug("Configuring filter chain for /user/insightsso/**");

			http.securityMatcher("/user/insightsso/**")
				.csrf(org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer::disable)
				.addFilterBefore(new InsightsCustomCsrfFilter(), org.springframework.security.web.csrf.CsrfFilter.class)
				.addFilterAfter(new InsightsCrossScriptingFilter(), InsightsCustomCsrfFilter.class)
				.addFilterAfter(insightsInitialJWTProcessingFilter(), InsightsCrossScriptingFilter.class)
				.addFilterAfter(new InsightsResponseHeaderWriterFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
				.authorizeHttpRequests(authz -> authz.anyRequest().permitAll());
		}
		return http.build();
	}

	/**
	 * SecurityFilterChain for /externalApi/** path
	 * This chain handles external API authentication
	 */
	@Bean
	@Order(5)
	@Conditional(InsightsJWTBeanInitializationCondition.class)
	SecurityFilterChain jwtExternalApiFilterChain(HttpSecurity http) throws Exception {
		if (AUTHTYPE.equalsIgnoreCase(ApplicationConfigProvider.getInstance().getAutheticationProtocol())) {
			log.debug("Configuring filter chain for /externalApi/**");

			http.securityMatcher("/externalApi/**")
				.csrf(org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer::disable)
				.addFilterBefore(new InsightsCustomCsrfFilter(), org.springframework.security.web.csrf.CsrfFilter.class)
				.addFilterAfter(new InsightsCrossScriptingFilter(), InsightsCustomCsrfFilter.class)
				.addFilterAfter(insightsExternalProcessingFilter(), InsightsCrossScriptingFilter.class)
				.addFilterAfter(new InsightsResponseHeaderWriterFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
				.authorizeHttpRequests(authz -> authz.anyRequest().permitAll());
		}
		return http.build();
	}

	/**
	 * Main SecurityFilterChain for all other requests (/**)
	 * This is the default chain with full security configuration
	 */
	@Bean
	@Order(6)
	@Conditional(InsightsJWTBeanInitializationCondition.class)
	SecurityFilterChain jwtMainFilterChain(HttpSecurity http) throws Exception {
		log.debug("message Inside InsightsSecurityConfigurationAdapterJWT ,HttpSecurity **** {} ",
				ApplicationConfigProvider.getInstance().getAutheticationProtocol());
		if (AUTHTYPE.equalsIgnoreCase(ApplicationConfigProvider.getInstance().getAutheticationProtocol())) {
			log.debug("message Inside InsightsSecurityConfigurationAdapter,HttpSecurity check **** ");

			http.csrf(csrf -> csrf
				.ignoringRequestMatchers(AuthenticationUtils.CSRF_IGNORE.toArray(new String[0]))
				.csrfTokenRepository(authenticationUtils.csrfTokenRepository()));

			http.exceptionHandling(exceptions -> exceptions.accessDeniedHandler(springAccessDeniedHandler));

			// Add custom security filters
			http.addFilterBefore(new InsightsCrossScriptingFilter(), org.springframework.security.web.csrf.CsrfFilter.class)
				.addFilterAfter(insightsJWTProcessingFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
				.addFilterAfter(new InsightsResponseHeaderWriterFilter(), org.springframework.security.web.header.HeaderWriterFilter.class);

			http.headers(headers -> headers.addHeaderWriter(new StaticHeadersWriter("X-FRAME-OPTIONS", "ALLOW-FROM "
					+ApplicationConfigProvider.getInstance().getSingleSignOnConfig().getJwtTokenOriginServerURL())));
			http.sessionManagement(session -> session
					.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
					.maximumSessions(1));

			http.anonymous(anonymous -> anonymous.disable())
				.authorizeHttpRequests(authz -> authz
					.requestMatchers("/datasources/**").permitAll()
					.requestMatchers("/datasource/**").permitAll()
					.requestMatchers("/admin/**").hasAuthority("Admin")
					.requestMatchers("/traceability/**").hasAuthority("Admin")
					.requestMatchers("/configure/loadConfigFromResources").permitAll()
					.anyRequest().authenticated());
		}
		return http.build();
	}

	/**
	 * used to configure WebSecurity ignore
	 */
	 @Bean
	 @Conditional(InsightsJWTBeanInitializationCondition.class)
	    public WebSecurityCustomizer webSecurityCustomizer() {
	        return (web) -> web.ignoring()
	        		.requestMatchers("/datasource/**");
	  }
	


	/**
	 * Used to configure authentication Filter for all Request Matcher
	 *
	 * @return
	 * @throws Exception
	 */
	public InsightsAuthenticationFilter insightsJWTProcessingFilter() throws Exception {
		InsightsAuthenticationFilter filter = new InsightsAuthenticationFilter("/**", nativeAuthenticationManager());
		return filter;
	}
	
	/** This is use to validate Initial API Request
	 * @return
	 */
	public InsightsAuthenticationFilter insightsInitialJWTProcessingFilter() throws Exception {
		InsightsAuthenticationFilter filter = new InsightsAuthenticationFilter("/user/insightsso/**", nativeAuthenticationManager());
		return filter;
	}

	/**
	 * Used to set authenticationManager Native Grafana
	 */
	protected AuthenticationManager authenticationManager() throws Exception {
		return new ProviderManager(Arrays.asList(new JWTAuthenticationProvider()));
	}

	/**
	 * used to setup JWT Authentication provider
	 * 
	 * @return
	 */
	@Conditional(InsightsJWTBeanInitializationCondition.class)
	public JWTAuthenticationProvider jwtAuthenticationProvider() {
		JWTAuthenticationProvider provider = new JWTAuthenticationProvider();
		return provider;
	}
	
	/** This bean use to validate External Request 
	 * @return
	 */
	@Conditional(InsightsJWTBeanInitializationCondition.class)
	public InsightsExternalAPIAuthenticationFilter insightsExternalProcessingFilter() {
		return new InsightsExternalAPIAuthenticationFilter();
	}
}
