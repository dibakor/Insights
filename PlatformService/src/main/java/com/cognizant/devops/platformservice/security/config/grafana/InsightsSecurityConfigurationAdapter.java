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
package com.cognizant.devops.platformservice.security.config.grafana;

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
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.cognizant.devops.platformcommons.config.ApplicationConfigProvider;
import com.cognizant.devops.platformservice.security.config.AuthenticationUtils;
import com.cognizant.devops.platformservice.security.config.InsightsAuthenticationFilter;
import com.cognizant.devops.platformservice.security.config.InsightsCrossScriptingFilter;
import com.cognizant.devops.platformservice.security.config.InsightsCustomCsrfFilter;
import com.cognizant.devops.platformservice.security.config.InsightsExternalAPIAuthenticationFilter;
import com.cognizant.devops.platformservice.security.config.InsightsResponseHeaderWriterFilter;

@ComponentScan(basePackages = { "com.cognizant.devops" })
@Configuration
@EnableWebSecurity
@Conditional(InsightsNativeBeanInitializationCondition.class)
public class InsightsSecurityConfigurationAdapter  {

	private static Logger log = LogManager.getLogger(InsightsSecurityConfigurationAdapter.class);

	@Autowired
	private SpringAccessDeniedHandler springAccessDeniedHandler;

	@Autowired
	private AuthenticationUtils authenticationUtils;

	DefaultSpringSecurityContextSource contextSource;

	private static final String AUTH_TYPE = "NativeGrafana";

	@Bean
	@Conditional(InsightsNativeBeanInitializationCondition.class)
	AuthenticationManager nativeAuthenticationManager() throws Exception {
		if (AUTH_TYPE.equalsIgnoreCase(ApplicationConfigProvider.getInstance().getAutheticationProtocol())) {
			log.debug("message Inside InsightsSecurityConfigurationAdapter, check authentication provider **** ");
			ApplicationConfigProvider.performSystemCheck();
		}
		return new ProviderManager(Arrays.asList(new NativeInitialAuthenticationProvider()));
	}

	/**
	 * SecurityFilterChain for /user/authenticate/** path
	 * This chain handles initial Grafana authentication requests
	 */
	@Bean
	@Order(1)
	@Conditional(InsightsNativeBeanInitializationCondition.class)
	SecurityFilterChain grafanaAuthenticateFilterChain(HttpSecurity http) throws Exception {
		if (AUTH_TYPE.equalsIgnoreCase(ApplicationConfigProvider.getInstance().getAutheticationProtocol())) {
			log.debug("Configuring filter chain for /user/authenticate/**");

			http.securityMatcher("/user/authenticate/**")
				.csrf(AbstractHttpConfigurer::disable)
				.cors(AbstractHttpConfigurer::disable)
				.addFilterBefore(new InsightsCustomCsrfFilter(), org.springframework.security.web.csrf.CsrfFilter.class)
				.addFilterAfter(new InsightsCrossScriptingFilter(), InsightsCustomCsrfFilter.class)
				.addFilterAfter(insightsInitialProcessingFilter(), InsightsCrossScriptingFilter.class)
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
	@Order(2)
	@Conditional(InsightsNativeBeanInitializationCondition.class)
	SecurityFilterChain grafanaExternalApiFilterChain(HttpSecurity http) throws Exception {
		if (AUTH_TYPE.equalsIgnoreCase(ApplicationConfigProvider.getInstance().getAutheticationProtocol())) {
			log.debug("Configuring filter chain for /externalApi/**");

			http.securityMatcher("/externalApi/**")
				.csrf(AbstractHttpConfigurer::disable)
				.cors(AbstractHttpConfigurer::disable)
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
	@Order(3)
	@Conditional(InsightsNativeBeanInitializationCondition.class)
	SecurityFilterChain grafanaMainFilterChain(HttpSecurity http) throws Exception {
		log.debug("message Inside InsightsSecurityConfigurationAdapter ,HttpSecurity **** {} ",
				ApplicationConfigProvider.getInstance().getAutheticationProtocol());

		if (AUTH_TYPE.equalsIgnoreCase(ApplicationConfigProvider.getInstance().getAutheticationProtocol())) {
			log.debug("message Inside InsightsSecurityConfigurationAdapter,HttpSecurity check **** ");

			http.cors(Customizer.withDefaults());

			http.csrf(csrf -> csrf
				.ignoringRequestMatchers(AuthenticationUtils.CSRF_IGNORE.toArray(new String[0]))
				.csrfTokenRepository(authenticationUtils.csrfTokenRepository()));

			http.exceptionHandling(exceptions -> exceptions.accessDeniedHandler(springAccessDeniedHandler));
			http.headers(headers -> headers
				.xssProtection(xss -> xss.headerValue(org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
				.contentSecurityPolicy(csp -> csp.policyDirectives("script-src 'self'"))
				.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

			// Add custom security filters
			http.addFilterBefore(new InsightsCrossScriptingFilter(), org.springframework.security.web.csrf.CsrfFilter.class)
				.addFilterAfter(insightsProcessingFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
				.addFilterAfter(new InsightsResponseHeaderWriterFilter(), org.springframework.security.web.header.HeaderWriterFilter.class);

			http.anonymous(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(authz -> authz
					.requestMatchers("/datasources/**").permitAll()
					.requestMatchers("/datasource/**").permitAll()
					.requestMatchers("/admin/**").hasAuthority("Admin")
					.requestMatchers("/traceability/**").hasAuthority("Admin")
					.requestMatchers("/configure/loadConfigFromResources").permitAll()
					.anyRequest().authenticated());

			http.logout(logout -> logout.logoutSuccessUrl("/"));
		}
		return http.build();
	}

	/**
	 * used to configure WebSecurity ignore
	 */
	 @Bean
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
	public InsightsAuthenticationFilter insightsProcessingFilter() {
		return new InsightsAuthenticationFilter("/**");
	}
	
	/** This bean use for initial level validation
	 * @return
	 */
//	@Bean
	@Conditional(InsightsNativeBeanInitializationCondition.class)
	public InsightsGrafanaAuthenticationFilter insightsInitialProcessingFilter() {
		InsightsGrafanaAuthenticationFilter initialAuthProcessingFilter = new InsightsGrafanaAuthenticationFilter("/user/authenticate/**");
		initialAuthProcessingFilter.setAuthenticationManager(authenticationInitialManager());
		return initialAuthProcessingFilter;
	}
	

	@Conditional(InsightsNativeBeanInitializationCondition.class)
	public InsightsExternalAPIAuthenticationFilter insightsExternalProcessingFilter() {
		return new InsightsExternalAPIAuthenticationFilter();
	}
	
	/** This bean use to validate all subsequent request 
	 * @return
	 */
	protected AuthenticationManager authenticationInitialManager()  {
		return new ProviderManager(Arrays.asList(new NativeInitialAuthenticationProvider()));
	}

	/**
	 * Configure CORS for Spring Security 6
	 */
	//@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(Arrays.asList("*"));
		configuration.setAllowedMethods(Arrays.asList("*"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
