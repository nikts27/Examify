package gr.nikts27.examify.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class JwtProvider {

    private static final SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
    private static final int jwtExpirationMs = 1000 * 60 * 15;
    private static final int refreshTokenExpirationMs = 1000 * 60 * 60 * 24 * 7;

    public static String generateAccessToken(Authentication auth) {
        return getString(auth, jwtExpirationMs);
    }

    public static String generateRefreshToken(Authentication auth) {
        return getString(auth, refreshTokenExpirationMs);
    }

    private static String getString(Authentication auth, int tokenExpiration) {
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String roles = populateAuthoritites(authorities);

        return Jwts.builder()
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + tokenExpiration))
                .claim("username", auth.getName())
                .claim("authorities", roles)
                .signWith(key)
                .compact();
    }

    public static String getUsernameFromToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.get("username", String.class);
        } catch (Exception e) {
            System.err.println("Error parsing JWT: " + e.getMessage());
        }
        return null;
    }


    private static String populateAuthoritites(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auth = new HashSet<String>();
        for(GrantedAuthority ga : authorities){
            auth.add(ga.getAuthority());
        }
        return String.join(",", auth);
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            return true;
        } catch (MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
