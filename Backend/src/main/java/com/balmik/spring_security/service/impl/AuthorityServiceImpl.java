package com.balmik.spring_security.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balmik.spring_security.entity.Authority;
import com.balmik.spring_security.enums.AuthorityEnum;
import com.balmik.spring_security.repository.AuthorityRepository;
import com.balmik.spring_security.service.AuthorityService;

@Service
public class AuthorityServiceImpl implements AuthorityService{

	@Autowired
    private AuthorityRepository authorityRepository;

    @Override
    public Authority saveAuthority(Authority authority) {
        return authorityRepository.save(authority);
    }

    @Override
    public Authority getAuthorityByName(AuthorityEnum authorityName) {
        return authorityRepository.findByAuthority(authorityName);
    }

    @Override
    public List<Authority> getAllAuthorities() {
        return authorityRepository.findAll();
    }

}
