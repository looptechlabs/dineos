# Backend CORS Configuration

Since your frontend (`http://pizzahut.dineos.localhost:3000`) and backend (`http://pizzahut.menuly:8080`) are on different domains, you need to enable CORS on your Java backend.

## Java Spring Boot CORS Configuration

### Option 1: Global CORS Configuration (Recommended)

Create a configuration class in your Java backend:

```java
package com.dineos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Allow all frontend subdomains
        config.addAllowedOriginPattern("http://*.dineos.localhost:3000");
        config.addAllowedOriginPattern("http://*.menuly:3000");
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow all HTTP methods
        config.addAllowedMethod("*");
        
        // How long the response from pre-flight request can be cached
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### Option 2: Controller-Level CORS

Add to your login controller:

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(
    origins = {"http://pizzahut.dineos.localhost:3000", "http://burgerhouse.dineos.localhost:3000"},
    allowCredentials = "true",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
)
public class UserController {
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Your login logic here
    }
}
```

### Option 3: WebMvcConfigurer

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://*.dineos.localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Test CORS Configuration

After applying the configuration, test with:

```bash
curl -X OPTIONS http://pizzahut.menuly:8080/api/users/login \
  -H "Origin: http://pizzahut.dineos.localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

You should see these headers in the response:
```
Access-Control-Allow-Origin: http://pizzahut.dineos.localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST
```

## Restart Required

After adding CORS configuration, **restart your Java backend server** for changes to take effect.
