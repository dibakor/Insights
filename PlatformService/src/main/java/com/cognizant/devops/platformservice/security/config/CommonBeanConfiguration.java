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

import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.io.HttpClientConnectionManager;
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder;
import org.apache.hc.core5.ssl.SSLContexts;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import com.cognizant.devops.platformcommons.config.ApplicationConfigProvider;

@ComponentScan(basePackages = { "com.cognizant.devops.platformservice.*" })
@Configuration
public class CommonBeanConfiguration {
	private static Logger LOG = LogManager.getLogger(CommonBeanConfiguration.class);

	/**
	 * used to read and write byte arrays based on filter
	 * 
	 * @return
	 */
	@Bean
	public ByteArrayHttpMessageConverter byteArrayHttpMessageConverter() {
		final ByteArrayHttpMessageConverter arrayHttpMessageConverter = new ByteArrayHttpMessageConverter();
		arrayHttpMessageConverter.setSupportedMediaTypes(getSupportedMediaTypes());
		return arrayHttpMessageConverter;
	}

	/**
	 * byte arrays filter
	 * 
	 * @return
	 */
	private List<MediaType> getSupportedMediaTypes() {
		final List<MediaType> list = new ArrayList<MediaType>();
		list.add(MediaType.IMAGE_JPEG);
		list.add(MediaType.IMAGE_PNG);
		list.add(MediaType.APPLICATION_OCTET_STREAM);
		return list;
	}

	/**
	 * used for CORS validation, A container for CORS configuration to validate
	 * against the actual origin, HTTP methods, and headers of a given request.
	 * 
	 * @return
	 */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		LOG.debug("Setting up corsConfigurationSource ");
		CorsConfiguration configuration = new CorsConfiguration();
        List<String> allowedOriginHost = new ArrayList<>(ApplicationConfigProvider.getInstance().getTrustedHosts());
		LOG.debug("Setting up corsConfigurationSource, Allow Origin host are {} ", allowedOriginHost);
		configuration.setAllowedOrigins(allowedOriginHost);
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"));
		configuration.setAllowCredentials(true);
		configuration.setAllowedHeaders(Arrays.asList("*"));
		UrlBasedCorsConfigurationSource sourceCors = new UrlBasedCorsConfigurationSource();
		sourceCors.registerCorsConfiguration("/**", configuration);
		return sourceCors;
	}

	/**
	 * used for initialization of MultipartResolver ,MultipartResolver check files
	 * in our application it apply before initialization. It restrict any unwanted
	 * file attact in our application.
	 *
	 * @return
	 */
	@Bean(name = "filterMultipartResolver")
	public StandardServletMultipartResolver multipartResolver() {
		LOG.debug(" In multipartResolver ");
		StandardServletMultipartResolver resolver = new StandardServletMultipartResolver();
		return resolver;
	}

	/**
	 * Configure RestTemplate with SSL context that bypasses certificate validation
	 * ONLY for development/testing environments - NOT for production
	 *
	 * @return RestTemplate configured with custom HTTP client
	 */
	@Bean
	@Profile({"dev", "test", "local", "!prod"})
	public RestTemplate restTemplateInsecure() {
		try {
			// Create a trust manager that accepts all certificates
			TrustManager[] trustAllCerts = new TrustManager[] {
				new X509TrustManager() {
					@Override
					public X509Certificate[] getAcceptedIssuers() { return null; }
					@Override
					public void checkClientTrusted(X509Certificate[] certs, String authType) { }
					@Override
					public void checkServerTrusted(X509Certificate[] certs, String authType) { }
				}
			};

			// Create SSL context that uses our custom trust manager
			SSLContext sslContext = SSLContext.getInstance("TLS");
			sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

			// Create HTTP client connection manager with custom SSL context
			HttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder
				.create()
				.setSSLSocketFactory(SSLConnectionSocketFactoryBuilder
					.create()
					.setSslContext(sslContext)
					.setHostnameVerifier(NoopHostnameVerifier.INSTANCE)
					.build())
				.build();

			// Create HTTP client with custom connection manager
			org.apache.hc.client5.http.classic.HttpClient httpClient = HttpClients.custom()
				.setConnectionManager(connectionManager)
				.build();

			// Create request factory with custom HTTP client
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			requestFactory.setHttpClient(httpClient);

			return new RestTemplate(requestFactory);
		} catch (Exception e) {
			LOG.error("Error configuring RestTemplate with custom SSL context", e);
			return new RestTemplate();
		}
	}

	/**
	 * Configure secure RestTemplate for production environments
	 * Uses default SSL certificate validation
	 *
	 * @return RestTemplate with default SSL validation
	 */
	@Bean
	@Profile("prod")
	public RestTemplate restTemplate() {
		LOG.info("Creating secure RestTemplate for production environment");
		return new RestTemplate();
	}
}
