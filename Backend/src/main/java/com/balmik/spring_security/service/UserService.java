package com.balmik.spring_security.service;

import com.balmik.spring_security.entity.User;
import com.balmik.spring_security.enums.AuthorityEnum;

public interface UserService {
    User saveUser(User user);
    User getUserByUsername(String userName);
    void assignRoleToUser(String userName, AuthorityEnum roleEnum);
}
