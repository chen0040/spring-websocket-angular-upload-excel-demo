package com.github.chen0040.bootslingshot.services;

import com.github.chen0040.bootslingshot.viewmodels.Account;
import com.github.chen0040.bootslingshot.viewmodels.LoginObj;
import com.github.chen0040.bootslingshot.viewmodels.TokenObj;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AccountApiImpl implements AccountApi {

    private Set<Account> database = new HashSet<>();
    private Map<String, Account> sessions = new HashMap<>();

    public AccountApiImpl(){
        database.add(new Account("admin", "admin", "admin-123", "xs0040@gmail.com", "Admin", "Admin"));
        database.add(new Account("user", "user", "user-123", "xs0040@gmail.com", "Xianshun", "Chen"));
    }

    @Override
    public Account login(LoginObj loginObj) {
        final String username = loginObj.getUsername();
        final String password = loginObj.getPassword();
        for(Account account : database) {
            if(account.getUsername().equalsIgnoreCase(username) && account.getPassword().equals(password)) {
                return account;
            }
        }
        return Account.createAlert("Invalid login");
    }

    @Override
    public TokenObj validateUser(TokenObj tokenObj) {
        final String token = tokenObj.getToken();
        tokenObj.setUsername("");
        for(String sessionToken : sessions.keySet()) {
            if(sessionToken.equals(token)) {
                tokenObj.setUsername(sessions.get(token).getUsername());
                break;
            }
        }
        return tokenObj;
    }

    @Override
    public TokenObj logout(TokenObj tokenObj) {
        final String token = tokenObj.getToken();

        for(String sessionToken : sessions.keySet()) {
            if(sessionToken.equals(token)) {
                sessions.remove(sessionToken);
                tokenObj.setUsername("");
                break;
            }
        }
        return tokenObj;
    }
}
