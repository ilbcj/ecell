package com.ilbcj.ecell.controller;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ilbcj.ecell.service.LoginService;
import com.ilbcj.ecell.util.R;

@RestController
@RequestMapping("login")
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	private LoginService loginService;

	@Autowired
	private HttpServletRequest httpRequest;
	@SuppressWarnings("unused")
	@Autowired
	private HttpServletResponse httpResponse;

	@RequestMapping(value = "/idpwd", method = RequestMethod.GET)
	public R loginPwd(@RequestParam(value = "username") String adminId, @RequestParam(value = "password") String pwd) {
		return loginPwdPost(adminId, pwd);
	}

	@RequestMapping(value = "/name", method = RequestMethod.POST)
	public R getAdminName() {
		String sessionid = getJSESSIONID();
		String result = loginService.getAdminName(sessionid);
		if (result != null) {
			return R.ok().put("name", result);
		}
		return R.error("管理员名称查找失败");
	}

	@RequestMapping(value = "/idpwd", method = RequestMethod.POST)
	public R loginPwdPost(@RequestParam(value = "username") String adminId,
			@RequestParam(value = "password") String pwd) {
		String sessionid = getJSESSIONID();
//		if( sessionid == null || sessionid.isEmpty() ) {
//			HttpSession hs = httpRequest.getSession();
//			sessionid = hs.getId();
//			Cookie cookie = new Cookie("JSESSIONID", sessionid);
//			httpResponse.addCookie(cookie);
//		}
		boolean isLogin = loginService.isLogined(sessionid);
		boolean isLogout = loginService.isLogout(adminId);
		if (isLogout) {
			return R.error("该账号已经被注销！");
		}
		if (isLogin) {
			return R.error("该浏览器已经有账号登录系统，请关闭浏览器或注销重新登录！");
		}
		boolean result = loginService.loginPwd(adminId, pwd, sessionid);
		if (result) {
			return R.ok();
		}
		return R.ok().put("code", 70001).put("msg", "管理员不存在，或口令不正确.");
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public R logout() {
		return logoutPost();
	}

	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	public R logoutPost() {
		String sessionid = getJSESSIONID();
		loginService.logout(sessionid);
		return R.ok();
	}

	@RequestMapping(value = "/user/password", method = RequestMethod.POST)
	public R changePwdPost(@RequestParam(value = "password") String password,
			@RequestParam(value = "newPassword") String newPassword) {
		String sessionid = getJSESSIONID();
		boolean result = false;
		if (sessionid != null) {
			result = loginService.changeAdminPassword(sessionid, password, newPassword);
		} else {
			return R.error("登录异常，修改密码失败，请重新登录后重试！");
		}
		if (result) {
			return R.ok();
		}
		return R.error(-70004, "修改口令失败");
	}
	@RequestMapping(value = "/user/password", method = RequestMethod.GET)
	public R changePwdGet(@RequestParam(value = "password") String password,
			@RequestParam(value = "newPassword") String newPassword) {
		return changePwdPost(password, newPassword);
	}

//	private String generateSESSIONID() {
//		String sessionId = UUID.randomUUID().toString();
//		return sessionId;
//	}
	
	/**
	 * 远程服务登录
	 * @param parm
	 * @return
	 */
	@RequestMapping(value = "/commonLogin", method = RequestMethod.POST)
	public R CommonLogin(@RequestBody Map<String,Object> parm) {
		if(parm.isEmpty()) {
			return R.error("登录参数为空");
		}
		return loginService.CommonLogin(parm);
	}

	private String getJSESSIONID() {
		String jsessionid = "";
		if (httpRequest.isRequestedSessionIdFromURL()) {
			logger.debug("from URL");
		} else if (httpRequest.isRequestedSessionIdFromCookie()) {
			Cookie[] cookies = httpRequest.getCookies();
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("JSESSIONID")) {
					jsessionid = cookie.getValue();
					// jsessionid =UUID.randomUUID().toString().replaceAll("-", "");
					break;
				}
			}
		} else if (httpRequest.isRequestedSessionIdValid()) {
			logger.debug("from valid");
		}

		return jsessionid;
	}
}
