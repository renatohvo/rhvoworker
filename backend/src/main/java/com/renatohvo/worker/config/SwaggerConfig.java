package com.renatohvo.worker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))
                .paths(PathSelectors.any())
                .build()
        		.apiInfo(metaData());
        
    }
    
    private ApiInfo metaData() {
    	return new ApiInfoBuilder().title("RHVO Workers API")
    		.description("\"Spring Boot REST API for CRUD - Criação, Consulta, Atualização e Destruição de Dados de Trabalhadores.\"")
    		.version("1.0.0")
    		.contact(new Contact("Renato Henrique", "https://linkedin.com/in/renatohvo", "renatohvo@gmail.com"))
    		.build();
    }
}