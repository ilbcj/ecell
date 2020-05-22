package com.ilbcj.ecell.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ilbcj.ecell.service.LoginService;


@Order(1)
@WebFilter(filterName = "authFilter", urlPatterns = "/*")
public class AuthFilter implements Filter {
	
	private static final Logger logger = LoggerFactory.getLogger(AuthFilter.class);
	
	private static final String ctx = "/cell";
	private String redirectURL;
	
	private LoginService loginService;
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		if( loginService == null ) {
			ServletContext servletContext = filterConfig.getServletContext();
	        ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
	        loginService = ctx.getBean("loginService", LoginService.class);
		}
		redirectURL = "login.html";
	}
	
	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
	    throws IOException, ServletException {
		
		HttpServletRequest httpRequest = (HttpServletRequest)servletRequest;
		HttpServletResponse httpResponse = (HttpServletResponse)servletResponse;
		String path=httpRequest.getRequestURI();
		//for create jsessionid cookie
		httpRequest.getSession();
		String jsessionid = getJSESSIONID( httpRequest );
		
		if( jsessionid == null || jsessionid.isEmpty() ) {
			httpResponse.sendRedirect(httpRequest.getContextPath() + "/" + redirectURL);
			return; 
		}
		
		logger.debug("[authFilter]" + path);
		
		if( !pathInWhiteList( path ) ) {
			
			boolean hasLogged = checkLoggedStatus( jsessionid );
			if( !hasLogged ) {
				httpResponse.sendRedirect(httpRequest.getContextPath() + "/" + redirectURL);
				return;
			}
		}
		
		filterChain.doFilter(servletRequest,servletResponse);
	}
	
	private boolean pathInWhiteList( String path ) {
		String[] stylelist = ".js;.css;.png;.ico;woff2;.ttf;.woff;.eot".split(";");
		for(String item : stylelist ) {
			if(path.endsWith(item)) {
				return true;
			}
		}
		
		String[] whitelists = (ctx + "/login.html;" + ctx + "/login/idpwd;" + ctx + "/login/commonLogin;*.css;*.js").split(";");
		for(String item : whitelists ) {
			if(path.equals(item)) {
				return true;
			}
		}
		return false;
	}
	
	private String getJSESSIONID( HttpServletRequest httpRequest ) {
		String jsessionid = null;
		if( httpRequest.isRequestedSessionIdFromURL() ) {		
			logger.debug("from URL");
		}
		else if( httpRequest.isRequestedSessionIdFromCookie() ) {		
			Cookie[] cookies = httpRequest.getCookies();
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("JSESSIONID")) {
					jsessionid = cookie.getValue();
					logger.debug(jsessionid);
					break;
				}
			}
		}
		else if( httpRequest.isRequestedSessionIdValid() ) {
			logger.debug("from valid");
		}
		
		if( jsessionid == null || jsessionid.isEmpty() ) {
			logger.debug("jsessionid is empty");
		}
		
		return jsessionid;
	}
	
	private boolean checkLoggedStatus(String jsessionid) {
		if(jsessionid == null) {
			logger.debug( "jsessionid is empty" );
			return false;
		}
		logger.debug("loginService : " + loginService);
		return loginService.checkLoggedStatus(jsessionid);
	}
}