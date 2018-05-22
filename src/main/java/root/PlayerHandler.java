package root;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class PlayerHandler {
	/* Player registration
	 * Player login
	 * 		If player played at least 1 game in the past, return game result for this game in successful login response for front end to show)
	 * Player validation
	 * Player session tracking
	 * 		Player session starts when he logs in
	 * 		Player session ends when he is logged in and inactive for a configurable amount of time (1 minute by default)
	 * 		Session timeout error should be shown to player if he was inactive (not playing a game) for over a configurable amount of timeout time (1 minute by default)
*/
	
	public static boolean createPlayer(String name, String pw) {
        
		String sql = "INSERT INTO users(uname, pw) VALUES(?,?)";
		boolean success = false;
		System.out.println("here");
        try {        	
        	Connection conn = DriverManager.getConnection(Config.getDbLoc());
        	
        	PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setString(2, pw);
            
            pstmt.executeUpdate();
        	
        	success = true;
        } catch(Exception e) {
        	System.out.println("Error adding player.");
        }
        
        return success;
	}	
}
