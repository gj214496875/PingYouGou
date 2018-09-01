package com.pinyougou.manager.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Enzo Cotter on 2018/8/31.
 */
@RestController
@RequestMapping("/login")
public class LoginController {

    @RequestMapping("/name")
    public Map getUserName() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Map map = new HashMap(16);
        map.put("loginName", userName);
        return map;
    }
}
