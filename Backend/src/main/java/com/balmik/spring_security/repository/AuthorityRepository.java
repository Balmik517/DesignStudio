package com.balmik.spring_security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balmik.spring_security.entity.Authority;
import com.balmik.spring_security.enums.AuthorityEnum;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {
	
	/*Custom query to find an authority by name (e.g., "ROLE_ADMIN")*/
    Authority findByAuthority(AuthorityEnum authority);
}
