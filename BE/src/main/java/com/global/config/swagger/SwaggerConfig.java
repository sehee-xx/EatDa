package com.global.config.swagger;

import static io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuthentication";

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI()
                .components(createSecurityComponents())
                .security(List.of(createSecurityRequirement()))
                .servers(createServers())
                .info(createApiInfo());
    }

    // JWT 인증 관련 설정 생성
    private Components createSecurityComponents() {
        SecurityScheme securityScheme = new SecurityScheme()
                .type(HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        Components components = new Components();
        components.addSecuritySchemes(SECURITY_SCHEME_NAME, securityScheme);
        return components;
    }

    // 보안 요구사항 설정
    private SecurityRequirement createSecurityRequirement() {
        SecurityRequirement securityRequirement = new SecurityRequirement();
        securityRequirement.addList(SECURITY_SCHEME_NAME);
        return securityRequirement;
    }

    // API 정보 설정
    private Info createApiInfo() {
        return new Info()
                .title("EatDa API Document")
                .description("잇다 API 명세서")
                .version("1.0.0");
    }

    // 서버 정보 설정
    private List<Server> createServers() {
        Server localServer = new Server().url("http://localhost:8080");
        Server devServer = new Server().url("https://eatda.com");
        return List.of(localServer, devServer);
    }
}
